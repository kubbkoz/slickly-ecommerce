<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Reward;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class LoyaltyRewardEntity extends Entity
{
    use EntityIdTrait;

    protected string $name = '';
    protected ?string $description = null;
    protected int $pointsRequired = 0;
    protected string $type = 'percentage';
    protected float $discountValue = 0.0;
    protected ?string $ruleId = null;
    protected ?string $giftProductId = null;
    protected ?float $minOrderValue = null;
    protected int $maxUsesPerCustomer = 1;
    protected int $validDays = 30;
    protected bool $isActive = true;

    public function getName(): string { return $this->name; }
    public function setName(string $v): void { $this->name = $v; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $v): void { $this->description = $v; }

    public function getPointsRequired(): int { return $this->pointsRequired; }
    public function setPointsRequired(int $v): void { $this->pointsRequired = $v; }

    public function getType(): string { return $this->type; }
    public function setType(string $v): void { $this->type = $v; }

    public function getDiscountValue(): float { return $this->discountValue; }
    public function setDiscountValue(float $v): void { $this->discountValue = $v; }

    public function getRuleId(): ?string { return $this->ruleId; }
    public function setRuleId(?string $v): void { $this->ruleId = $v; }

    public function getGiftProductId(): ?string { return $this->giftProductId; }
    public function setGiftProductId(?string $v): void { $this->giftProductId = $v; }

    public function getMinOrderValue(): ?float { return $this->minOrderValue; }
    public function setMinOrderValue(?float $v): void { $this->minOrderValue = $v; }

    public function getMaxUsesPerCustomer(): int { return $this->maxUsesPerCustomer; }
    public function setMaxUsesPerCustomer(int $v): void { $this->maxUsesPerCustomer = $v; }

    public function getValidDays(): int { return $this->validDays; }
    public function setValidDays(int $v): void { $this->validDays = $v; }

    public function getIsActive(): bool { return $this->isActive; }
    public function setIsActive(bool $v): void { $this->isActive = $v; }
}
