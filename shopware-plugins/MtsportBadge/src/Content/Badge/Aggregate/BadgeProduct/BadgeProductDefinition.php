<?php declare(strict_types=1);

namespace Mtsport\Badge\Content\Badge\Aggregate\BadgeProduct;

use Mtsport\Badge\Content\Badge\BadgeDefinition;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\CreatedAtField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;
use Shopware\Core\Framework\DataAbstractionLayer\MappingEntityDefinition;

/**
 * Pivot tabuľka mtsport_badge × product — ManyToMany asociácia.
 *
 * Žiadna business logika tu nie je, len definícia mapping záznamu.
 * Shopware DAL automaticky používa túto entity pri ManyToManyAssociationField
 * na BadgeDefinition (products) + ProductExtension (mtsportBadges).
 */
class BadgeProductDefinition extends MappingEntityDefinition
{
    public const ENTITY_NAME = 'mtsport_badge_product';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new FkField('badge_id', 'badgeId', BadgeDefinition::class))
                ->addFlags(new PrimaryKey(), new Required()),

            (new FkField('product_id', 'productId', ProductDefinition::class))
                ->addFlags(new PrimaryKey(), new Required()),

            (new ReferenceVersionField(ProductDefinition::class))
                ->addFlags(new PrimaryKey(), new Required()),

            new CreatedAtField(),

            new ManyToOneAssociationField('badge', 'badge_id', BadgeDefinition::class, 'id', false),

            new ManyToOneAssociationField('product', 'product_id', ProductDefinition::class, 'id', false),
        ]);
    }
}
