<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748800000CreateSpsShipment extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748800000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `mtsport_sps_shipment` (
                `id`                BINARY(16)   NOT NULL,
                `order_id`          BINARY(16)   NOT NULL,
                `order_version_id`  BINARY(16)   NOT NULL,
                `pickup_point_id`   VARCHAR(50)  NOT NULL,
                `pickup_point_name` VARCHAR(255) NULL,
                `address`           VARCHAR(255) NULL,
                `zip`               VARCHAR(20)  NULL,
                `city`              VARCHAR(100) NULL,
                `country_iso`       VARCHAR(2)   NULL,
                `cod`               TINYINT(1)   NOT NULL DEFAULT 0,
                `type`              VARCHAR(10)  NULL,
                `webship_status`    VARCHAR(20)  NOT NULL DEFAULT \'pending\',
                `label_url`         VARCHAR(500) NULL,
                `tracking_number`   VARCHAR(100) NULL,
                `webship_error`     LONGTEXT     NULL,
                `created_at`        DATETIME(3)  NOT NULL,
                `updated_at`        DATETIME(3)  NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uniq_order_id` (`order_id`),
                KEY `idx_webship_status` (`webship_status`),
                KEY `fk_mtsport_sps_shipment_order` (`order_id`, `order_version_id`),
                CONSTRAINT `fk_mtsport_sps_shipment_order` FOREIGN KEY (`order_id`, `order_version_id`)
                    REFERENCES `order` (`id`, `version_id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
