<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Redemption;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                         add(LoyaltyRedemptionEntity $entity)
 * @method LoyaltyRedemptionEntity[]    getElements()
 * @method LoyaltyRedemptionEntity|null first()
 * @method LoyaltyRedemptionEntity|null last()
 */
class LoyaltyRedemptionCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return LoyaltyRedemptionEntity::class;
    }
}
