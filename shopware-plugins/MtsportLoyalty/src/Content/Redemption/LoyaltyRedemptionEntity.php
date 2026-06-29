<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Redemption;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class LoyaltyRedemptionEntity extends Entity
{
    use EntityIdTrait;

    protected string $customerId = '';
    protected string $rewardId = '';
    protected ?string $rewardName = null;
    protected string $promotionCode = '';
    protected int $pointsSpent = 0;
    protected string $status = 'active';
    protected ?\DateTimeInterface $expiresAt = null;
    protected ?\DateTimeInterface $usedAt = null;

    public function getCustomerId(): string { return $this->customerId; }
    public function setCustomerId(string $v): void { $this->customerId = $v; }

    public function getRewardId(): string { return $this->rewardId; }
    public function setRewardId(string $v): void { $this->rewardId = $v; }

    public function getRewardName(): ?string { return $this->rewardName; }
    public function setRewardName(?string $v): void { $this->rewardName = $v; }

    public function getPromotionCode(): string { return $this->promotionCode; }
    public function setPromotionCode(string $v): void { $this->promotionCode = $v; }

    public function getPointsSpent(): int { return $this->pointsSpent; }
    public function setPointsSpent(int $v): void { $this->pointsSpent = $v; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $v): void { $this->status = $v; }

    public function getExpiresAt(): ?\DateTimeInterface { return $this->expiresAt; }
    public function setExpiresAt(?\DateTimeInterface $v): void { $this->expiresAt = $v; }

    public function getUsedAt(): ?\DateTimeInterface { return $this->usedAt; }
    public function setUsedAt(?\DateTimeInterface $v): void { $this->usedAt = $v; }
}
