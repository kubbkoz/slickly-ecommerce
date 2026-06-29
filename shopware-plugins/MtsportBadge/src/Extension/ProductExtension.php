<?php declare(strict_types=1);

namespace Mtsport\Badge\Extension;

use Mtsport\Badge\Content\Badge\Aggregate\BadgeProduct\BadgeProductDefinition;
use Mtsport\Badge\Content\Badge\BadgeDefinition;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

/**
 * Pridáva pole `mtsportBadges` (ManyToMany) na core ProductDefinition.
 *
 * - Použitie v admin: Product detail Vue extension číta product.extensions.mtsportBadges
 * - Použitie v Store API: includes `extensions.mtsportBadges` → vráti pole badge IDs
 * - Pivot: mtsport_badge_product (cez BadgeProductDefinition)
 *
 * ApiAware flag → exposnuté cez Admin API + Store API.
 */
class ProductExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new ManyToManyAssociationField(
                'mtsportBadges',
                BadgeDefinition::class,
                BadgeProductDefinition::class,
                'product_id',
                'badge_id'
            ))->addFlags(new ApiAware())
        );
    }

    public function getDefinitionClass(): string
    {
        return ProductDefinition::class;
    }

    public function getEntityName(): string
    {
        return 'product';
    }
}
