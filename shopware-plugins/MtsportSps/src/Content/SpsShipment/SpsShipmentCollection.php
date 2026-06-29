<?php declare(strict_types=1);

namespace Mtsport\Sps\Content\SpsShipment;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                    add(SpsShipmentEntity $entity)
 * @method void                    set(string $key, SpsShipmentEntity $entity)
 * @method SpsShipmentEntity[]     getIterator()
 * @method SpsShipmentEntity[]     getElements()
 * @method SpsShipmentEntity|null  get(string $key)
 * @method SpsShipmentEntity|null  first()
 * @method SpsShipmentEntity|null  last()
 */
class SpsShipmentCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return SpsShipmentEntity::class;
    }
}
