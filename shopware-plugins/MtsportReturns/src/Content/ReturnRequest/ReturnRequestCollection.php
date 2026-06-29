<?php declare(strict_types=1);

namespace Mtsport\Returns\Content\ReturnRequest;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                       add(ReturnRequestEntity $entity)
 * @method void                       set(string $key, ReturnRequestEntity $entity)
 * @method ReturnRequestEntity[]      getIterator()
 * @method ReturnRequestEntity[]      getElements()
 * @method ReturnRequestEntity|null   get(string $key)
 * @method ReturnRequestEntity|null   first()
 * @method ReturnRequestEntity|null   last()
 */
class ReturnRequestCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return ReturnRequestEntity::class;
    }
}
