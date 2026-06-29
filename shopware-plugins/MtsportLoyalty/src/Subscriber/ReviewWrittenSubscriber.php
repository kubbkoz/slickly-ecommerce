<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Subscriber;

use Doctrine\DBAL\Connection;
use Mtsport\Loyalty\Service\LoyaltyPointsService;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Awards points for product reviews.
 * First review: +50, subsequent: +20. Only on insert. Silent.
 */
class ReviewWrittenSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly LoyaltyPointsService $pointsService,
        private readonly EntityRepository $reviewRepository,
        private readonly Connection $connection,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'product_review.written' => 'onReviewWritten',
        ];
    }

    public function onReviewWritten(EntityWrittenEvent $event): void
    {
        try {
            foreach ($event->getWriteResults() as $result) {
                if ($result->getOperation() !== 'insert') {
                    continue;
                }

                $payload = $result->getPayload();
                $reviewId = $payload['id'] ?? null;
                if (!$reviewId) {
                    continue;
                }

                $review = $this->reviewRepository->search(new Criteria([$reviewId]), $event->getContext())->first();
                if (!$review) {
                    continue;
                }

                $customerId = $review->get('customerId');
                if (!$customerId) {
                    continue; // anonymous review
                }

                // Count prior reviews by this customer (excluding this one)
                $priorCount = (int) $this->connection->fetchOne(
                    'SELECT COUNT(*) FROM product_review WHERE customer_id = :cid AND id != :rid',
                    [
                        'cid' => Uuid::fromHexToBytes($customerId),
                        'rid' => Uuid::fromHexToBytes($reviewId),
                    ]
                );

                $points = $priorCount === 0 ? 50 : 20;
                $desc = $priorCount === 0 ? 'Prvá recenzia' : 'Recenzia produktu';

                $this->pointsService->addPoints(
                    $customerId,
                    $points,
                    'review',
                    $reviewId,
                    $desc,
                    $event->getContext()
                );
            }
        } catch (\Throwable $e) {
            error_log('[MtsportLoyalty] ReviewWritten failed: ' . $e->getMessage());
        }
    }
}
