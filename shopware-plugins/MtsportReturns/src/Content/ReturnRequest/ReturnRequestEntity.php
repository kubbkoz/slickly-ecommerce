<?php declare(strict_types=1);

namespace Mtsport\Returns\Content\ReturnRequest;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class ReturnRequestEntity extends Entity
{
    use EntityIdTrait;

    protected string $referenceNumber = '';
    protected string $formType = 'vratenie';
    protected string $orderNumber = '';
    protected ?string $orderId = null;
    protected ?string $firstName = null;
    protected ?string $lastName = null;
    protected ?string $customerName = null;
    protected string $customerEmail = '';
    protected ?string $customerPhone = null;
    protected ?string $customerAddress = null;
    protected ?\DateTimeInterface $orderDate = null;
    protected ?string $invoiceNumber = null;
    protected ?string $bankAccount = null;
    protected ?string $itemsDescription = null;
    protected ?string $reasonCategory = null;
    protected ?string $reasonDetail = null;
    protected ?string $attachmentPaths = null;
    protected ?string $warrantyPaths = null;
    protected ?\DateTimeInterface $withdrawalDate = null;
    protected string $status = 'received';
    protected ?string $ipAddress = null;
    protected ?string $userAgent = null;
    protected bool $confirmationSent = false;
    protected ?string $adminNotes = null;

    public function getReferenceNumber(): string { return $this->referenceNumber; }
    public function setReferenceNumber(string $v): void { $this->referenceNumber = $v; }

    public function getFormType(): string { return $this->formType; }
    public function setFormType(string $v): void { $this->formType = $v; }

    public function getOrderNumber(): string { return $this->orderNumber; }
    public function setOrderNumber(string $v): void { $this->orderNumber = $v; }

    public function getOrderId(): ?string { return $this->orderId; }
    public function setOrderId(?string $v): void { $this->orderId = $v; }

    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(?string $v): void { $this->firstName = $v; }

    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(?string $v): void { $this->lastName = $v; }

    public function getCustomerName(): ?string { return $this->customerName; }
    public function setCustomerName(?string $v): void { $this->customerName = $v; }

    public function getCustomerEmail(): string { return $this->customerEmail; }
    public function setCustomerEmail(string $v): void { $this->customerEmail = $v; }

    public function getCustomerPhone(): ?string { return $this->customerPhone; }
    public function setCustomerPhone(?string $v): void { $this->customerPhone = $v; }

    public function getCustomerAddress(): ?string { return $this->customerAddress; }
    public function setCustomerAddress(?string $v): void { $this->customerAddress = $v; }

    public function getOrderDate(): ?\DateTimeInterface { return $this->orderDate; }
    public function setOrderDate(?\DateTimeInterface $v): void { $this->orderDate = $v; }

    public function getInvoiceNumber(): ?string { return $this->invoiceNumber; }
    public function setInvoiceNumber(?string $v): void { $this->invoiceNumber = $v; }

    public function getBankAccount(): ?string { return $this->bankAccount; }
    public function setBankAccount(?string $v): void { $this->bankAccount = $v; }

    public function getItemsDescription(): ?string { return $this->itemsDescription; }
    public function setItemsDescription(?string $v): void { $this->itemsDescription = $v; }

    public function getReasonCategory(): ?string { return $this->reasonCategory; }
    public function setReasonCategory(?string $v): void { $this->reasonCategory = $v; }

    public function getReasonDetail(): ?string { return $this->reasonDetail; }
    public function setReasonDetail(?string $v): void { $this->reasonDetail = $v; }

    public function getAttachmentPaths(): ?string { return $this->attachmentPaths; }
    public function setAttachmentPaths(?string $v): void { $this->attachmentPaths = $v; }

    public function getWarrantyPaths(): ?string { return $this->warrantyPaths; }
    public function setWarrantyPaths(?string $v): void { $this->warrantyPaths = $v; }

    public function getWithdrawalDate(): ?\DateTimeInterface { return $this->withdrawalDate; }
    public function setWithdrawalDate(?\DateTimeInterface $v): void { $this->withdrawalDate = $v; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $v): void { $this->status = $v; }

    public function getIpAddress(): ?string { return $this->ipAddress; }
    public function setIpAddress(?string $v): void { $this->ipAddress = $v; }

    public function getUserAgent(): ?string { return $this->userAgent; }
    public function setUserAgent(?string $v): void { $this->userAgent = $v; }

    public function getConfirmationSent(): bool { return $this->confirmationSent; }
    public function setConfirmationSent(bool $v): void { $this->confirmationSent = $v; }

    public function getAdminNotes(): ?string { return $this->adminNotes; }
    public function setAdminNotes(?string $v): void { $this->adminNotes = $v; }
}
