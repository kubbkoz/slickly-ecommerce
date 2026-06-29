<?php declare(strict_types=1);

namespace Mtsport\Badge\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748300000CreateBadge extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748300000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `mtsport_badge` (
                `id`                  BINARY(16)   NOT NULL,
                `name`                VARCHAR(100) NOT NULL,
                `text`                VARCHAR(50)  NOT NULL,
                `bg_color`            VARCHAR(20)  NOT NULL DEFAULT \'#22c55e\',
                `text_color`          VARCHAR(20)  NOT NULL DEFAULT \'#ffffff\',
                `position`            VARCHAR(10)  NOT NULL DEFAULT \'both\',
                `active`              TINYINT(1)   NOT NULL DEFAULT 1,
                `sort`                INT          NOT NULL DEFAULT 0,
                `apply_product_ids`   LONGTEXT     NULL,
                `apply_category_ids`  LONGTEXT     NULL,
                `apply_tag_ids`       LONGTEXT     NULL,
                `apply_is_new_days`   INT          NULL,
                `apply_has_discount`  TINYINT(1)   NOT NULL DEFAULT 0,
                `created_at`          DATETIME(3)  NOT NULL,
                `updated_at`          DATETIME(3)  NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        // Seed: default "Novinka" badge pre produkty mladšie ako 14 dní
        $connection->executeStatement("
            INSERT IGNORE INTO `mtsport_badge`
                (`id`, `name`, `text`, `bg_color`, `text_color`, `position`, `active`, `sort`, `apply_is_new_days`, `apply_has_discount`, `created_at`)
            VALUES
                (UNHEX(REPLACE(UUID(), '-', '')), 'Novinka (auto)', 'Novinka', '#22c55e', '#ffffff', 'both', 1, 0, 14, 0, NOW(3))
        ");
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
