<?php declare(strict_types=1);

namespace Mtsport\Sps\Service;

use Mtsport\Sps\Content\SpsShipment\SpsShipmentEntity;
use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Zdieľaná logika vytvorenia WebShip zásielky pre objednávku — používa OrderShipmentSubscriber
 * (auto pri stave kurier_sps) aj SpsAdminController (bulk generovanie z admin modulu).
 *
 * Rozhoduje Balíkovo vs kuriér (podľa pickupPointId), vytvorí riadok ak chýba, zavolá WebShip,
 * uloží stav/label/tracking a zrkadlí do order.customFields.
 */
class SpsShipmentProcessor
{
    public function __construct(
        private readonly EntityRepository $spsShipmentRepository,
        private readonly EntityRepository $orderRepository,
        private readonly WebshipClient $webshipClient,
        private readonly SpsTrackingService $trackingService,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @return array{success: bool, status: string, orderNumber: ?string, labelUrl: ?string, trackingNumber: ?string, error: ?string}
     */
    public function process(string $orderId, Context $context, bool $force = false): array
    {
        $order = $this->loadOrder($orderId, $context);
        if ($order === null) {
            return $this->result(false, 'error', null, null, null, 'Order not found: ' . $orderId);
        }

        $orderNumber = $order->getOrderNumber();

        $shipment = $this->resolveOrCreateShipment($orderId, $order, $context);
        if ($shipment === null) {
            return $this->result(false, 'error', $orderNumber, null, null, 'Could not create shipment record');
        }

        // Už vytvorené → vráť existujúci štítok (žiadny duplicitný SPS shipment), ak nie je vynútené
        if (!$force && $shipment->getWebshipStatus() === 'created') {
            return $this->result(true, 'duplicate', $orderNumber, $shipment->getLabelUrl(), $shipment->getTrackingNumber(), null);
        }

        try {
            $result = $this->webshipClient->createShipment($order, $shipment, $order->getSalesChannelId());

            if ($result['errors'] !== []) {
                $message = implode(' | ', $result['errors']);
                $this->persistError($shipment, $message, $context);

                return $this->result(false, 'error', $orderNumber, null, null, $message);
            }

            $this->persistCreated($shipment, $order, $result, $context);

            return $this->result(true, 'created', $orderNumber, $result['labelUrl'], $result['trackingNumber'], null);
        } catch (\Throwable $e) {
            $message = \get_class($e) . ': ' . $e->getMessage();
            $this->logger->error('[MtsportSps] processor exception', ['orderId' => $orderId, 'exception' => $e]);
            $this->persistError($shipment, $message, $context);

            return $this->result(false, 'error', $orderNumber, null, null, $message);
        }
    }

    private function loadOrder(string $orderId, Context $context): ?OrderEntity
    {
        $criteria = (new Criteria([$orderId]))
            ->addAssociation('deliveries.shippingOrderAddress.country')
            ->addAssociation('addresses.country')
            ->addAssociation('lineItems')
            ->addAssociation('transactions')
            ->addAssociation('orderCustomer');

        /** @var OrderEntity|null $order */
        $order = $this->orderRepository->search($criteria, $context)->first();

        return $order;
    }

    private function resolveOrCreateShipment(string $orderId, OrderEntity $order, Context $context): ?SpsShipmentEntity
    {
        $criteria = (new Criteria())
            ->addFilter(new EqualsFilter('orderId', $orderId))
            ->setLimit(1);

        /** @var SpsShipmentEntity|null $shipment */
        $shipment = $this->spsShipmentRepository->search($criteria, $context)->first();
        if ($shipment !== null) {
            return $shipment;
        }

        $newId = Uuid::randomHex();
        $this->spsShipmentRepository->upsert([[
            'id'             => $newId,
            'orderId'        => $orderId,
            'orderVersionId' => $order->getVersionId() ?? Defaults::LIVE_VERSION,
            'pickupPointId'  => null,
            'type'           => 'courier',
            'webshipStatus'  => 'pending',
        ]], $context);

        $this->logger->info('[MtsportSps] created courier shipment row', ['orderId' => $orderId]);

        return $this->spsShipmentRepository->search(new Criteria([$newId]), $context)->first();
    }

    private function persistCreated(SpsShipmentEntity $shipment, OrderEntity $order, array $result, Context $context): void
    {
        $this->spsShipmentRepository->update([[
            'id'             => $shipment->getId(),
            'webshipStatus'  => 'created',
            'labelUrl'       => $result['labelUrl'],
            'trackingNumber' => $result['trackingNumber'],
            'webshipError'   => null,
        ]], $context);

        $trackingUrl = $this->trackingService->trackingUrl((string) $order->getOrderNumber(), $order->getSalesChannelId());

        $this->orderRepository->upsert([[
            'id'           => $order->getId(),
            'customFields' => [
                'mtsport_sps_courier'      => 'SPS',
                'mtsport_sps_tracking'     => $result['trackingNumber'],
                'mtsport_sps_label_url'    => $result['labelUrl'],
                'mtsport_sps_tracking_url' => $trackingUrl,
            ],
        ]], $context);
    }

    private function persistError(SpsShipmentEntity $shipment, string $message, Context $context): void
    {
        try {
            $this->spsShipmentRepository->update([[
                'id'            => $shipment->getId(),
                'webshipStatus' => 'error',
                'webshipError'  => mb_substr($message, 0, 4000),
            ]], $context);
        } catch (\Throwable $e) {
            $this->logger->error('[MtsportSps] failed to persist error state', ['exception' => $e]);
        }
    }

    /**
     * @return array{success: bool, status: string, orderNumber: ?string, labelUrl: ?string, trackingNumber: ?string, error: ?string}
     */
    private function result(bool $success, string $status, ?string $orderNumber, ?string $labelUrl, ?string $trackingNumber, ?string $error): array
    {
        return [
            'success'        => $success,
            'status'         => $status,
            'orderNumber'    => $orderNumber,
            'labelUrl'       => $labelUrl,
            'trackingNumber' => $trackingNumber,
            'error'          => $error,
        ];
    }
}
