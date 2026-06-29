<?php declare(strict_types=1);

namespace Mtsport\ProductPrices\Installer;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\CustomField\CustomFieldTypes;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Registers custom field set `mtsport_product_prices`.
 *
 * IMPORTANT: This field set HAS a `product` entity relation.
 * Reason: The Shopware Store API only returns customFields whose set is related to
 * the queried entity. Without the `product` relation, `product.customFields` comes
 * back as `{}` over the Store API (Admin API is unaffected) and the storefront PDP
 * cannot read MOC/PMOC. The relation also makes the fields render in the product
 * "Specifikace" → "Vlastní pole" tab (accepted trade-off); the custom Ceny-card
 * injection in extension/sw-product-detail-base/index.js keeps working alongside it.
 *
 * Fields:
 *   mtsport_moc       (float) — Maloobchodná odporúčaná cena (MOC), brutto €
 *   mtsport_pmoc      (float) — Pôvodná maloobchodná odporúčaná cena (PMOC), brutto €
 *   mtsport_b2b_gross (float) — B2B Cena brutto € (manual input)
 *   mtsport_b2b_net   (float) — B2B Cena netto € (auto = gross / 1.23)
 *
 * Import column mapping:
 *   customFields.mtsport_moc        → decimal, e.g. 329.99
 *   customFields.mtsport_pmoc       → decimal, e.g. 399.99
 *   customFields.mtsport_b2b_gross  → decimal, e.g. 199.99
 *   customFields.mtsport_b2b_net    → decimal, e.g. 162.59 (auto-recalc on admin edit)
 */
class CustomFieldInstaller
{
    private const FIELD_SET_NAME = 'mtsport_product_prices';

    /** @var array<int, array{name: string, position: int, labels: array<string, string>}> */
    private const FIELDS = [
        [
            'name'     => 'mtsport_moc',
            'position' => 1,
            'labels'   => [
                'en-GB' => 'Retail Recommended Price — MOC (brutto €)',
                'sk-SK' => 'Maloobchodná odporúčaná cena — MOC (brutto €)',
            ],
        ],
        [
            'name'     => 'mtsport_pmoc',
            'position' => 2,
            'labels'   => [
                'en-GB' => 'Original Retail Recommended Price — PMOC (brutto €)',
                'sk-SK' => 'Pôvodná maloobchodná odporúčaná cena — PMOC (brutto €)',
            ],
        ],
        [
            'name'     => 'mtsport_b2b_gross',
            'position' => 3,
            'labels'   => [
                'en-GB' => 'B2B Price (brutto €)',
                'sk-SK' => 'B2B Cena (brutto €)',
            ],
        ],
        [
            'name'     => 'mtsport_b2b_net',
            'position' => 4,
            'labels'   => [
                'en-GB' => 'B2B Price (netto €, auto-calculated)',
                'sk-SK' => 'B2B Cena (netto €, automaticky)',
            ],
        ],
    ];

    public function __construct(private readonly ContainerInterface $container) {}

    public function install(Context $context): void
    {
        $setRepo      = $this->container->get('custom_field_set.repository');
        $fieldRepo    = $this->container->get('custom_field.repository');
        $relationRepo = $this->container->get('custom_field_set_relation.repository');

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('name', self::FIELD_SET_NAME));
        $criteria->addAssociation('relations');

        $existing = $setRepo->search($criteria, $context);

        if ($existing->getTotal() === 0) {
            // Fresh install — create field set WITH a `product` relation so the
            // Store API exposes these customFields on product entities.
            $setRepo->create([
                [
                    'name'         => self::FIELD_SET_NAME,
                    'active'       => true,
                    'config'       => [
                        'label' => [
                            'en-GB' => 'MT-SPORT Prices (MOC/PMOC/B2B)',
                            'sk-SK' => 'MT-SPORT Ceny (MOC/PMOC/B2B)',
                        ],
                    ],
                    'relations'    => [['entityName' => 'product']],
                    'customFields' => array_map(
                        fn ($f) => $this->buildFieldConfig($f),
                        self::FIELDS
                    ),
                ],
            ], $context);

            return;
        }

        // Field set exists — ensure `product` relation present + all fields registered.
        $set   = $existing->first();
        $setId = $set->getId();

        $relations          = $set->getRelations();
        $hasProductRelation = false;
        if ($relations !== null) {
            foreach ($relations->getElements() as $rel) {
                if ($rel->getEntityName() === 'product') {
                    $hasProductRelation = true;
                    break;
                }
            }
        }

        if (!$hasProductRelation) {
            $relationRepo->create([
                ['customFieldSetId' => $setId, 'entityName' => 'product'],
            ], $context);
        }

        foreach (self::FIELDS as $field) {
            $this->ensureField($setId, $field, $fieldRepo, $context);
        }
    }

    public function uninstall(Context $context): void
    {
        $setRepo = $this->container->get('custom_field_set.repository');

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('name', self::FIELD_SET_NAME));

        $result = $setRepo->search($criteria, $context);
        if ($result->getTotal() === 0) {
            return;
        }

        $ids = $result->getEntities()->map(fn ($e) => ['id' => $e->getId()])->getElements();
        $setRepo->delete(array_values($ids), $context);
    }

    /**
     * @param array{name: string, position: int, labels: array<string, string>} $field
     */
    private function buildFieldConfig(array $field): array
    {
        return [
            'name'   => $field['name'],
            'type'   => CustomFieldTypes::FLOAT,
            'config' => [
                'label'               => $field['labels'],
                'customFieldType'     => 'number',
                'numberType'          => 'float',
                'customFieldPosition' => $field['position'],
            ],
        ];
    }

    /**
     * @param array{name: string, position: int, labels: array<string, string>} $field
     */
    private function ensureField(string $setId, array $field, $fieldRepo, Context $context): void
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('name', $field['name']));

        if ($fieldRepo->search($criteria, $context)->getTotal() > 0) {
            return;
        }

        $payload                     = $this->buildFieldConfig($field);
        $payload['customFieldSetId'] = $setId;
        $fieldRepo->create([$payload], $context);
    }
}
