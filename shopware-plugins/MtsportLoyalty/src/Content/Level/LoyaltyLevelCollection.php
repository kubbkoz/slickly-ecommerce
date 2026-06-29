<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Level;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                    add(LoyaltyLevelEntity $entity)
 * @method LoyaltyLevelEntity[]    getElements()
 * @method LoyaltyLevelEntity|null first()
 * @method LoyaltyLevelEntity|null last()
 */
class LoyaltyLevelCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return LoyaltyLevelEntity::class;
    }
}
