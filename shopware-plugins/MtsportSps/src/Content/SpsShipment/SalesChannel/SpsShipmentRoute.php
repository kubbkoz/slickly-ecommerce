<?php declare(strict_types=1);

namespace Mtsport\Sps\Content\SpsShipment\SalesChannel;

use Shopware\Core\Defaults;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Store API endpoint pre uloženie vybraného SPS Balikovo výdajného miesta.
 *
 * Endpoint: POST /store-api/mtsport-sps/pickup-point
 * Auth: public sw-access-key (Sales Channel)
 *
 * Request body (JSON):
 *   orderId:      string (UUID)                                          (required)
 *   pickupPoint:  { id, description, address, zip, city, countryISO, cod, type }  (required)
 *
 * Upsert podľa orderId (1:1) — opakované volanie prepíše predchádzajúci výber.
 *
 * Response:
 *   { success: true }
 */
#[Route(defaults: ['_routeScope' => ['store-api']])]
class SpsShipmentRoute
{
    public function __construct(
        private readonly EntityRepository $spsShipmentRepository,
        private readonly EntityRepository $orderRepository,
    ) {
    }

    #[Route(
        path: '/store-api/mtsport-sps/pickup-point',
        name: 'store-api.mtsport_sps.pickup_point',
        methods: ['POST'],
    )]
    public function save(Request $request, SalesChannelContext $context): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $orderId = $data['orderId'] ?? null;
        $pickupPoint = $data['pickupPoint'] ?? null;

        if (!\is_string($orderId) || !Uuid::isValid($orderId)) {
            return new JsonResponse(['success' => false, 'error' => 'Missing or invalid orderId'], 400);
        }

        if (!\is_array($pickupPoint) || empty($pickupPoint['id'])) {
            return new JsonResponse(['success' => false, 'error' => 'Missing pickupPoint.id'], 400);
        }

        $orderCriteria = (new Criteria([$orderId]))->setLimit(1);
        $order = $this->orderRepository->search($orderCriteria, $context->getContext())->first();

        if ($order === null) {
            return new JsonResponse(['success' => false, 'error' => 'Order not found'], 404);
        }

        $existingCriteria = (new Criteria())
            ->addFilter(new EqualsFilter('orderId', $orderId))
            ->setLimit(1);
        $existing = $this->spsShipmentRepository->search($existingCriteria, $context->getContext())->first();

        $payload = [
            'id'              => $existing?->getId() ?? Uuid::randomHex(),
            'orderId'         => $orderId,
            'orderVersionId'  => $order->getVersionId() ?? Defaults::LIVE_VERSION,
            'pickupPointId'   => (string)$pickupPoint['id'],
            'pickupPointName' => isset($pickupPoint['description']) ? (string)$pickupPoint['description'] : null,
            'address'         => isset($pickupPoint['address']) ? (string)$pickupPoint['address'] : null,
            'zip'             => isset($pickupPoint['zip']) ? (string)$pickupPoint['zip'] : null,
            'city'            => isset($pickupPoint['city']) ? (string)$pickupPoint['city'] : null,
            'countryIso'      => isset($pickupPoint['countryISO']) ? (string)$pickupPoint['countryISO'] : null,
            'cod'             => (bool)($pickupPoint['cod'] ?? false),
            'type'            => isset($pickupPoint['type']) ? (string)$pickupPoint['type'] : null,
        ];

        if ($existing === null) {
            $payload['webshipStatus'] = 'pending';
        }

        try {
            $this->spsShipmentRepository->upsert([$payload], $context->getContext());

            // Zrkadlí výber do order.customFields → viditeľné v admin detaile objednávky (karta „Voľné polia")
            $addressParts = array_filter([$payload['address'], $payload['zip'], $payload['city']]);
            $this->orderRepository->upsert([[
                'id'           => $orderId,
                'customFields' => [
                    'mtsport_sps_point_id'      => $payload['pickupPointId'],
                    'mtsport_sps_point_name'    => $payload['pickupPointName'],
                    'mtsport_sps_point_address' => $addressParts === [] ? null : implode(', ', $addressParts),
                ],
            ]], $context->getContext());
        } catch (\Throwable $e) {
            return new JsonResponse([
                'success' => false,
                'error'   => 'save_failed',
                'detail'  => $e->getMessage(),
            ], 500);
        }

        return new JsonResponse(['success' => true]);
    }
}
