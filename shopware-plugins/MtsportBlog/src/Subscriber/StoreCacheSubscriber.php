<?php declare(strict_types=1);

namespace Mtsport\Blog\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Po každej zmene Sales Channel (vrátane custom fields) invaliduje
 * Redis cache otváracích hodín v Nuxt frontende.
 *
 * Volá: GET {MTSPORT_NUXT_URL}/api/store/clear-hours
 */
class StoreCacheSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly string $nuxtUrl)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'sales_channel.written' => 'onSalesChannelChanged',
        ];
    }

    public function onSalesChannelChanged(EntityWrittenEvent $event): void
    {
        if (!$this->nuxtUrl) {
            return;
        }

        try {
            $url = rtrim($this->nuxtUrl, '/') . '/api/store/clear-hours';
            $ctx = stream_context_create([
                'http' => [
                    'method'        => 'GET',
                    'timeout'       => 3,
                    'ignore_errors' => true,
                ],
            ]);
            @file_get_contents($url, false, $ctx);
        } catch (\Throwable) {
            // tichý fail
        }
    }
}
