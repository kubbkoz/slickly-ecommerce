<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Redemption;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\DateTimeField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class LoyaltyRedemptionDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'loyalty_redemption';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return LoyaltyRedemptionEntity::class;
    }

    public function getCollectionClass(): string
    {
        return LoyaltyRedemptionCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new ApiAware(), new Required(), new PrimaryKey()),
            (new IdField('customer_id', 'customerId'))->addFlags(new ApiAware(), new Required()),
            (new IdField('reward_id', 'rewardId'))->addFlags(new ApiAware(), new Required()),
            (new StringField('reward_name', 'rewardName'))->addFlags(new ApiAware()),
            (new StringField('promotion_code', 'promotionCode'))->addFlags(new ApiAware(), new Required()),
            (new IntField('points_spent', 'pointsSpent'))->addFlags(new ApiAware(), new Required()),
            (new StringField('status', 'status'))->addFlags(new ApiAware()),
            (new DateTimeField('expires_at', 'expiresAt'))->addFlags(new ApiAware()),
            (new DateTimeField('used_at', 'usedAt'))->addFlags(new ApiAware()),
        ]);
    }
}
