<?php declare(strict_types=1);

namespace Mtsport\Badge\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748400000AddManufacturerAndStreamRules extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748400000;
    }

    public function update(Connection $connection): void
    {
        $columns = $connection->fetchAllAssociative("SHOW COLUMNS FROM `mtsport_badge`");
        $existing = array_column($columns, 'Field');

        if (!in_array('apply_manufacturer_ids', $existing, true)) {
            $connection->executeStatement(
                'ALTER TABLE `mtsport_badge` ADD COLUMN `apply_manufacturer_ids` LONGTEXT NULL AFTER `apply_tag_ids`'
            );
        }

        if (!in_array('apply_product_stream_ids', $existing, true)) {
            $connection->executeStatement(
                'ALTER TABLE `mtsport_badge` ADD COLUMN `apply_product_stream_ids` LONGTEXT NULL AFTER `apply_manufacturer_ids`'
            );
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
