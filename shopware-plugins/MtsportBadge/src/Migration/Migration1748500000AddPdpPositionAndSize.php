<?php declare(strict_types=1);

namespace Mtsport\Badge\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748500000AddPdpPositionAndSize extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748500000;
    }

    public function update(Connection $connection): void
    {
        $columns = $connection->fetchAllAssociative('SHOW COLUMNS FROM `mtsport_badge`');
        $existing = array_column($columns, 'Field');

        if (!in_array('pdp_position', $existing, true)) {
            $connection->executeStatement(
                "ALTER TABLE `mtsport_badge` ADD COLUMN `pdp_position` VARCHAR(10) NOT NULL DEFAULT 'top' AFTER `position`"
            );
        }

        if (!in_array('size', $existing, true)) {
            $connection->executeStatement(
                "ALTER TABLE `mtsport_badge` ADD COLUMN `size` VARCHAR(10) NOT NULL DEFAULT 'md' AFTER `pdp_position`"
            );
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
