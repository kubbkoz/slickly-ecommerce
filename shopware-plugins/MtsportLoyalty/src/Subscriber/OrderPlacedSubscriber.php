<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Subscriber;

use Mtsport\Loyalty\Service\LoyaltyPointsService;
use Shopware\Core\Checkout\Order\Event\OrderPlacedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Awards loyalty points on order placement.
 * points = floor(amountTotal / 10). Only for registered (non-guest) customers.
 * Silent — must never break order placement.
 */
class OrderPlacedSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly LoyaltyPointsService $pointsService,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            OrderPlacedEvent::class => 'onOrderPlaced',
        ];
    }

    public function onOrderPlaced(OrderPlacedEvent $event): void
    {
        try {
            $order = $event->getOrder();
            $orderCustomer = $order->getOrderCustomer();
            if (!$orderCustomer) {
                return;
            }

            $customerId = $orderCustomer->getCustomerId();
            if (!$customerId) {
                return; // guest checkout — no points
            }

            $total = (float) $order->getAmountTotal();
            $points = (int) floor($total / 10);
            if ($points <= 0) {
                return;
            }

            $this->pointsService->addPoints(
                $customerId,
                $points,
                'purchase',
                $order->getOrderNumber(),
                'Nákup #' . $order->getOrderNumber(),
                $event->getContext()
            );
        } catch (\Throwable $e) {
            error_log('[MtsportLoyalty] OrderPlaced failed: ' . $e->getMessage());
        }
    }
}
