<?php declare(strict_types=1);

namespace Mtsport\Sps\Service;

use Psr\Log\LoggerInterface;
use Shopware\Core\System\SystemConfig\SystemConfigService;

/**
 * Sledovanie zásielky cez SPS Track & Trace (WebShip WSDL tracking metódu nemá).
 *
 * Scrape: https://t-t.sps-sro.sk/result.php?cmd=VERKNR_SEARCH&kundenr={KUNDENR}&verknr={ČÍSLO_OBJEDNÁVKY}
 * Ak telo obsahuje niektoré z kľúčových slov (Odnáška / Pickedup / Vstup / Loaded / SPLIT /
 * Prvá registrácia), zásielka je prevzatá kuriérom → objednávku možno prepnúť na „Odoslané".
 *
 * `kundenr` (SPS zákaznícke číslo) je konfigurovateľné (test/produkcia).
 */
class SpsTrackingService
{
    private const CONFIG_DOMAIN = 'MtsportSps.config.';
    private const TT_BASE = 'https://t-t.sps-sro.sk/result.php';
    private const KEYWORDS = ['Odnáška', 'Pickedup', 'Vstup', 'Loaded', 'SPLIT', 'Prvá registrácia'];

    public function __construct(
        private readonly SystemConfigService $systemConfigService,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Verejná URL Track & Trace pre dané číslo objednávky (na zobrazenie zákazníkovi/adminovi).
     */
    public function trackingUrl(string $orderNumber, ?string $salesChannelId = null): ?string
    {
        $kundenr = $this->customerNumber($salesChannelId);
        if ($kundenr === null) {
            return null;
        }

        return self::TT_BASE . '?' . http_build_query([
            'cmd'       => 'VERKNR_SEARCH',
            'sprache'   => 'SK',
            'km_mandnr' => '1',
            'kundenr'   => $kundenr,
            'verknr'    => $orderNumber,
        ]);
    }

    /**
     * True, ak T&T potvrdí prevzatie zásielky (jedno z kľúčových slov v tele stránky).
     */
    public function isPickedUp(string $orderNumber, ?string $salesChannelId = null): bool
    {
        $url = $this->trackingUrl($orderNumber, $salesChannelId);
        if ($url === null) {
            $this->logger->warning('[MtsportSps] tracking skipped — spsCustomerNumber not configured');

            return false;
        }

        $body = $this->fetch($url);
        if ($body === null) {
            return false;
        }

        foreach (self::KEYWORDS as $keyword) {
            if (mb_stripos($body, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    private function fetch(string $url): ?string
    {
        try {
            $context = stream_context_create([
                'http' => ['timeout' => 20, 'ignore_errors' => true, 'user_agent' => 'MtsportSps/1.0'],
                'ssl'  => ['verify_peer' => true, 'verify_peer_name' => true],
            ]);
            $body = @file_get_contents($url, false, $context);
            if ($body === false || $body === '') {
                $this->logger->warning('[MtsportSps] T&T fetch failed', ['url' => $url]);

                return null;
            }

            return $body;
        } catch (\Throwable $e) {
            $this->logger->error('[MtsportSps] T&T fetch exception', ['exception' => $e, 'url' => $url]);

            return null;
        }
    }

    private function customerNumber(?string $salesChannelId): ?string
    {
        $value = $this->systemConfigService->get(self::CONFIG_DOMAIN . 'spsCustomerNumber', $salesChannelId);
        $value = $value !== null ? trim((string) $value) : '';

        return $value !== '' ? $value : null;
    }
}
