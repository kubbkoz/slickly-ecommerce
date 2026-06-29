<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Reward;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FloatField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class LoyaltyRewardDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'loyalty_reward';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return LoyaltyRewardEntity::class;
    }

    public function getCollectionClass(): string
    {
        return LoyaltyRewardCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new ApiAware(), new Required(), new PrimaryKey()),
            (new StringField('name', 'name'))->addFlags(new ApiAware(), new Required()),
            (new LongTextField('description', 'description'))->addFlags(new ApiAware()),
            (new IntField('points_required', 'pointsRequired'))->addFlags(new ApiAware(), new Required()),
            (new StringField('type', 'type'))->addFlags(new ApiAware(), new Required()),
            (new FloatField('discount_value', 'discountValue'))->addFlags(new ApiAware()),
            (new IdField('rule_id', 'ruleId'))->addFlags(new ApiAware()),
            (new IdField('gift_product_id', 'giftProductId'))->addFlags(new ApiAware()),
            (new FloatField('min_order_value', 'minOrderValue'))->addFlags(new ApiAware()),
            (new IntField('max_uses_per_customer', 'maxUsesPerCustomer'))->addFlags(new ApiAware()),
            (new IntField('valid_days', 'validDays'))->addFlags(new ApiAware()),
            (new BoolField('is_active', 'isActive'))->addFlags(new ApiAware()),
        ]);
    }
}
