<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Loyalty\SalesChannel;

use Mtsport\Loyalty\Service\LoyaltyRedemptionService;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['store-api']])]
class LoyaltyRedeemRoute
{
    public function __construct(
        private readonly LoyaltyRedemptionService $redemptionService,
    ) {
    }

    #[Route(
        path: '/store-api/loyalty/redeem',
        name: 'store-api.loyalty.redeem',
        methods: ['POST'],
    )]
    public function redeem(Request $request, SalesChannelContext $context): JsonResponse
    {
        $customer = $context->getCustomer();
        if (!$customer) {
            return new JsonResponse(['success' => false, 'error' => 'not_logged_in'], 403);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $rewardId = $data['rewardId'] ?? null;
        if (!$rewardId) {
            return new JsonResponse(['success' => false, 'error' => 'Chýba rewardId.'], 400);
        }

        $result = $this->redemptionService->redeem($customer->getId(), $rewardId, $context->getContext());
        return new JsonResponse($result, $result['success'] ? 200 : 400);
    }
}
