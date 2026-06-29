<?php declare(strict_types=1);

namespace Mtsport\Badge\Content\Badge;

use Shopware\Core\Content\Product\ProductCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class BadgeEntity extends Entity
{
    use EntityIdTrait;

    protected string $name = '';
    protected string $text = '';
    protected string $bgColor = '#22c55e';
    protected string $textColor = '#ffffff';
    protected string $position = 'both';
    protected string $pdpPosition = 'top';
    protected string $size = 'md';
    protected bool $active = true;
    protected int $sort = 0;
    protected ?string $applyProductIds = null;
    protected ?string $applyCategoryIds = null;
    protected ?string $applyTagIds = null;
    protected ?string $applyManufacturerIds = null;
    protected ?string $applyProductStreamIds = null;
    protected ?int $applyIsNewDays = null;
    protected bool $applyHasDiscount = false;

    // ── Advanced gating filters (v2.0) ──
    protected ?float $applyMinPrice = null;
    protected ?float $applyMaxPrice = null;
    protected ?int $applyMinStock = null;
    protected ?int $applyMaxStock = null;
    protected ?float $applyMinRating = null;
    protected ?\DateTimeInterface $applyDateFrom = null;
    protected ?\DateTimeInterface $applyDateTo = null;

    // ── ManyToMany reverse assignment ──
    protected ?ProductCollection $products = null;

    public function getName(): string { return $this->name; }
    public function setName(string $name): void { $this->name = $name; }

    public function getText(): string { return $this->text; }
    public function setText(string $text): void { $this->text = $text; }

    public function getBgColor(): string { return $this->bgColor; }
    public function setBgColor(string $bgColor): void { $this->bgColor = $bgColor; }

    public function getTextColor(): string { return $this->textColor; }
    public function setTextColor(string $textColor): void { $this->textColor = $textColor; }

    public function getPosition(): string { return $this->position; }
    public function setPosition(string $position): void { $this->position = $position; }

    public function getPdpPosition(): string { return $this->pdpPosition; }
    public function setPdpPosition(string $v): void { $this->pdpPosition = $v; }

    public function getSize(): string { return $this->size; }
    public function setSize(string $v): void { $this->size = $v; }

    public function getActive(): bool { return $this->active; }
    public function setActive(bool $active): void { $this->active = $active; }

    public function getSort(): int { return $this->sort; }
    public function setSort(int $sort): void { $this->sort = $sort; }

    public function getApplyProductIds(): ?string { return $this->applyProductIds; }
    public function setApplyProductIds(?string $v): void { $this->applyProductIds = $v; }

    public function getApplyCategoryIds(): ?string { return $this->applyCategoryIds; }
    public function setApplyCategoryIds(?string $v): void { $this->applyCategoryIds = $v; }

    public function getApplyTagIds(): ?string { return $this->applyTagIds; }
    public function setApplyTagIds(?string $v): void { $this->applyTagIds = $v; }

    public function getApplyManufacturerIds(): ?string { return $this->applyManufacturerIds; }
    public function setApplyManufacturerIds(?string $v): void { $this->applyManufacturerIds = $v; }

    public function getApplyProductStreamIds(): ?string { return $this->applyProductStreamIds; }
    public function setApplyProductStreamIds(?string $v): void { $this->applyProductStreamIds = $v; }

    public function getApplyIsNewDays(): ?int { return $this->applyIsNewDays; }
    public function setApplyIsNewDays(?int $v): void { $this->applyIsNewDays = $v; }

    public function getApplyHasDiscount(): bool { return $this->applyHasDiscount; }
    public function setApplyHasDiscount(bool $v): void { $this->applyHasDiscount = $v; }

    public function getApplyMinPrice(): ?float { return $this->applyMinPrice; }
    public function setApplyMinPrice(?float $v): void { $this->applyMinPrice = $v; }

    public function getApplyMaxPrice(): ?float { return $this->applyMaxPrice; }
    public function setApplyMaxPrice(?float $v): void { $this->applyMaxPrice = $v; }

    public function getApplyMinStock(): ?int { return $this->applyMinStock; }
    public function setApplyMinStock(?int $v): void { $this->applyMinStock = $v; }

    public function getApplyMaxStock(): ?int { return $this->applyMaxStock; }
    public function setApplyMaxStock(?int $v): void { $this->applyMaxStock = $v; }

    public function getApplyMinRating(): ?float { return $this->applyMinRating; }
    public function setApplyMinRating(?float $v): void { $this->applyMinRating = $v; }

    public function getApplyDateFrom(): ?\DateTimeInterface { return $this->applyDateFrom; }
    public function setApplyDateFrom(?\DateTimeInterface $v): void { $this->applyDateFrom = $v; }

    public function getApplyDateTo(): ?\DateTimeInterface { return $this->applyDateTo; }
    public function setApplyDateTo(?\DateTimeInterface $v): void { $this->applyDateTo = $v; }

    public function getProducts(): ?ProductCollection { return $this->products; }
    public function setProducts(?ProductCollection $v): void { $this->products = $v; }
}
