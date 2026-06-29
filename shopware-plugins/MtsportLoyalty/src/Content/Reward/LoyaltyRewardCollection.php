<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Reward;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                     add(LoyaltyRewardEntity $entity)
 * @method LoyaltyRewardEntity[]    getElements()
 * @method LoyaltyRewardEntity|null first()
 * @method LoyaltyRewardEntity|null last()
 */
class LoyaltyRewardCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return LoyaltyRewardEntity::class;
    }
}
