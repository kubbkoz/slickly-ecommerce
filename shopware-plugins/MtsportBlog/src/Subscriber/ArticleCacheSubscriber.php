<?php declare(strict_types=1);

namespace Mtsport\Blog\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityDeletedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Po každom uložení / zmazaní mtsport_article invaliduje Redis cache
 * v Nuxt frontende volaním GET {MTSPORT_NUXT_URL}/api/blog/clear-cache.
 *
 * Konfigurácia: nastaviť MTSPORT_NUXT_URL v Shopware .env
 *   napr. MTSPORT_NUXT_URL=http://localhost:3000
 *
 * Zlyhanie (Nuxt nedostupný) je tichý — cache expiruje prirodzene.
 */
class ArticleCacheSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly string $nuxtUrl)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'mtsport_article.written' => 'onArticleChanged',
            'mtsport_article.deleted' => 'onArticleChanged',
        ];
    }

    public function onArticleChanged(EntityWrittenEvent|EntityDeletedEvent $event): void
    {
        if (!$this->nuxtUrl) {
            return;
        }

        try {
            $url = rtrim($this->nuxtUrl, '/') . '/api/blog/clear-cache';
            $ctx = stream_context_create([
                'http' => [
                    'method'        => 'GET',
                    'timeout'       => 3,
                    'ignore_errors' => true,
                ],
            ]);
            @file_get_contents($url, false, $ctx);
        } catch (\Throwable) {
            // tichý fail — cache expiruje prirodzene (30 min TTL)
        }
    }
}
