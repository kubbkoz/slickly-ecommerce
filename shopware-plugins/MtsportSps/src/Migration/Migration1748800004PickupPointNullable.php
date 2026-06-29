<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Courier objednávky (štandardný SPS kuriér bez Balíkomatu) nemajú výdajné miesto →
 * `pickup_point_id` musí byť nullable, inak upsert courier riadku zlyhá na NOT NULL.
 */
class Migration1748800004PickupPointNullable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748800004;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement(
            'ALTER TABLE `mtsport_sps_shipment` MODIFY `pickup_point_id` VARCHAR(50) NULL'
        );
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
