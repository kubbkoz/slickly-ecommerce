<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Service;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Uuid\Uuid;

class LoyaltyPointsService
{
    public function __construct(
        private readonly Connection $connection,
        private readonly EntityRepository $transactionRepository,
        private readonly EntityRepository $levelRepository,
    ) {
    }

    public function getCustomerPoints(string $customerId): int
    {
        $sum = $this->connection->fetchOne(
            'SELECT COALESCE(SUM(points), 0) FROM loyalty_transaction WHERE customer_id = :cid',
            ['cid' => Uuid::fromHexToBytes($customerId)]
        );
        return (int) $sum;
    }

    /** @return array{earned:int, spent:int} */
    public function getEarnedSpent(string $customerId): array
    {
        $row = $this->connection->fetchAssociative(
            'SELECT
                COALESCE(SUM(CASE WHEN points > 0 THEN points ELSE 0 END), 0) AS earned,
                COALESCE(SUM(CASE WHEN points < 0 THEN -points ELSE 0 END), 0) AS spent
             FROM loyalty_transaction WHERE customer_id = :cid',
            ['cid' => Uuid::fromHexToBytes($customerId)]
        );
        return ['earned' => (int) ($row['earned'] ?? 0), 'spent' => (int) ($row['spent'] ?? 0)];
    }

    public function addPoints(
        string $customerId,
        int $points,
        string $type,
        ?string $referenceId,
        ?string $description,
        Context $context
    ): void {
        $this->transactionRepository->create([[
            'id'          => Uuid::randomHex(),
            'customerId'  => $customerId,
            'points'      => $points,
            'type'        => $type,
            'referenceId' => $referenceId,
            'description' => $description,
        ]], $context);
    }

    /** @return array<array{level:int,name:string,minPoints:int,color:string,colorType:string}> */
    public function getLevels(Context $context): array
    {
        $criteria = new Criteria();
        $criteria->addSorting(new FieldSorting('minPoints', FieldSorting::ASCENDING));
        $levels = $this->levelRepository->search($criteria, $context)->getElements();

        $out = [];
        foreach ($levels as $l) {
            $out[] = [
                'level'     => $l->get('level'),
                'name'      => $l->get('name'),
                'minPoints' => $l->get('minPoints'),
                'color'     => $l->get('color'),
                'colorType' => $l->get('colorType'),
            ];
        }
        return $out;
    }

    public function getCustomerSummary(string $customerId, Context $context): array
    {
        $points = $this->getCustomerPoints($customerId);
        $earnedSpent = $this->getEarnedSpent($customerId);
        $levels = $this->getLevels($context);

        $current = $levels[0] ?? ['level' => 1, 'name' => 'Nováčik', 'minPoints' => 0, 'color' => '#94A3B8', 'colorType' => 'solid'];
        $next = null;
        foreach ($levels as $i => $lvl) {
            if ($points >= $lvl['minPoints']) {
                $current = $lvl;
                $next = $levels[$i + 1] ?? null;
            }
        }

        $pointsToNext = $next ? max(0, $next['minPoints'] - $points) : null;
        $progress = 100.0;
        if ($next) {
            $range = $next['minPoints'] - $current['minPoints'];
            $progress = $range > 0 ? round((($points - $current['minPoints']) / $range) * 100, 1) : 0.0;
        }

        return [
            'availablePoints'    => $points,
            'totalEarned'        => $earnedSpent['earned'],
            'totalSpent'         => $earnedSpent['spent'],
            'level'              => $current['level'],
            'levelName'          => $current['name'],
            'levelColor'         => $current['color'],
            'colorType'          => $current['colorType'],
            'nextLevel'          => $next['level'] ?? null,
            'nextLevelName'      => $next['name'] ?? null,
            'nextLevelMinPoints' => $next['minPoints'] ?? null,
            'pointsToNextLevel'  => $pointsToNext,
            'progressPercent'    => $progress,
            'levels'             => $levels,
        ];
    }
}
