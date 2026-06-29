<?php declare(strict_types=1);

namespace Mtsport\Sps\Subscriber;

use Mtsport\Sps\Service\SpsShipmentProcessor;
use Psr\Log\LoggerInterface;
use Shopware\Administration\Notification\NotificationService;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\StateMachine\Event\StateMachineTransitionEvent;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Pri prechode objednávky do nakonfigurovaného stavu (default `kurier_sps` = „Odoslať cez SPS")
 * automaticky vytvorí SPS WebShip zásielku cez SpsShipmentProcessor a výsledok (úspech/chyba/
 * duplicita) pošle do Shopware notifikácií (zvonček v admine).
 *
 * MUSÍ byť non-blocking — processor chytá výnimky a zapisuje webship_error.
 */
class OrderShipmentSubscriber implements EventSubscriberInterface
{
    private const CONFIG_DOMAIN = 'MtsportSps.config.';

    public function __construct(
        private readonly SpsShipmentProcessor $processor,
        private readonly EntityRepository $orderRepository,
        private readonly SystemConfigService $systemConfigService,
        private readonly LoggerInterface $logger,
        private readonly ?NotificationService $notificationService = null,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            StateMachineTransitionEvent::class => 'onStateMachineTransition',
        ];
    }

    public function onStateMachineTransition(StateMachineTransitionEvent $event): void
    {
        if ($event->getEntityName() !== 'order') {
            return;
        }

        $toPlace = $event->getToPlace()->getTechnicalName();
        $orderId = $event->getEntityId();
        $context = $event->getContext();

        // Toptrans stav → len označ kuriéra v objednávke (odosielanie Toptrans nie je v tomto plugine)
        if ($toPlace === 'kurier_toptrans') {
            $this->markCourier($orderId, 'TOPTRANS', $context);

            return;
        }

        $triggerState = (string) ($this->systemConfigService->get(self::CONFIG_DOMAIN . 'triggerStateTechnicalName') ?: 'kurier_sps');
        if ($toPlace !== $triggerState) {
            return;
        }

        $this->logger->info('[MtsportSps] trigger state reached', ['orderId' => $orderId, 'triggerState' => $triggerState]);

        $result = $this->processor->process($orderId, $context);

        if (!$result['success']) {
            $this->logger->error('[MtsportSps] auto shipment failed', ['orderId' => $orderId, 'error' => $result['error']]);
        }

        $this->notify($result, $context);
    }

    /**
     * Zapíše názov kuriéra do order.customFields (pre stĺpec Kuriér v zozname objednávok).
     */
    private function markCourier(string $orderId, string $courier, Context $context): void
    {
        try {
            $this->orderRepository->upsert([[
                'id'           => $orderId,
                'customFields' => ['mtsport_sps_courier' => $courier],
            ]], $context);
        } catch (\Throwable $e) {
            $this->logger->error('[MtsportSps] markCourier failed', ['orderId' => $orderId, 'exception' => $e]);
        }
    }

    /**
     * @param array{success: bool, status: string, orderNumber: ?string, labelUrl: ?string, trackingNumber: ?string, error: ?string} $result
     */
    private function notify(array $result, Context $context): void
    {
        if ($this->notificationService === null) {
            return;
        }

        $orderNumber = $result['orderNumber'] ?? '?';

        if ($result['success'] && $result['status'] === 'duplicate') {
            $status = 'info';
            $message = sprintf('SPS: Objednávka %s už má vytvorenú zásielku (č. %s).', $orderNumber, $result['trackingNumber'] ?? '—');
        } elseif ($result['success']) {
            $status = 'success';
            $message = sprintf('SPS: Objednávka %s odoslaná do WebShip, č. zásielky %s.', $orderNumber, $result['trackingNumber'] ?? '—');
        } else {
            $status = 'error';
            $message = sprintf('SPS: Objednávka %s — neodoslaná: %s', $orderNumber, $result['error'] ?? 'neznáma chyba');
        }

        try {
            $this->notificationService->createNotification([
                'id'                 => Uuid::randomHex(),
                'status'             => $status,
                'message'            => $message,
                'adminOnly'          => true,
                'requiredPrivileges' => [],
            ], $context);
        } catch (\Throwable $e) {
            $this->logger->error('[MtsportSps] notification failed', ['exception' => $e]);
        }
    }
}
