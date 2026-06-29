<?php declare(strict_types=1);

namespace Mtsport\Badge\Content\Badge;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void            add(BadgeEntity $entity)
 * @method void            set(string $key, BadgeEntity $entity)
 * @method BadgeEntity[]   getIterator()
 * @method BadgeEntity[]   getElements()
 * @method BadgeEntity|null get(string $key)
 * @method BadgeEntity|null first()
 * @method BadgeEntity|null last()
 */
class BadgeCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return BadgeEntity::class;
    }
}
