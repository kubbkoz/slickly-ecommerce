<?php declare(strict_types=1);

namespace Mtsport\Blog\Content\Article;

use Shopware\Core\Content\Cms\CmsPageDefinition;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\DateTimeField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\AllowHtml;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

/**
 * EntityDefinition pre MT-SPORT blog článok.
 *
 * Polia:
 *   - id (UUID, PK)
 *   - title (string, required)        — Nadpis článku
 *   - slug (string, required, unique) — URL slug
 *   - teaser (longtext)               — Krátky popis
 *   - content (longtext)              — HTML obsah
 *   - published_at (datetime)         — Publikácia (Nuxt filtruje range lte NOW)
 *   - author (string)                 — Meno autora
 *   - category (string)               — Filter tag
 *   - meta_title (string)             — SEO title
 *   - meta_description (longtext)     — SEO meta description
 *   - active (bool)                   — Publikované/draft toggle
 *   - cover_id (FK → media)           — Titulný obrázok
 *   - cms_page_id (FK → cms_page)     — CMS rozloženie (bloky: text, image, columns, ...)
 *
 * Všetky polia majú ApiAware flag → exposed v Store API + Admin API.
 */
class ArticleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'mtsport_article';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return ArticleEntity::class;
    }

    public function getCollectionClass(): string
    {
        return ArticleCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new ApiAware(), new Required(), new PrimaryKey()),

            (new StringField('title', 'title'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('slug', 'slug'))
                ->addFlags(new ApiAware(), new Required()),

            (new LongTextField('teaser', 'teaser'))
                ->addFlags(new ApiAware(), new AllowHtml()),

            (new LongTextField('content', 'content'))
                ->addFlags(new ApiAware(), new AllowHtml()),

            (new DateTimeField('published_at', 'publishedAt'))
                ->addFlags(new ApiAware()),

            (new StringField('author', 'author'))
                ->addFlags(new ApiAware()),

            (new StringField('category', 'category'))
                ->addFlags(new ApiAware()),

            (new StringField('meta_title', 'metaTitle'))
                ->addFlags(new ApiAware()),

            (new LongTextField('meta_description', 'metaDescription'))
                ->addFlags(new ApiAware(), new AllowHtml()),

            (new BoolField('active', 'active'))
                ->addFlags(new ApiAware()),

            (new BoolField('featured', 'featured'))
                ->addFlags(new ApiAware()),

            (new StringField('featured_badge_text', 'featuredBadgeText'))
                ->addFlags(new ApiAware()),

            // 'blog' = blogový článok, 'page' = statická stránka (bez /blog prefixu)
            (new StringField('type', 'type'))
                ->addFlags(new ApiAware()),

            (new FkField('hero_cover_id', 'heroCoverId', MediaDefinition::class))
                ->addFlags(new ApiAware()),

            (new ManyToOneAssociationField('heroCover', 'hero_cover_id', MediaDefinition::class, 'id'))
                ->addFlags(new ApiAware()),

            (new FkField('cover_id', 'coverId', MediaDefinition::class))
                ->addFlags(new ApiAware()),

            (new ManyToOneAssociationField('cover', 'cover_id', MediaDefinition::class, 'id'))
                ->addFlags(new ApiAware()),

            (new FkField('cms_page_id', 'cmsPageId', CmsPageDefinition::class))
                ->addFlags(new ApiAware()),

            (new ManyToOneAssociationField('cmsPage', 'cms_page_id', CmsPageDefinition::class, 'id'))
                ->addFlags(new ApiAware()),
        ]);
    }
}
