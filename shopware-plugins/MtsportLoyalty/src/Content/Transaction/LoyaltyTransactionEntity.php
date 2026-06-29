<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Transaction;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class LoyaltyTransactionEntity extends Entity
{
    use EntityIdTrait;

    protected string $customerId = '';
    protected int $points = 0;
    protected string $type = '';
    protected ?string $referenceId = null;
    protected ?string $description = null;

    public function getCustomerId(): string { return $this->customerId; }
    public function setCustomerId(string $v): void { $this->customerId = $v; }

    public function getPoints(): int { return $this->points; }
    public function setPoints(int $v): void { $this->points = $v; }

    public function getType(): string { return $this->type; }
    public function setType(string $v): void { $this->type = $v; }

    public function getReferenceId(): ?string { return $this->referenceId; }
    public function setReferenceId(?string $v): void { $this->referenceId = $v; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $v): void { $this->description = $v; }
}
