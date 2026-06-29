<?php declare(strict_types=1);

namespace Mtsport\Sps\Content\SpsShipment;

use Shopware\Core\Checkout\Order\OrderDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

/**
 * EntityDefinition pre SPS Balikovo výdajné miesto + WebShip stav zásielky.
 *
 * 1:1 s `order` (orderId + orderVersionId — order je verziovaná entita).
 *
 *   pickupPointId/Name/address/zip/city/countryIso/cod/type — SPS widget `place` objekt
 *   webshipStatus    'pending' | 'created' | 'error'
 *   labelUrl         WebShip createAndPrintCifShipment → documentUrl
 *   trackingNumber   WebShip packagesInfo[0] reffnr/tracking
 *   webshipError     posledná chybová hláška zo SOAP volania
 */
class SpsShipmentDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'mtsport_sps_shipment';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return SpsShipmentEntity::class;
    }

    public function getCollectionClass(): string
    {
        return SpsShipmentCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new ApiAware(), new Required(), new PrimaryKey()),

            (new FkField('order_id', 'orderId', OrderDefinition::class))
                ->addFlags(new ApiAware(), new Required()),

            (new ReferenceVersionField(OrderDefinition::class))
                ->addFlags(new ApiAware(), new Required()),

            new OneToOneAssociationField('order', 'order_id', 'id', OrderDefinition::class, false),

            // Bez Required — courier objednávky (bez Balíkomatu) majú prázdne pickup_point_id
            (new StringField('pickup_point_id', 'pickupPointId'))
                ->addFlags(new ApiAware()),

            (new StringField('pickup_point_name', 'pickupPointName'))
                ->addFlags(new ApiAware()),

            (new StringField('address', 'address'))
                ->addFlags(new ApiAware()),

            (new StringField('zip', 'zip'))
                ->addFlags(new ApiAware()),

            (new StringField('city', 'city'))
                ->addFlags(new ApiAware()),

            (new StringField('country_iso', 'countryIso'))
                ->addFlags(new ApiAware()),

            (new BoolField('cod', 'cod'))
                ->addFlags(new ApiAware()),

            (new StringField('type', 'type'))
                ->addFlags(new ApiAware()),

            (new StringField('webship_status', 'webshipStatus'))
                ->addFlags(new ApiAware(), new Required()),

            (new StringField('label_url', 'labelUrl'))
                ->addFlags(new ApiAware()),

            (new StringField('tracking_number', 'trackingNumber'))
                ->addFlags(new ApiAware()),

            (new LongTextField('webship_error', 'webshipError'))
                ->addFlags(new ApiAware()),
        ]);
    }
}
