<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Transaction;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class LoyaltyTransactionDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'loyalty_transaction';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return LoyaltyTransactionEntity::class;
    }

    public function getCollectionClass(): string
    {
        return LoyaltyTransactionCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new ApiAware(), new Required(), new PrimaryKey()),
            (new IdField('customer_id', 'customerId'))->addFlags(new ApiAware(), new Required()),
            (new IntField('points', 'points'))->addFlags(new ApiAware(), new Required()),
            (new StringField('type', 'type'))->addFlags(new ApiAware(), new Required()),
            (new StringField('reference_id', 'referenceId'))->addFlags(new ApiAware()),
            (new StringField('description', 'description', 500))->addFlags(new ApiAware()),
        ]);
    }
}
