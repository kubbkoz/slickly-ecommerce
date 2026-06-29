<?php declare(strict_types=1);

namespace Mtsport\Blog\Content\Article\SalesChannel;

use Mtsport\Blog\Content\Article\ArticleDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Store API endpoint pre MT-SPORT blog články.
 *
 * Native PHP EntityDefinition (na rozdiel od XML Custom Entity) automaticky
 * NEexposuje entity cez /store-api/. Musíme manuálne pridať route controller.
 *
 * Endpoint: POST /store-api/mtsport-article
 * Auth: public sw-access-key (sales channel access key)
 *
 * Request body: štandardný Criteria pattern
 *   { filter: [...], sort: [...], limit: 50, associations: { cover: {} }, includes: {...} }
 *
 * Response: { total, elements: [...], aggregations: {...} }
 */
#[Route(defaults: ['_routeScope' => ['store-api']])]
class ArticleRoute
{
    public function __construct(
        private readonly EntityRepository $articleRepository,
    ) {
    }

    #[Route(
        path: '/store-api/mtsport-article',
        name: 'store-api.mtsport_article.search',
        methods: ['GET', 'POST'],
        defaults: ['_entity' => ArticleDefinition::ENTITY_NAME],
    )]
    public function load(Criteria $criteria, SalesChannelContext $context): JsonResponse
    {
        // CMS page s plnou štruktúrou pre Nuxt <CmsPage> rendering
        // cms_slot nemá DAL media asociáciu — media je v config JSON poli
        $criteria->addAssociation('cmsPage.sections.blocks.slots');
        $criteria->addAssociation('cmsPage.sections.backgroundMedia');
        $criteria->addAssociation('cmsPage.sections.blocks.backgroundMedia');

        $result = $this->articleRepository->search($criteria, $context->getContext());

        return new JsonResponse([
            'total'        => $result->getTotal(),
            'elements'     => array_values($result->getEntities()->getElements()),
            'aggregations' => $result->getAggregations()->getElements(),
        ]);
    }
}
