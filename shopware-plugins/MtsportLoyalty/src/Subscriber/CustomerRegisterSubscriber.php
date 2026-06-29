<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Subscriber;

use Mtsport\Loyalty\Service\LoyaltyPointsService;
use Shopware\Core\Checkout\Customer\Event\CustomerRegisterEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * +10 points on customer registration. Silent.
 */
class CustomerRegisterSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly LoyaltyPointsService $pointsService,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CustomerRegisterEvent::class => 'onRegister',
        ];
    }

    public function onRegister(CustomerRegisterEvent $event): void
    {
        try {
            $customer = $event->getCustomer();
            if (!$customer || $customer->getGuest()) {
                return;
            }

            $this->pointsService->addPoints(
                $customer->getId(),
                10,
                'registration',
                null,
                'Registrácia účtu',
                $event->getContext()
            );
        } catch (\Throwable $e) {
            error_log('[MtsportLoyalty] CustomerRegister failed: ' . $e->getMessage());
        }
    }
}
