<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Level;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class LoyaltyLevelDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'loyalty_level';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return LoyaltyLevelEntity::class;
    }

    public function getCollectionClass(): string
    {
        return LoyaltyLevelCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new ApiAware(), new Required(), new PrimaryKey()),
            (new IntField('level', 'level'))->addFlags(new ApiAware(), new Required()),
            (new StringField('name', 'name'))->addFlags(new ApiAware(), new Required()),
            (new IntField('min_points', 'minPoints'))->addFlags(new ApiAware(), new Required()),
            (new StringField('color', 'color'))->addFlags(new ApiAware(), new Required()),
            (new StringField('color_type', 'colorType'))->addFlags(new ApiAware()),
        ]);
    }
}
