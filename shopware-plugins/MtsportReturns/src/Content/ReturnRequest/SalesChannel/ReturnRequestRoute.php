<?php declare(strict_types=1);

namespace Mtsport\Returns\Content\ReturnRequest\SalesChannel;

use Mtsport\Returns\Content\ReturnRequest\ReturnRequestDefinition;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Store API endpoint pre submitnutie formulára (vrátenie / reklamácia).
 *
 * Endpoint: POST /store-api/mtsport-return
 * Auth: public sw-access-key (Sales Channel)
 *
 * Request body (JSON):
 *   formType:         'vratenie' | 'reklamacia'         (required)
 *   orderNumber:      string                            (required)
 *   orderId:          string|null                       (UUID, optional)
 *   firstName:        string                            (required)
 *   lastName:         string                            (required)
 *   customerEmail:    string                            (required)
 *   customerPhone:    string                            (required)
 *   customerAddress:  string                            (required)
 *   orderDate:        string|null                       (YYYY-MM-DD)
 *   invoiceNumber:    string|null
 *   bankAccount:      string|null                       (required pre vratenie)
 *   itemsDescription: string                            (required)
 *   reasonCategory:   string|null
 *   reasonDetail:     string                            (required)
 *   attachmentPaths:  string[]                          (media UUIDs)
 *   warrantyPaths:    string[]                          (media UUIDs — pre reklamáciu)
 *
 * Response:
 *   { success: true, referenceNumber: "RR-2026-12345", id: "uuid" }
 */
#[Route(defaults: ['_routeScope' => ['store-api']])]
class ReturnRequestRoute
{
    public function __construct(
        private readonly EntityRepository $returnRepository,
    ) {
    }

    #[Route(
        path: '/store-api/mtsport-return',
        name: 'store-api.mtsport_return.submit',
        methods: ['POST'],
    )]
    public function submit(Request $request, SalesChannelContext $context): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        // Required validation
        $required = ['formType', 'orderNumber', 'firstName', 'lastName', 'customerEmail', 'customerPhone', 'customerAddress', 'itemsDescription', 'reasonDetail'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return new JsonResponse(['success' => false, 'error' => "Missing field: {$field}"], 400);
            }
        }

        $formType = in_array($data['formType'], ['vratenie', 'reklamacia'], true) ? $data['formType'] : 'vratenie';

        // IBAN povinný pre vratenie
        if ($formType === 'vratenie' && empty($data['bankAccount'])) {
            return new JsonResponse(['success' => false, 'error' => 'bankAccount required for vratenie'], 400);
        }

        // Generate reference number RR-{year}-{5-digit random}
        $year = date('Y');
        $referenceNumber = sprintf('RR-%s-%05d', $year, random_int(10000, 99999));

        $id = Uuid::randomHex();

        $entry = [
            'id'               => $id,
            'referenceNumber'  => $referenceNumber,
            'formType'         => $formType,
            'orderNumber'      => (string)$data['orderNumber'],
            'orderId'          => isset($data['orderId']) ? (string)$data['orderId'] : null,
            'firstName'        => (string)$data['firstName'],
            'lastName'         => (string)$data['lastName'],
            'customerName'     => trim((string)$data['firstName'] . ' ' . (string)$data['lastName']),
            'customerEmail'    => (string)$data['customerEmail'],
            'customerPhone'    => (string)$data['customerPhone'],
            'customerAddress'  => (string)$data['customerAddress'],
            'orderDate'        => $this->parseDate($data['orderDate'] ?? null),
            'invoiceNumber'    => isset($data['invoiceNumber']) ? (string)$data['invoiceNumber'] : null,
            'bankAccount'      => isset($data['bankAccount']) ? (string)$data['bankAccount'] : null,
            'itemsDescription' => (string)$data['itemsDescription'],
            'reasonCategory'   => isset($data['reasonCategory']) ? (string)$data['reasonCategory'] : null,
            'reasonDetail'     => (string)$data['reasonDetail'],
            'attachmentPaths'  => isset($data['attachmentPaths']) && is_array($data['attachmentPaths'])
                                    ? json_encode(array_values($data['attachmentPaths']))
                                    : null,
            'warrantyPaths'    => isset($data['warrantyPaths']) && is_array($data['warrantyPaths'])
                                    ? json_encode(array_values($data['warrantyPaths']))
                                    : null,
            'withdrawalDate'   => date('Y-m-d'),
            'status'           => 'received',
            'ipAddress'        => $request->getClientIp(),
            'userAgent'        => substr((string)$request->headers->get('User-Agent', ''), 0, 255),
            'confirmationSent' => false,
        ];

        try {
            $this->returnRepository->create([$entry], $context->getContext());
        } catch (\Throwable $e) {
            // Vráti detail aby klient (Nuxt proxy + frontend modal) vedel zobraziť dôvod
            return new JsonResponse([
                'success' => false,
                'error'   => 'create_failed',
                'detail'  => $e->getMessage(),
                'class'   => \get_class($e),
            ], 500);
        }

        return new JsonResponse([
            'success'         => true,
            'id'              => $id,
            'referenceNumber' => $referenceNumber,
        ]);
    }

    private function parseDate(?string $raw): ?string
    {
        if (!$raw) return null;
        try {
            return (new \DateTime($raw))->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }
}
