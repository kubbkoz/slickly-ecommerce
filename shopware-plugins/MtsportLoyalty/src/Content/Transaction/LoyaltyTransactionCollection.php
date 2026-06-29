<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Transaction;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                          add(LoyaltyTransactionEntity $entity)
 * @method LoyaltyTransactionEntity[]    getElements()
 * @method LoyaltyTransactionEntity|null first()
 * @method LoyaltyTransactionEntity|null last()
 */
class LoyaltyTransactionCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return LoyaltyTransactionEntity::class;
    }
}
