<?php declare(strict_types=1);

namespace Mtsport\Badge\Content\Badge\SalesChannel;

use Mtsport\Badge\Content\Badge\BadgeDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Store API endpoint pre MT-SPORT badges.
 *
 * Endpoint: POST /store-api/mtsport-badge
 * Auth: public sw-access-key
 *
 * Vracia všetky aktívne badges zoradené podľa sort.
 * Matching (category, tag, product ID, age, discount) robí Nuxt klient.
 */
#[Route(defaults: ['_routeScope' => ['store-api']])]
class BadgeRoute
{
    public function __construct(
        private readonly EntityRepository $badgeRepository,
    ) {
    }

    #[Route(
        path: '/store-api/mtsport-badge',
        name: 'store-api.mtsport_badge.list',
        methods: ['GET', 'POST'],
        defaults: ['_entity' => BadgeDefinition::ENTITY_NAME],
    )]
    public function load(Criteria $criteria, SalesChannelContext $context): JsonResponse
    {
        $criteria->addFilter(new EqualsFilter('active', true));
        $criteria->addSorting(new FieldSorting('sort', FieldSorting::ASCENDING));

        $result = $this->badgeRepository->search($criteria, $context->getContext());

        return new JsonResponse([
            'total'    => $result->getTotal(),
            'elements' => array_values($result->getEntities()->getElements()),
        ]);
    }
}
