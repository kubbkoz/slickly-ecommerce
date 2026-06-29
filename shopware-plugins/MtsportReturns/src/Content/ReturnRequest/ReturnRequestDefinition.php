<?php declare(strict_types=1);

namespace Mtsport\Returns\Content\ReturnRequest;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\DateField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

/**
 * EntityDefinition pre MT-SPORT return / complaint request.
 *
 * Schema portovaná z WP pluginu `sk-withdrawal-form`:
 *   - form_type            'vratenie' | 'reklamacia'
 *   - status               'received' | 'processing' | 'approved' | 'rejected'
 *   - reference_number     RR-2026-NNNNN (auto-gen)
 *   - attachment_paths     JSON array of media UUIDs (fotky/videá)
 *   - warranty_paths       JSON array of media UUIDs (záručný list — len pre reklamáciu)
 */
class ReturnRequestDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'mtsport_return_request';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return ReturnRequestEntity::class;
    }

    public function getCollectionClass(): string
    {
        return ReturnRequestCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new ApiAware(), new Required(), new PrimaryKey()),

            (new StringField('reference_number', 'referenceNumber'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('form_type', 'formType'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('order_number', 'orderNumber'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('order_id', 'orderId'))
                ->addFlags(new ApiAware()),

            (new StringField('first_name', 'firstName'))
                ->addFlags(new ApiAware()),

            (new StringField('last_name', 'lastName'))
                ->addFlags(new ApiAware()),

            (new StringField('customer_name', 'customerName'))
                ->addFlags(new ApiAware()),

            (new StringField('customer_email', 'customerEmail'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('customer_phone', 'customerPhone'))
                ->addFlags(new ApiAware()),

            (new LongTextField('customer_address', 'customerAddress'))
                ->addFlags(new ApiAware()),

            (new DateField('order_date', 'orderDate'))
                ->addFlags(new ApiAware()),

            (new StringField('invoice_number', 'invoiceNumber'))
                ->addFlags(new ApiAware()),

            (new StringField('bank_account', 'bankAccount'))
                ->addFlags(new ApiAware()),

            (new LongTextField('items_description', 'itemsDescription'))
                ->addFlags(new ApiAware()),

            (new StringField('reason_category', 'reasonCategory'))
                ->addFlags(new ApiAware()),

            (new LongTextField('reason_detail', 'reasonDetail'))
                ->addFlags(new ApiAware()),

            (new LongTextField('attachment_paths', 'attachmentPaths'))
                ->addFlags(new ApiAware()),

            (new LongTextField('warranty_paths', 'warrantyPaths'))
                ->addFlags(new ApiAware()),

            (new DateField('withdrawal_date', 'withdrawalDate'))
                ->addFlags(new ApiAware()),

            (new StringField('status', 'status'))
                ->addFlags(new ApiAware()),

            (new StringField('ip_address', 'ipAddress'))
                ->addFlags(new ApiAware()),

            (new StringField('user_agent', 'userAgent'))
                ->addFlags(new ApiAware()),

            (new BoolField('confirmation_sent', 'confirmationSent'))
                ->addFlags(new ApiAware()),

            (new LongTextField('admin_notes', 'adminNotes'))
                ->addFlags(new ApiAware()),
        ]);
    }
}
