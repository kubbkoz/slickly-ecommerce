<?php declare(strict_types=1);

namespace Mtsport\Badge\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityDeletedEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Po každej zmene MT-SPORT Badge entity invaliduje Redis cache
 * v Nuxt frontende cez GET {MTSPORT_NUXT_URL}/api/badges/clear?secret=...
 *
 * Spúšťa sa pri create, update aj delete.
 * Fire-and-forget — neblokuje save request.
 */
class BadgeCacheSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly string $nuxtUrl,
        private readonly string $webhookSecret,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'mtsport_badge.written' => 'onBadgeChanged',
            'mtsport_badge.deleted' => 'onBadgeChanged',
        ];
    }

    public function onBadgeChanged(EntityWrittenEvent|EntityDeletedEvent $event): void
    {
        if (!$this->nuxtUrl || !$this->webhookSecret) {
            return;
        }

        $url = rtrim($this->nuxtUrl, '/')
            . '/api/badges/clear?secret='
            . rawurlencode($this->webhookSecret);

        // Fire-and-forget cez cURL s nízkym timeoutom.
        // Ak Nuxt nebeží / pomalý → save sa NEBLOKUJE.
        try {
            if (function_exists('curl_init')) {
                $ch = curl_init($url);
                if ($ch !== false) {
                    curl_setopt_array($ch, [
                        CURLOPT_RETURNTRANSFER  => true,
                        CURLOPT_NOBODY          => true,
                        CURLOPT_CONNECTTIMEOUT  => 1,    // sekúnd
                        CURLOPT_TIMEOUT_MS      => 1500, // 1.5s celkový timeout
                        CURLOPT_FORBID_REUSE    => true,
                        CURLOPT_FRESH_CONNECT   => true,
                        CURLOPT_FOLLOWLOCATION  => false,
                    ]);
                    @curl_exec($ch);
                    curl_close($ch);
                    return;
                }
            }

            // Fallback ak cURL nie je k dispozícii
            $ctx = stream_context_create([
                'http' => [
                    'method'        => 'GET',
                    'timeout'       => 1,
                    'ignore_errors' => true,
                ],
            ]);
            @file_get_contents($url, false, $ctx);
        } catch (\Throwable) {
            // tichý fail — invalidácia cache nesmie zhodiť save
        }
    }
}
