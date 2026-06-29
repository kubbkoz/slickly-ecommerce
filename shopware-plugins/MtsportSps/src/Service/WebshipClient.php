<?php declare(strict_types=1);

namespace Mtsport\Sps\Service;

use Mtsport\Sps\Content\SpsShipment\SpsShipmentEntity;
use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\System\SystemConfig\SystemConfigService;

require_once __DIR__ . '/Webship/WebshipWebservice.php';

use SPS\Webship\Webservice\WebshipWebserviceClient;
use SPS\Webship\Webservice\WebshipWebserviceResponse;
use SPS\Webship\Webservice\serviceName;
use SPS\Webship\Webservice\fileFormat;
use SPS\Webship\Webservice\paperFormat;
use SPS\Webship\Webservice\pdfContentFormat;
use SPS\Webship\Webservice\printFromPos;
use SPS\Webship\Webservice\zplResolution;

/**
 * Wrapper okolo SPS WebShip SOAP API (vendored v src/Service/Webship/, namespace SPS\Webship\Webservice
 * — kópia z slovakparcelservice/lib, beze zmeny).
 *
 * Credentials a adresa odosielateľa sa čítajú z plugin system configu
 * (Admin → Rozšírenia → MtsportSps).
 *
 * POZNÁMKA: presné mapovanie polí objednávky → SOAP shipment payload (deliveryType
 * PS vs PT, balíková hmotnosť, COD suma) je odladené na základe `pickupPoint.type`
 * a súčtu `payload['weight']` line items — pri reálnych credentials môže vyžadovať doladenie.
 */
class WebshipClient
{
    private const CONFIG_DOMAIN = 'MtsportSps.config.';

