<?php declare(strict_types=1);

namespace Mtsport\Blog\Content\Article;

use Shopware\Core\Content\Cms\CmsPageEntity;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

/**
 * DTO pre jeden blog článok (data object hydrated DAL-om).
 */
class ArticleEntity extends Entity
{
    use EntityIdTrait;

    protected ?string $title = null;
    protected ?string $slug = null;
    protected ?string $teaser = null;
    protected ?string $content = null;
    protected ?\DateTimeInterface $publishedAt = null;
    protected ?string $author = null;
    protected ?string $category = null;
    protected ?string $metaTitle = null;
    protected ?string $metaDescription = null;
    protected bool $active = true;
    protected bool $featured = false;
    protected ?string $featuredBadgeText = null;
    protected string $type = 'blog';
    protected ?string $heroCoverId = null;
    protected ?MediaEntity $heroCover = null;
    protected ?string $coverId = null;
    protected ?MediaEntity $cover = null;
    protected ?string $cmsPageId = null;
    protected ?CmsPageEntity $cmsPage = null;

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $title): void { $this->title = $title; }

    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(?string $slug): void { $this->slug = $slug; }

    public function getTeaser(): ?string { return $this->teaser; }
    public function setTeaser(?string $teaser): void { $this->teaser = $teaser; }

    public function getContent(): ?string { return $this->content; }
    public function setContent(?string $content): void { $this->content = $content; }

    public function getPublishedAt(): ?\DateTimeInterface { return $this->publishedAt; }
    public function setPublishedAt(?\DateTimeInterface $publishedAt): void { $this->publishedAt = $publishedAt; }

    public function getAuthor(): ?string { return $this->author; }
    public function setAuthor(?string $author): void { $this->author = $author; }

    public function getCategory(): ?string { return $this->category; }
    public function setCategory(?string $category): void { $this->category = $category; }

    public function getMetaTitle(): ?string { return $this->metaTitle; }
    public function setMetaTitle(?string $metaTitle): void { $this->metaTitle = $metaTitle; }

    public function getMetaDescription(): ?string { return $this->metaDescription; }
    public function setMetaDescription(?string $metaDescription): void { $this->metaDescription = $metaDescription; }

    public function getActive(): bool { return $this->active; }
    public function setActive(bool $active): void { $this->active = $active; }

    public function getFeatured(): bool { return $this->featured; }
    public function setFeatured(bool $featured): void { $this->featured = $featured; }

    public function getFeaturedBadgeText(): ?string { return $this->featuredBadgeText; }
    public function setFeaturedBadgeText(?string $featuredBadgeText): void { $this->featuredBadgeText = $featuredBadgeText; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): void { $this->type = $type; }

    public function getHeroCoverId(): ?string { return $this->heroCoverId; }
    public function setHeroCoverId(?string $heroCoverId): void { $this->heroCoverId = $heroCoverId; }

    public function getHeroCover(): ?MediaEntity { return $this->heroCover; }
    public function setHeroCover(?MediaEntity $heroCover): void { $this->heroCover = $heroCover; }

    public function getCoverId(): ?string { return $this->coverId; }
    public function setCoverId(?string $coverId): void { $this->coverId = $coverId; }

    public function getCover(): ?MediaEntity { return $this->cover; }
    public function setCover(?MediaEntity $cover): void { $this->cover = $cover; }

    public function getCmsPageId(): ?string { return $this->cmsPageId; }
    public function setCmsPageId(?string $cmsPageId): void { $this->cmsPageId = $cmsPageId; }

    public function getCmsPage(): ?CmsPageEntity { return $this->cmsPage; }
    public function setCmsPage(?CmsPageEntity $cmsPage): void { $this->cmsPage = $cmsPage; }
}
