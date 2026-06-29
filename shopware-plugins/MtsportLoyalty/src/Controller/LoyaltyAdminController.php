<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Controller;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Context;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['api']])]
class LoyaltyAdminController
{
    public function __construct(
        private readonly Connection $connection,
    ) {
    }

    /**
     * Aggregated customer points list for admin dashboard.
     * Not possible via entity listing (needs GROUP BY SUM).
     */
    #[Route(
        path: '/api/_action/mtsport-loyalty/customers',
        name: 'api.action.mtsport_loyalty.customers',
        methods: ['GET'],
    )]
    public function customers(Request $request, Context $context): JsonResponse
    {
        $term = trim((string) $request->query->get('term', ''));
        $limit = (int) $request->query->get('limit', 50);

        $sql = '
            SELECT
                LOWER(HEX(lt.customer_id))                          AS id,
                LOWER(HEX(lt.customer_id))                          AS customerId,
                COALESCE(SUM(lt.points), 0)                          AS points,
                MAX(lt.created_at)                                   AS lastActivity,
                c.first_name                                         AS firstName,
                c.last_name                                          AS lastName,
                c.email                                              AS email
            FROM loyalty_transaction lt
            LEFT JOIN customer c ON c.id = lt.customer_id
        ';
        $params = [];
        if ($term !== '') {
            $sql .= ' WHERE c.email LIKE :term OR c.first_name LIKE :term OR c.last_name LIKE :term ';
            $params['term'] = '%' . $term . '%';
        }
        $sql .= ' GROUP BY lt.customer_id, c.first_name, c.last_name, c.email
                  ORDER BY points DESC
                  LIMIT ' . $limit;

        $rows = $this->connection->fetchAllAssociative($sql, $params);

        // Level resolution
        $levels = $this->connection->fetchAllAssociative(
            'SELECT level, name, min_points, color FROM loyalty_level ORDER BY min_points ASC'
        );

        foreach ($rows as &$row) {
            $row['points'] = (int) $row['points'];
            $row['levelName'] = $levels[0]['name'] ?? 'Nováčik';
            $row['levelColor'] = $levels[0]['color'] ?? '#94A3B8';
            foreach ($levels as $lvl) {
                if ($row['points'] >= (int) $lvl['min_points']) {
                    $row['levelName'] = $lvl['name'];
                    $row['levelColor'] = $lvl['color'];
                }
            }
        }

        return new JsonResponse(['customers' => $rows]);
    }
}
