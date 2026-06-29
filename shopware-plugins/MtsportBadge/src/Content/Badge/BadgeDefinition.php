<?php declare(strict_types=1);

namespace Mtsport\Badge\Content\Badge;

use Mtsport\Badge\Content\Badge\Aggregate\BadgeProduct\BadgeProductDefinition;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\DateTimeField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FloatField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

/**
 * EntityDefinition pre MT-SPORT product badge.
 *
 * Polia:
 *   - id (UUID, PK)
 *   - name (string)            — Interný admin label
 *   - text (string)            — Zobrazovaný text
 *   - bg_color (string)        — Hex farba pozadia (#22c55e)
 *   - text_color (string)      — Hex farba textu (#ffffff)
 *   - position (string)        — card | pdp | both
 *   - active (bool)            — Zapnutý/vypnutý
 *   - sort (int)               — Poradie
 *   - apply_product_ids (json) — JSON array product UUIDs
 *   - apply_category_ids (json)— JSON array category UUIDs (matchuje categoryTree)
 *   - apply_tag_ids (json)     — JSON array tag UUIDs
 *   - apply_is_new_days (int)  — Badge pre produkty mladšie ako N dní
 *   - apply_has_discount (bool)— Badge pre produkty so zľavou (listPrice)
 */
class BadgeDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'mtsport_badge';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return BadgeEntity::class;
    }

    public function getCollectionClass(): string
    {
        return BadgeCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new ApiAware(), new Required(), new PrimaryKey()),

            (new StringField('name', 'name'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('text', 'text'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('bg_color', 'bgColor'))
                ->addFlags(new ApiAware()),

            (new StringField('text_color', 'textColor'))
                ->addFlags(new ApiAware()),

            (new StringField('position', 'position'))
                ->addFlags(new ApiAware()),

            (new StringField('pdp_position', 'pdpPosition'))
                ->addFlags(new ApiAware()),

            (new StringField('size', 'size'))
                ->addFlags(new ApiAware()),

            (new BoolField('active', 'active'))
                ->addFlags(new ApiAware()),

            (new IntField('sort', 'sort'))
                ->addFlags(new ApiAware()),

            (new LongTextField('apply_product_ids', 'applyProductIds'))
                ->addFlags(new ApiAware()),

            (new LongTextField('apply_category_ids', 'applyCategoryIds'))
                ->addFlags(new ApiAware()),

            (new LongTextField('apply_tag_ids', 'applyTagIds'))
                ->addFlags(new ApiAware()),

            (new LongTextField('apply_manufacturer_ids', 'applyManufacturerIds'))
                ->addFlags(new ApiAware()),

            (new LongTextField('apply_product_stream_ids', 'applyProductStreamIds'))
                ->addFlags(new ApiAware()),

            (new IntField('apply_is_new_days', 'applyIsNewDays'))
                ->addFlags(new ApiAware()),

            (new BoolField('apply_has_discount', 'applyHasDiscount'))
                ->addFlags(new ApiAware()),

            // ── Advanced gating filters (v2.0) — všetky AND-ujú s OR pravidlami ──
            (new FloatField('apply_min_price', 'applyMinPrice'))
                ->addFlags(new ApiAware()),

            (new FloatField('apply_max_price', 'applyMaxPrice'))
                ->addFlags(new ApiAware()),

            (new IntField('apply_min_stock', 'applyMinStock'))
                ->addFlags(new ApiAware()),

            (new IntField('apply_max_stock', 'applyMaxStock'))
                ->addFlags(new ApiAware()),

            (new FloatField('apply_min_rating', 'applyMinRating'))
                ->addFlags(new ApiAware()),

            (new DateTimeField('apply_date_from', 'applyDateFrom'))
                ->addFlags(new ApiAware()),

            (new DateTimeField('apply_date_to', 'applyDateTo'))
                ->addFlags(new ApiAware()),

            // ── ManyToMany na produkty (reverse assignment v product detail) ──
            (new ManyToManyAssociationField(
                'products',
                ProductDefinition::class,
                BadgeProductDefinition::class,
                'badge_id',
                'product_id'
            ))->addFlags(new ApiAware()),
        ]);
    }
}
