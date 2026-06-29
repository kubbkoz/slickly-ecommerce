<?php declare(strict_types=1);

namespace Mtsport\Blog\Content\Article;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * Typed collection pre ArticleEntity (vrátenú DAL searchom).
 *
 * @method void                add(ArticleEntity $entity)
 * @method void                set(string $key, ArticleEntity $entity)
 * @method ArticleEntity[]     getIterator()
 * @method ArticleEntity[]     getElements()
 * @method ArticleEntity|null  get(string $key)
 * @method ArticleEntity|null  first()
 * @method ArticleEntity|null  last()
 */
class ArticleCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return ArticleEntity::class;
    }
}
