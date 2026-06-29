<?php declare(strict_types=1);

namespace Mtsport\Returns\Subscriber;

use Shopware\Core\Content\Mail\Service\MailService;
use Shopware\Core\Content\MailTemplate\MailTemplateEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\SalesChannel\SalesChannelEntity;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Posiela email pri každej zmene statusu return requestu.
 *
 * 8 templates (lookup cez technical_name v `mail_template`):
 *   mtsport_return_vratenie_received
 *   mtsport_return_vratenie_processing
 *   mtsport_return_vratenie_approved
 *   mtsport_return_vratenie_rejected
 *   mtsport_return_reklamacia_received
 *   mtsport_return_reklamacia_processing
 *   mtsport_return_reklamacia_approved
 *   mtsport_return_reklamacia_rejected
 *
 * Triggers:
 *   - INSERT (status='received')   → confirmation email + nastav confirmation_sent=1
 *   - UPDATE status                → email pre nový status
 *
 * Variables dostupné v template:
 *   {{ request.referenceNumber }}, {{ request.customerName }}, {{ request.orderNumber }},
 *   {{ request.customerEmail }}, {{ request.formType }}, {{ request.status }}, {{ siteName }}
 */
class ReturnStatusSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly MailService $mailService,
        private readonly EntityRepository $returnRepository,
        private readonly EntityRepository $mailTemplateRepository,
        private readonly EntityRepository $salesChannelRepository,
        private readonly ?string $fromEmail = null,
        private readonly ?string $fromName = null,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'mtsport_return_request.written' => 'onWritten',
        ];
    }

    public function onWritten(EntityWrittenEvent $event): void
    {
        // CRITICAL: subscriber MUSÍ byť fully silent — chyba tu nesmie zhodiť write transaction.
        try {
            if (!$this->fromEmail) {
                return; // Email not configured — skip silently
            }

            $context = $event->getContext();

            foreach ($event->getWriteResults() as $writeResult) {
                try {
                    $payload = $writeResult->getPayload();
                    $id = $payload['id'] ?? null;
                    if (!$id) continue;

                    $isCreate = $writeResult->getOperation() === 'insert';
                    $statusChanged = isset($payload['status']);

                    if (!$isCreate && !$statusChanged) {
                        continue;
                    }

                    $request = $this->loadRequest($id, $context);
                    if (!$request) continue;

                    $status = $request['status'] ?? 'received';
                    $formType = $request['formType'] ?? 'vratenie';
                    $technicalName = sprintf('mtsport_return_%s_%s', $formType, $status);

                    $this->sendEmail($technicalName, $request, $context);

                    if ($isCreate) {
                        // Use silent update — error tu nesmie zhodiť pôvodný request
                        try {
                            $this->returnRepository->update([[
                                'id' => $id,
                                'confirmationSent' => true,
                            ]], $context);
                        } catch (\Throwable) { /* ignore */ }
                    }
                } catch (\Throwable $inner) {
                    error_log('[MtsportReturns] Per-entry failure: ' . $inner->getMessage());
                }
            }
        } catch (\Throwable $e) {
            error_log('[MtsportReturns] Subscriber crashed: ' . $e->getMessage());
        }
    }

    private function loadRequest(string $id, Context $context): ?array
    {
        $criteria = new Criteria([$id]);
        $entity = $this->returnRepository->search($criteria, $context)->first();
        if (!$entity) return null;

        return [
            'id'              => $entity->get('id'),
            'referenceNumber' => $entity->get('referenceNumber'),
            'formType'        => $entity->get('formType'),
            'status'          => $entity->get('status'),
            'orderNumber'     => $entity->get('orderNumber'),
            'customerName'    => $entity->get('customerName'),
            'customerEmail'   => $entity->get('customerEmail'),
            'reasonCategory'  => $entity->get('reasonCategory'),
            'reasonDetail'    => $entity->get('reasonDetail'),
            'bankAccount'     => $entity->get('bankAccount'),
        ];
    }

    private function sendEmail(string $technicalName, array $request, Context $context): void
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('mailTemplateType.technicalName', $technicalName));
        $criteria->setLimit(1);

        /** @var MailTemplateEntity|null $template */
        $template = $this->mailTemplateRepository->search($criteria, $context)->first();
        if (!$template) {
            error_log("[MtsportReturns] Mail template not found: {$technicalName}");
            return;
        }

        // Default sales channel (storefront)
        $salesChannel = $this->salesChannelRepository->search(new Criteria(), $context)->first();
        $salesChannelId = $salesChannel ? $salesChannel->get('id') : null;

        $data = [
            'recipients' => [
                $request['customerEmail'] => $request['customerName'] ?? $request['customerEmail'],
            ],
            'senderName'  => $this->fromName ?: 'MT-SPORT',
            'subject'     => $template->getSubject(),
            'contentHtml' => $template->getContentHtml(),
            'contentPlain' => $template->getContentPlain(),
            'salesChannelId' => $salesChannelId,
        ];

        $templateData = [
            'request' => $request,
            'siteName' => 'MT-SPORT',
        ];

        $this->mailService->send($data, $context, $templateData);
    }
}
