<?php declare(strict_types=1);

namespace Mtsport\Sps\Content\SpsShipment;

use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class SpsShipmentEntity extends Entity
{
    use EntityIdTrait;

    protected string $orderId;
    protected string $orderVersionId;
    protected ?OrderEntity $order = null;

    protected ?string $pickupPointId = null;
    protected ?string $pickupPointName = null;
    protected ?string $address = null;
    protected ?string $zip = null;
    protected ?string $city = null;
    protected ?string $countryIso = null;
    protected bool $cod = false;
    protected ?string $type = null;

    protected string $webshipStatus = 'pending';
    protected ?string $labelUrl = null;
    protected ?string $trackingNumber = null;
    protected ?string $webshipError = null;

    public function getOrderId(): string { return $this->orderId; }
    public function setOrderId(string $v): void { $this->orderId = $v; }

    public function getOrderVersionId(): string { return $this->orderVersionId; }
    public function setOrderVersionId(string $v): void { $this->orderVersionId = $v; }

    public function getOrder(): ?OrderEntity { return $this->order; }
    public function setOrder(?OrderEntity $v): void { $this->order = $v; }

    public function getPickupPointId(): ?string { return $this->pickupPointId; }
    public function setPickupPointId(?string $v): void { $this->pickupPointId = $v; }

    public function getPickupPointName(): ?string { return $this->pickupPointName; }
    public function setPickupPointName(?string $v): void { $this->pickupPointName = $v; }

    public function getAddress(): ?string { return $this->address; }
    public function setAddress(?string $v): void { $this->address = $v; }

    public function getZip(): ?string { return $this->zip; }
    public function setZip(?string $v): void { $this->zip = $v; }

    public function getCity(): ?string { return $this->city; }
    public function setCity(?string $v): void { $this->city = $v; }

    public function getCountryIso(): ?string { return $this->countryIso; }
    public function setCountryIso(?string $v): void { $this->countryIso = $v; }

    public function getCod(): bool { return $this->cod; }
    public function setCod(bool $v): void { $this->cod = $v; }

    public function getType(): ?string { return $this->type; }
    public function setType(?string $v): void { $this->type = $v; }

    public function getWebshipStatus(): string { return $this->webshipStatus; }
    public function setWebshipStatus(string $v): void { $this->webshipStatus = $v; }

    public function getLabelUrl(): ?string { return $this->labelUrl; }
    public function setLabelUrl(?string $v): void { $this->labelUrl = $v; }

    public function getTrackingNumber(): ?string { return $this->trackingNumber; }
    public function setTrackingNumber(?string $v): void { $this->trackingNumber = $v; }

    public function getWebshipError(): ?string { return $this->webshipError; }
    public function setWebshipError(?string $v): void { $this->webshipError = $v; }
}
