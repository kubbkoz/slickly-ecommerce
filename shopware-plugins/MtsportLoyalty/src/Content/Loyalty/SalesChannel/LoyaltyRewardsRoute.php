<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Loyalty\SalesChannel;

use Mtsport\Loyalty\Service\LoyaltyPointsService;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['store-api']])]
class LoyaltyRewardsRoute
{
    public function __construct(
        private readonly EntityRepository $rewardRepository,
        private readonly LoyaltyPointsService $pointsService,
    ) {
    }

    #[Route(
        path: '/store-api/loyalty/rewards',
        name: 'store-api.loyalty.rewards',
        methods: ['GET', 'POST'],
    )]
    public function rewards(Request $request, SalesChannelContext $context): JsonResponse
    {
        $customer = $context->getCustomer();
        if (!$customer) {
            return new JsonResponse(['error' => 'not_logged_in'], 403);
        }

        $points = $this->pointsService->getCustomerPoints($customer->getId());

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('isActive', true));
        $criteria->addSorting(new FieldSorting('pointsRequired', FieldSorting::ASCENDING));
        $result = $this->rewardRepository->search($criteria, $context->getContext());

        $rewards = [];
        foreach ($result->getElements() as $r) {
            $required = (int) $r->get('pointsRequired');
            $rewards[] = [
                'id'             => $r->get('id'),
                'name'           => $r->get('name'),
                'description'    => $r->get('description'),
                'pointsRequired' => $required,
                'type'           => $r->get('type'),
                'discountValue'  => $r->get('discountValue'),
                'validDays'      => $r->get('validDays'),
                'canRedeem'      => $points >= $required,
            ];
        }

        return new JsonResponse(['rewards' => $rewards, 'availablePoints' => $points]);
    }
}
