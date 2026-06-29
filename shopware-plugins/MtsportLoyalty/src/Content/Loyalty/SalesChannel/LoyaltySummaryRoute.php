<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Loyalty\SalesChannel;

use Mtsport\Loyalty\Service\LoyaltyPointsService;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['store-api']])]
class LoyaltySummaryRoute
{
    public function __construct(
        private readonly LoyaltyPointsService $pointsService,
    ) {
    }

    #[Route(
        path: '/store-api/loyalty/summary',
        name: 'store-api.loyalty.summary',
        methods: ['GET', 'POST'],
    )]
    public function summary(Request $request, SalesChannelContext $context): JsonResponse
    {
        $customer = $context->getCustomer();
        if (!$customer) {
            return new JsonResponse(['error' => 'not_logged_in'], 403);
        }

        $summary = $this->pointsService->getCustomerSummary($customer->getId(), $context->getContext());
        return new JsonResponse($summary);
    }
}
