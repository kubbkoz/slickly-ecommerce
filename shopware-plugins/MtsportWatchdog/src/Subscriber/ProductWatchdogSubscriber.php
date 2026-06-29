<?php declare(strict_types=1);

namespace Mtsport\Watchdog\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Listens to product.written events and fires a non-blocking webhook
 * to Nuxt, which checks watchdog subscribers and sends email notifications.
 *
 * MUST be non-blocking — cURL fire-and-forget with short timeouts.
 * Same pattern as MtsportBadge\BadgeCacheSubscriber.
 */
class ProductWatchdogSubscriber implements EventSubscriberInterface
{
    private string $nuxtUrl;
    private string $webhookSecret;

    public function __construct(string $nuxtUrl = '', string $webhookSecret = '')
    {
        $this->nuxtUrl = rtrim($nuxtUrl, '/');
        $this->webhookSecret = $webhookSecret;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'product.written' => 'onProductWritten',
        ];
    }

    public function onProductWritten(EntityWrittenEvent $event): void
    {
        if (!$this->nuxtUrl || !$this->webhookSecret) {
            return;
        }

        $productIds = [];
        foreach ($event->getWriteResults() as $result) {
            $pk = $result->getPrimaryKey();
            if (is_string($pk)) {
                $productIds[] = $pk;
            } elseif (is_array($pk) && isset($pk['id'])) {
                $productIds[] = $pk['id'];
            }
        }

        $productIds = array_unique(array_filter($productIds));
        if (empty($productIds)) {
            return;
        }

        $url = $this->nuxtUrl . '/api/watchdog/check';
        $payload = json_encode(['productIds' => array_values($productIds)]);

        // Fire-and-forget — non-blocking, short timeout
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'x-webhook-secret: ' . $this->webhookSecret,
                ],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 1,
                CURLOPT_TIMEOUT_MS => 2000,
                CURLOPT_FORBID_REUSE => true,
                CURLOPT_FRESH_CONNECT => true,
            ]);
            @curl_exec($ch);
            @curl_close($ch);
        } else {
            $ctx = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/json\r\nx-webhook-secret: {$this->webhookSecret}\r\n",
                    'content' => $payload,
                    'timeout' => 2,
                ],
            ]);
            @file_get_contents($url, false, $ctx);
        }
    }
}
