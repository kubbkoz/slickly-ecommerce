<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Content\Loyalty\SalesChannel;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['store-api']])]
class LoyaltyTransactionsRoute
{
    public function __construct(
        private readonly EntityRepository $transactionRepository,
    ) {
    }

    #[Route(
        path: '/store-api/loyalty/transactions',
        name: 'store-api.loyalty.transactions',
        methods: ['GET', 'POST'],
    )]
    public function transactions(Request $request, SalesChannelContext $context): JsonResponse
    {
        $customer = $context->getCustomer();
        if (!$customer) {
            return new JsonResponse(['error' => 'not_logged_in'], 403);
        }

        $limit = (int) $request->query->get('limit', 20);
        $page = max(1, (int) $request->query->get('page', 1));

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('customerId', $customer->getId()));
        $criteria->addSorting(new FieldSorting('createdAt', FieldSorting::DESCENDING));
        $criteria->setLimit($limit);
        $criteria->setOffset(($page - 1) * $limit);
        $criteria->setTotalCountMode(Criteria::TOTAL_COUNT_MODE_EXACT);

        $result = $this->transactionRepository->search($criteria, $context->getContext());

        $transactions = [];
        foreach ($result->getElements() as $t) {
            $transactions[] = [
                'id'          => $t->get('id'),
                'points'      => $t->get('points'),
                'type'        => $t->get('type'),
                'description' => $t->get('description'),
                'createdAt'   => $t->get('createdAt')?->format(\DATE_ATOM),
            ];
        }

        return new JsonResponse([
            'transactions' => $transactions,
            'total'        => $result->getTotal(),
        ]);
    }
}