    public function __construct(
        private readonly SystemConfigService $systemConfigService,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Bezpečne získa chybovú hlášku z odpovede WebShip volania.
     * Ochrana proti vendored krokom, ktoré pri SOAP zlyhaní vrátia SoapFault
     * (nemá hasErrors()) namiesto WebshipWebserviceResponse.
     */
    private function respError(mixed $resp, string $step): ?string
    {
        if ($resp instanceof WebshipWebserviceResponse) {
            return $resp->hasErrors() ? $step . ': ' . $resp->getErrors() : null;
        }
        if ($resp instanceof \SoapFault) {
            return $step . ' (SoapFault): ' . $resp->getMessage();
        }
        if ($resp === null) {
            return null;
        }

        return $step . ': unexpected response ' . \get_debug_type($resp);
    }

    /**
     * @return array{labelUrl: ?string, trackingNumber: ?string, errors: string[]}
     */
    public function createShipment(OrderEntity $order, SpsShipmentEntity $shipment, ?string $salesChannelId = null): array
    {
        $username = $this->config('webshipUsername', $salesChannelId);
        $password = $this->config('webshipPassword', $salesChannelId);

        $this->logger->info('[MtsportSps] createShipment start', [
            'orderNumber'    => $order->getOrderNumber(),
            'hasUsername'    => $username !== null,
            'hasPassword'    => $password !== null,
            'pickupPointId'  => $shipment->getPickupPointId(),
            'type'           => $shipment->getType(),
        ]);

        if (!$username || !$password) {
            return ['labelUrl' => null, 'trackingNumber' => null, 'errors' => ['WebShip credentials not configured']];
        }

        $deliveryAddress = $this->resolveDeliveryAddress($order);
        if ($deliveryAddress === null) {
            return ['labelUrl' => null, 'trackingNumber' => null, 'errors' => ['Order has no shipping address']];
        }

        // Balíkovo = objednávka má vybrané výdajné miesto; inak štandardný SPS kuriér na adresu zákazníka
        $isBalikovo = trim((string)$shipment->getPickupPointId()) !== '';

        $client = new WebshipWebserviceClient($username, $password);
        $webShipShipment = $client->createWebserviceShipment();

        $errors = [];

        $customer = $order->getOrderCustomer();
        $receiverName = trim((string)($customer?->getFirstName() . ' ' . $customer?->getLastName())) ?: 'Zákazník';
        $receiverEmail = (string)$customer?->getEmail();
        $receiverPhone = $deliveryAddress->getPhoneNumber() ?: '+421900000000';

        if ($isBalikovo) {
            // Výdajné miesto: PS = ParcelShop (predajňa), PT = ParcelTerminal/Balíkomat (box).
            // WebShip identifikuje cieľ podľa name+zip → name = kód miesta (SPS-A0447),
            // zip/city/street = adresa miesta, kontakt = zákazník.
            if (strtoupper((string)$shipment->getType()) === 'PS') {
                $client->setShipmentToPS($webShipShipment);
            } else {
                $client->setShipmentToPT($webShipShipment);
            }
            $resp = $client->setShipmentReceiverAddress(
                $webShipShipment,
                (string)$shipment->getCity(),
                (string)$shipment->getZip(),
                $shipment->getCountryIso() ?: 'SK',
                (string)$shipment->getAddress(),
                (string)$shipment->getPickupPointId(),
                $receiverName,
                $receiverPhone,
                $receiverEmail ?: 'noreply@mtsport.store',
                $receiverPhone,
            );
        } else {
            // Štandardný SPS kuriér — doručenie na ADRESU zákazníka.
            // POZOR: žiadny setShipmentToPS/PT (default deliveryType = adresa); PS by znamenal ParcelShop!
            $resp = $client->setShipmentReceiverAddress(
                $webShipShipment,
                $deliveryAddress->getCity(),
                $deliveryAddress->getZipcode(),
                $deliveryAddress->getCountry()?->getIso() ?? 'SK',
                $deliveryAddress->getStreet(),
                $receiverName,
                $receiverName,
                $receiverPhone,
                $receiverEmail ?: 'noreply@mtsport.store',
                $receiverPhone,
            );
        }
        if ($err = $this->respError($resp, 'Receiver address')) {
            $errors[] = $err;
        }

        $this->logger->info('[MtsportSps] shipment mode', [
            'orderNumber' => $order->getOrderNumber(),
            'mode'        => $isBalikovo ? 'balikovo' : 'courier',
            'target'      => $isBalikovo ? $shipment->getPickupPointId() : $deliveryAddress->getCity(),
        ]);

        $senderName = $this->config('senderName', $salesChannelId) ?: 'MTSPORT';
        $senderContactPerson = $this->config('senderContactPerson', $salesChannelId) ?: $senderName;
        $senderStreet = $this->config('senderStreet', $salesChannelId) ?: '';
        $senderZip = $this->config('senderZip', $salesChannelId) ?: '';
        $senderCity = $this->config('senderCity', $salesChannelId) ?: '';
        $senderCountryIso = $this->config('senderCountryIso', $salesChannelId) ?: 'SK';
        $senderPhone = $this->config('senderPhone', $salesChannelId) ?: '+421900000000';
        $senderEmail = $this->config('senderEmail', $salesChannelId) ?: 'noreply@mtsport.store';

        $resp = $client->setShipmentSenderAddress(
            $webShipShipment,
            $senderCity,
            $senderZip,
            $senderCountryIso,
            $senderStreet,
            $senderName,
            $senderContactPerson,
            $senderPhone,
            $senderEmail,
            $senderPhone,
        );
        if ($err = $this->respError($resp, 'Sender address')) {
            $errors[] = $err;
        }

        // ── WebShip parametre (podľa working SPS WooCommerce pluginu, export_data) ──
        $destCountryIso = strtoupper(
            $isBalikovo
                ? ($shipment->getCountryIso() ?: 'SK')
                : ($deliveryAddress->getCountry()?->getIso() ?? 'SK')
        );

        // Email notifikácia vždy; SMS iba pri doručení na adresu (kuriér), nie do Balíkomatu
        $client->setShipmentEmailNotify($webShipShipment);
        if (!$isBalikovo) {
            $client->setShipmentSMSNotify($webShipShipment);
        }

        // Service: zahraničie → export; SK domáce → default (nenastavuje sa)
        if ($destCountryIso !== 'SK') {
            $client->setShipmentServiceName($webShipShipment, serviceName::EXPORT);
        }

        $webShipShipment->returnshipment = false;
        $webShipShipment->saturdayshipment = false;

        // COD — iba ak je objednávka platená dobierkou (config codPaymentMethodId)
        if ($this->isCashOnDelivery($order, $salesChannelId)) {
            $resp = $client->setShipmentCod($webShipShipment, round($order->getAmountTotal(), 2));
            if ($err = $this->respError($resp, 'COD')) {
                $errors[] = $err;
            }
        }

        // Poistenie: pevná hodnota z configu (override) > hodnota objednávky (max 499 €)
        $insurValue = $this->resolveInsuranceValue($order, $salesChannelId);
        $resp = $client->setShipmentInsurValue($webShipShipment, $insurValue);
        if ($err = $this->respError($resp, 'Insurance value')) {
            $errors[] = $err;
        }

        // Počet balíkov: manuálny override (custom field) > kuriér: počet bicyklov > 1
        $packageCount = $this->resolvePackageCount($order, $isBalikovo, $salesChannelId);
        $totalWeight = $this->calculateWeight($order, $salesChannelId);
        $orderNumber = $order->getOrderNumber() ?? '';

        if ($packageCount <= 1) {
            $client->addShipmentPackage($webShipShipment, $orderNumber, (string)$totalWeight);
        } else {
            $perPackage = max(round($totalWeight / $packageCount, 2), 0.5);
            for ($i = 1; $i <= $packageCount; $i++) {
                $client->addShipmentPackage($webShipShipment, $orderNumber . '-' . $i, (string)$perPackage);
            }
        }
        $this->logger->info('[MtsportSps] packages', ['orderNumber' => $orderNumber, 'count' => $packageCount]);

        if ($errors !== []) {
            $this->logger->error('[MtsportSps] shipment build errors', ['errors' => $errors]);

            return ['labelUrl' => null, 'trackingNumber' => null, 'errors' => $errors];
        }

        $client->addShipmentToList($webShipShipment);

        // Tlačové nastavenia (A4 + pozícia) aj pre jednotlivý štítok → A6 v kvadrante, nie celá strana
        $this->applyPrintingSettings($client, $salesChannelId);
        $response = $client->createAndPrintCifShipmentWithSettings2();

        if ($err = $this->respError($response, 'createAndPrintCifShipment')) {
            $this->logger->error('[MtsportSps] WebShip create failed', ['error' => $err]);

            return ['labelUrl' => null, 'trackingNumber' => null, 'errors' => [$err]];
        }

        // getPackagesInfo() → [ ['refNr' => orderNumber, 'shipNr' => SPS číslo zásielky, 'packageNo' => N], ... ]
        $packagesInfo = $response->getPackagesInfo();
        $trackingNumber = null;
        if (\is_array($packagesInfo) && isset($packagesInfo[0]) && \is_array($packagesInfo[0])) {
            $trackingNumber = $packagesInfo[0]['shipNr'] ?? $packagesInfo[0]['refNr'] ?? null;
        }

        return [
            'labelUrl'       => $response->getDocumentUrl(),
            'trackingNumber' => $trackingNumber,
            'errors'         => [],
        ];
    }

    /**
     * Hromadná tlač štítkov — JEDEN kombinovaný PDF všetkých otvorených (ešte neuzavretých) zásielok
     * dňa. WebShip `printShipmentLabels`. Po vytlačení sa deň uzavrie cez printEndOfDay.
     *
     * @return array{documentUrl: ?string, errors: string[]}
     */
    public function printLabels(?string $salesChannelId = null): array
    {
        $username = $this->config('webshipUsername', $salesChannelId);
        $password = $this->config('webshipPassword', $salesChannelId);
        if (!$username || !$password) {
            return ['documentUrl' => null, 'errors' => ['WebShip credentials not configured']];
        }

        $client = new WebshipWebserviceClient($username, $password);

        $withSettings = $this->applyPrintingSettings($client, $salesChannelId);
        $resp = $withSettings ? $client->printLabelsWithSettings() : $client->printShipmentLabels();

        if ($err = $this->respError($resp, 'printShipmentLabels')) {
            $this->logger->error('[MtsportSps] print labels failed', ['error' => $err]);

            return ['documentUrl' => null, 'errors' => [$err]];
        }

        $this->logger->info('[MtsportSps] labels printed', ['documentUrl' => $resp->getDocumentUrl()]);

        return ['documentUrl' => $resp->getDocumentUrl(), 'errors' => []];
    }

    /**
     * Preberací protokol (End of Day / uzávierka dňa) — finalizuje denné zásielky pre kuriéra
     * a vráti PDF súpis. WebShip `printEndOfDay`.
     *
     * @return array{documentUrl: ?string, errors: string[]}
     */
    public function printEndOfDay(?string $salesChannelId = null): array
    {
        $username = $this->config('webshipUsername', $salesChannelId);
        $password = $this->config('webshipPassword', $salesChannelId);
        if (!$username || !$password) {
            return ['documentUrl' => null, 'errors' => ['WebShip credentials not configured']];
        }

        $client = new WebshipWebserviceClient($username, $password);
        $resp = $client->printEndOfDay();

        if ($err = $this->respError($resp, 'printEndOfDay')) {
            $this->logger->error('[MtsportSps] End of Day failed', ['error' => $err]);

            return ['documentUrl' => null, 'errors' => [$err]];
        }

        $this->logger->info('[MtsportSps] End of Day generated', ['documentUrl' => $resp->getDocumentUrl()]);

        return ['documentUrl' => $resp->getDocumentUrl(), 'errors' => []];
    }

    /**
     * Nastaví tlačové parametre na klientovi podľa configu. Vráti true, ak treba použiť
     * printLabelsWithSettings (t.j. nie je všetko default).
     */
    private function applyPrintingSettings(WebshipWebserviceClient $client, ?string $salesChannelId): bool
    {
        $format   = strtolower((string) ($this->config('printFormat', $salesChannelId) ?: 'pdf'));
        $paper    = strtolower((string) ($this->config('printPaper', $salesChannelId) ?: 'a4'));
        $content  = strtolower((string) ($this->config('printContent', $salesChannelId) ?: 'pdf'));
        $position = (string) ($this->config('printPosition', $salesChannelId) ?: '1');
        $zplRes   = strtolower((string) ($this->config('printZplResolution', $salesChannelId) ?: 'dpi_204'));

        // POZOR: nastavenia posielame VŽDY. Bez nich WebShip vytlačí jeden štítok na celú A4;
        // s A4 + printFromPos sa A4 rozdelí na 4 kvadranty (A6) a štítky sa pekne ukladajú.

        if ($format === 'zpl') {
            $client->setPrintingSettingsFileFormat(fileFormat::ZPL);
            $client->setPrintingSettingsZplResolution(match ($zplRes) {
                'dpi_300' => zplResolution::DPI_300,
                'dpi_600' => zplResolution::DPI_600,
                default   => zplResolution::DPI_204,
            });

            return true;
        }

        $client->setPrintingSettingsFileFormat(fileFormat::PDF);
        $client->setPrintingSettingsPdfContentFormat($content === 'bitmap' ? pdfContentFormat::BITMAP : pdfContentFormat::PDF);
        $client->setPrintingSettingsPaperFormat(match ($paper) {
            'a6'         => paperFormat::A6,
            'thermal_58' => paperFormat::THERMAL_58,
            default      => paperFormat::A4,
        });
        if ($paper === 'a4') {
            $client->setPrintingSettingsPrintFromPos(match ($position) {
                '2'     => printFromPos::P2,
                '3'     => printFromPos::P3,
                '4'     => printFromPos::P4,
                default => printFromPos::P1,
            });
        }

        return true;
    }

    private function resolveDeliveryAddress(OrderEntity $order): ?\Shopware\Core\Checkout\Order\Aggregate\OrderAddress\OrderAddressEntity
    {
        $delivery = $order->getDeliveries()?->first();
        if ($delivery !== null) {
            return $delivery->getShippingOrderAddress();
        }

        return $order->getAddresses()?->first();
    }

    /**
     * Počet balíkov:
     *   1) manuálny override z order.customFields[mtsport_sps_package_count] (ak > 0)
     *   2) Balíkovo → vždy 1
     *   3) Kuriér SPS → počet bicyklov/elektrobicyklov (1 bicykel = 1 balík), min 1
     */
    private function resolvePackageCount(OrderEntity $order, bool $isBalikovo, ?string $salesChannelId): int
    {
        $customFields = $order->getCustomFields() ?? [];
        $manual = $customFields['mtsport_sps_package_count'] ?? null;
        if (is_numeric($manual) && (int) $manual > 0) {
            return (int) $manual;
        }

        if ($isBalikovo) {
            return 1;
        }

        $bikeIds = $this->bikeCategoryIds($salesChannelId);
        if ($bikeIds === []) {
            return 1;
        }

        $bikeCount = 0;
        foreach ($order->getLineItems() ?? [] as $lineItem) {
            if ($lineItem->getType() !== 'product') {
                continue;
            }
            $payload = $lineItem->getPayload() ?? [];
            $cats = array_merge(
                (array) ($payload['categoryTree'] ?? []),
                (array) ($payload['categoryIds'] ?? [])
            );
            $cats = array_map(static fn ($c) => strtolower(str_replace('-', '', (string) $c)), $cats);
            if (array_intersect($cats, $bikeIds) !== []) {
                $bikeCount += $lineItem->getQuantity();
            }
        }

        return max(1, $bikeCount);
    }

    /**
     * Hodnota poistenia: pevná z configu (insuranceValueFixed, ak > 0) > hodnota objednávky (max 499 €).
     */
    private function resolveInsuranceValue(OrderEntity $order, ?string $salesChannelId): float
    {
        $fixed = $this->config('insuranceValueFixed', $salesChannelId);
        if ($fixed !== null && is_numeric($fixed) && (float) $fixed > 0) {
            return round((float) $fixed, 2);
        }

        return min(round($order->getAmountTotal(), 2), 499.0);
    }

    /**
     * @return string[] normalizované (lowercase, bez pomlčiek) UUID bike kategórií z configu
     */
    private function bikeCategoryIds(?string $salesChannelId): array
    {
        $raw = (string) ($this->config('bikeCategoryIds', $salesChannelId) ?? '');
        if (trim($raw) === '') {
            return [];
        }

        $ids = [];
        foreach (preg_split('/[\s,;]+/', $raw) ?: [] as $part) {
            $norm = strtolower(str_replace('-', '', trim($part)));
            if ($norm !== '') {
                $ids[] = $norm;
            }
        }

        return $ids;
    }

    private function calculateWeight(OrderEntity $order, ?string $salesChannelId): float
    {
        $default = (float)($this->config('defaultPackageWeightKg', $salesChannelId) ?: '1.0');
        $total = 0.0;

        foreach ($order->getLineItems() ?? [] as $lineItem) {
            $payload = $lineItem->getPayload() ?? [];
            $weight = isset($payload['weight']) ? (float)$payload['weight'] : null;
            if ($weight !== null && $weight > 0) {
                $total += $weight * $lineItem->getQuantity();
            }
        }

        return $total > 0 ? round($total, 2) : $default;
    }

    /**
     * COD = objednávka je platená dobierkou. Porovná paymentMethodId transakcie objednávky
     * s nakonfigurovaným `codPaymentMethodId` (UUID s/bez pomlčiek normalizované).
     */
    private function isCashOnDelivery(OrderEntity $order, ?string $salesChannelId): bool
    {
        $codId = $this->config('codPaymentMethodId', $salesChannelId);
        if ($codId === null) {
            return false;
        }
        $codId = strtolower(str_replace('-', '', $codId));

        foreach ($order->getTransactions() ?? [] as $tx) {
            if (strtolower((string)$tx->getPaymentMethodId()) === $codId) {
                return true;
            }
        }

        return false;
    }

    private function config(string $key, ?string $salesChannelId): ?string
    {
        $value = $this->systemConfigService->get(self::CONFIG_DOMAIN . $key, $salesChannelId);

        return $value !== null && $value !== '' ? (string)$value : null;
    }
}
