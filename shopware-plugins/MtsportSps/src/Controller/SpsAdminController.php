<?php declare(strict_types=1);

namespace Mtsport\Sps\Controller;

use Mtsport\Sps\Service\SpsShipmentProcessor;
use Mtsport\Sps\Service\WebshipClient;
use Shopware\Core\Framework\Context;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Admin API pre SPS Balíkovo modul.
 *
 *   POST /api/_action/mtsport-sps/generate-labels  body { orderIds: string[] }  → bulk vytvorenie štítkov
 *   POST /api/_action/mtsport-sps/end-of-day                                     → preberací protokol (End of Day)
 */
#[Route(defaults: ['_routeScope' => ['api']])]
class SpsAdminController
{
    public function __construct(
        private readonly SpsShipmentProcessor $processor,
        private readonly WebshipClient $webshipClient,
    ) {
    }

    #[Route(
        path: '/api/_action/mtsport-sps/generate-labels',
        name: 'api.action.mtsport_sps.generate_labels',
        methods: ['POST'],
    )]
    public function generateLabels(Request $request, Context $context): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $orderIds = $payload['orderIds'] ?? [];
        if (!\is_array($orderIds) || $orderIds === []) {
            return new JsonResponse(['success' => false, 'error' => 'Missing orderIds'], 400);
        }

        $results = [];
        $created = 0;
        $failed = 0;
        $duplicate = 0;

        foreach ($orderIds as $orderId) {
            if (!\is_string($orderId)) {
                continue;
            }
            $res = $this->processor->process($orderId, $context);
            $results[] = $res;

            if (!$res['success']) {
                $failed++;
            } elseif ($res['status'] === 'duplicate') {
                $duplicate++;
            } else {
                $created++;
            }
        }

        return new JsonResponse([
            'success'   => $failed === 0,
            'created'   => $created,
            'duplicate' => $duplicate,
            'failed'    => $failed,
            'results'   => $results,
        ]);
    }

    #[Route(
        path: '/api/_action/mtsport-sps/print-labels',
        name: 'api.action.mtsport_sps.print_labels',
        methods: ['POST'],
    )]
    public function printLabels(Context $context): JsonResponse
    {
        $result = $this->webshipClient->printLabels();

        return new JsonResponse([
            'success'     => $result['errors'] === [],
            'documentUrl' => $result['documentUrl'],
            'error'       => $result['errors'] === [] ? null : implode(' | ', $result['errors']),
        ]);
    }

    #[Route(
        path: '/api/_action/mtsport-sps/end-of-day',
        name: 'api.action.mtsport_sps.end_of_day',
        methods: ['POST'],
    )]
    public function endOfDay(Context $context): JsonResponse
    {
        $result = $this->webshipClient->printEndOfDay();

        return new JsonResponse([
            'success'     => $result['errors'] === [],
            'documentUrl' => $result['documentUrl'],
            'error'       => $result['errors'] === [] ? null : implode(' | ', $result['errors']),
        ]);
    }
}
