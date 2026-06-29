<?php declare(strict_types=1);

namespace Mtsport\Sps\ScheduledTask;

use Mtsport\Sps\Service\SpsTrackingService;
use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler;
use Shopware\Core\System\StateMachine\StateMachineRegistry;
use Shopware\Core\System\StateMachine\Transition;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Prejde objednávky v stave `kurier_sps`, cez SPS T&T zistí prevzatie kuriérom a prepne ich
 * na `odoslane` („Odoslané"). Beží každých 8 h, ale reálne spracuje iba behy od konfigurovanej
 * hodiny (default 16:00) — kuriér berie balíky až poobede. Non-blocking.
 */
#[AsMessageHandler(handles: SpsTrackingTask::class)]
class SpsTrackingTaskHandler extends ScheduledTaskHandler
{
    private const CONFIG_DOMAIN = 'MtsportSps.config.';
    private const SOURCE_STATE = 'kurier_sps';
    private const TRANSITION_ACTION = 'ship';
    private const DEFAULT_START_HOUR = 16;
    private const DEFAULT_END_HOUR = 1;
    private const DEFAULT_END_MINUTE = 30;

    public function __construct(
        EntityRepository $scheduledTaskRepository,
        LoggerInterface $logger,
        private readonly EntityRepository $orderRepository,
        private readonly SpsTrackingService $trackingService,
        private readonly StateMachineRegistry $stateMachineRegistry,
        private readonly SystemConfigService $systemConfigService,
    ) {
        parent::__construct($scheduledTaskRepository, $logger);
    }

    public function run(): void
    {
        if (!$this->systemConfigService->getBool(self::CONFIG_DOMAIN . 'trackingEnabled')) {
            return;
        }

        // Okno sledovania (default 16:00 → 01:30) — kuriér berie balíky od 16:00, v noci dorazia stavy
        if (!$this->inTrackingWindow()) {
            return;
        }

        // Voliteľne iba pracovné dni (Po–Pia)
        if ($this->systemConfigService->getBool(self::CONFIG_DOMAIN . 'trackingWorkingDaysOnly') && (int) date('N') > 5) {
            return;
        }

        $context = Context::createDefaultContext();

        $criteria = (new Criteria())
            ->addAssociation('stateMachineState')
            ->addFilter(new EqualsFilter('stateMachineState.technicalName', self::SOURCE_STATE))
            ->setLimit(250);

        $orders = $this->orderRepository->search($criteria, $context);

        $shipped = 0;
        foreach ($orders as $order) {
            /** @var OrderEntity $order */
            $orderNumber = $order->getOrderNumber();
            if (!$orderNumber) {
                continue;
            }

            try {
                if (!$this->trackingService->isPickedUp($orderNumber, $order->getSalesChannelId())) {
                    continue;
                }

                $this->stateMachineRegistry->transition(
                    new Transition('order', $order->getId(), self::TRANSITION_ACTION, 'stateId'),
                    $context
                );

                $this->storeTrackingUrl($order, $context);

                $shipped++;
                $this->logger->info('[MtsportSps] order marked shipped (T&T pickup)', ['orderNumber' => $orderNumber]);
            } catch (\Throwable $e) {
                $this->logger->error('[MtsportSps] tracking transition failed', [
                    'orderNumber' => $orderNumber,
                    'exception'   => $e,
                ]);
            }
        }

        if ($shipped > 0) {
            $this->logger->info('[MtsportSps] tracking run finished', ['shipped' => $shipped]);
        }
    }

    /**
     * Okno sledovania, ktoré môže prechádzať cez polnoc (napr. 16:00 → 01:30).
     */
    private function inTrackingWindow(): bool
    {
        $startHour  = $this->systemConfigService->getInt(self::CONFIG_DOMAIN . 'trackingStartHour');
        $endHour    = $this->systemConfigService->getInt(self::CONFIG_DOMAIN . 'trackingEndHour');
        $endMinute  = $this->systemConfigService->getInt(self::CONFIG_DOMAIN . 'trackingEndMinute');

        if ($startHour === 0 && $endHour === 0 && $endMinute === 0) {
            $startHour = self::DEFAULT_START_HOUR;
            $endHour   = self::DEFAULT_END_HOUR;
            $endMinute = self::DEFAULT_END_MINUTE;
        }

        $now   = (int) date('G') * 60 + (int) date('i');
        $start = $startHour * 60;
        $end   = $endHour * 60 + $endMinute;

        return $start <= $end
            ? ($now >= $start && $now <= $end)
            : ($now >= $start || $now <= $end); // okno cez polnoc
    }

    private function storeTrackingUrl(OrderEntity $order, Context $context): void
    {
        $url = $this->trackingService->trackingUrl((string) $order->getOrderNumber(), $order->getSalesChannelId());
        if ($url === null) {
            return;
        }
        $this->orderRepository->upsert([[
            'id'           => $order->getId(),
            'customFields' => ['mtsport_sps_tracking_url' => $url],
        ]], $context);
    }
}
