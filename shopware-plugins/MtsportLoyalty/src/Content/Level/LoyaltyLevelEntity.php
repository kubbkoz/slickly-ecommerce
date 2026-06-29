<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Level;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class LoyaltyLevelEntity extends Entity
{
    use EntityIdTrait;

    protected int $level = 1;
    protected string $name = '';
    protected int $minPoints = 0;
    protected string $color = '#94A3B8';
    protected string $colorType = 'solid';

    public function getLevel(): int { return $this->level; }
    public function setLevel(int $v): void { $this->level = $v; }

    public function getName(): string { return $this->name; }
    public function setName(string $v): void { $this->name = $v; }

    public function getMinPoints(): int { return $this->minPoints; }
    public function setMinPoints(int $v): void { $this->minPoints = $v; }

    public function getColor(): string { return $this->color; }
    public function setColor(string $v): void { $this->color = $v; }

    public function getColorType(): string { return $this->colorType; }
    public function setColorType(string $v): void { $this->colorType = $v; }
}
