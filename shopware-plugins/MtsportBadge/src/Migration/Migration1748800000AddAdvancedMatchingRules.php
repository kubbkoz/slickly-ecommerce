<?php declare(strict_types=1);

namespace Mtsport\Badge\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748800000AddAdvancedMatchingRules extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748800000;
    }

    public function update(Connection $connection): void
    {
        $columns = $connection->fetchAllAssociative('SHOW COLUMNS FROM `mtsport_badge`');
        $existing = array_column($columns, 'Field');

        $additions = [
            'apply_min_price'   => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_min_price`   DECIMAL(10,2) NULL AFTER `apply_has_discount`",
            'apply_max_price'   => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_max_price`   DECIMAL(10,2) NULL AFTER `apply_min_price`",
            'apply_min_stock'   => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_min_stock`   INT           NULL AFTER `apply_max_price`",
            'apply_max_stock'   => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_max_stock`   INT           NULL AFTER `apply_min_stock`",
            'apply_min_rating'  => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_min_rating`  DECIMAL(2,1)  NULL AFTER `apply_max_stock`",
            'apply_date_from'   => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_date_from`   DATETIME(3)   NULL AFTER `apply_min_rating`",
            'apply_date_to'     => "ALTER TABLE `mtsport_badge` ADD COLUMN `apply_date_to`     DATETIME(3)   NULL AFTER `apply_date_from`",
        ];

        foreach ($additions as $col => $sql) {
            if (!in_array($col, $existing, true)) {
                $connection->executeStatement($sql);
            }
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
