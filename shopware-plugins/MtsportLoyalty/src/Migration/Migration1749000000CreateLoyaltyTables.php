<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;
use Shopware\Core\Framework\Uuid\Uuid;

class Migration1749000000CreateLoyaltyTables extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1749000000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `loyalty_transaction` (
                `id`           BINARY(16)   NOT NULL,
                `customer_id`  BINARY(16)   NOT NULL,
                `points`       INT          NOT NULL,
                `type`         VARCHAR(50)  NOT NULL,
                `reference_id` VARCHAR(255) NULL,
                `description`  VARCHAR(500) NULL,
                `created_at`   DATETIME(3)  NOT NULL,
                `updated_at`   DATETIME(3)  NULL,
                PRIMARY KEY (`id`),
                KEY `idx_lt_customer` (`customer_id`),
                KEY `idx_lt_type` (`type`),
                KEY `idx_lt_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `loyalty_level` (
                `id`         BINARY(16)   NOT NULL,
                `level`      TINYINT      NOT NULL,
                `name`       VARCHAR(100) NOT NULL,
                `min_points` INT          NOT NULL,
                `color`      VARCHAR(100) NOT NULL,
                `color_type` VARCHAR(20)  NOT NULL DEFAULT \'solid\',
                `created_at` DATETIME(3)  NOT NULL,
                `updated_at` DATETIME(3)  NULL,
                PRIMARY KEY (`id`),
                KEY `idx_ll_minpoints` (`min_points`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `loyalty_reward` (
                `id`                    BINARY(16)     NOT NULL,
                `name`                  VARCHAR(255)   NOT NULL,
                `description`           TEXT           NULL,
                `points_required`       INT            NOT NULL,
                `type`                  VARCHAR(50)    NOT NULL,
                `discount_value`        DECIMAL(10,2)  NOT NULL DEFAULT 0,
                `rule_id`               BINARY(16)     NULL,
                `gift_product_id`       BINARY(16)     NULL,
                `min_order_value`       DECIMAL(10,2)  NULL,
                `max_uses_per_customer` INT            NULL DEFAULT 1,
                `valid_days`            INT            NOT NULL DEFAULT 30,
                `is_active`             TINYINT(1)     NOT NULL DEFAULT 1,
                `created_at`            DATETIME(3)    NOT NULL,
                `updated_at`            DATETIME(3)    NULL,
                PRIMARY KEY (`id`),
                KEY `idx_lrw_active` (`is_active`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `loyalty_redemption` (
                `id`             BINARY(16)   NOT NULL,
                `customer_id`    BINARY(16)   NOT NULL,
                `reward_id`      BINARY(16)   NOT NULL,
                `reward_name`    VARCHAR(255) NULL,
                `promotion_code` VARCHAR(100) NOT NULL,
                `points_spent`   INT          NOT NULL,
                `status`         VARCHAR(20)  NOT NULL DEFAULT \'active\',
                `expires_at`     DATETIME(3)  NULL,
                `used_at`        DATETIME(3)  NULL,
                `created_at`     DATETIME(3)  NOT NULL,
                `updated_at`     DATETIME(3)  NULL,
                PRIMARY KEY (`id`),
                KEY `idx_lr_customer` (`customer_id`),
                UNIQUE KEY `uniq_lr_code` (`promotion_code`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        $this->seedLevels($connection);
    }

    private function seedLevels(Connection $connection): void
    {
        $existing = (int) $connection->fetchOne('SELECT COUNT(*) FROM `loyalty_level`');
        if ($existing > 0) {
            return;
        }

        $levels = [
            [1, 'Nováčik',      0,     '#94A3B8', 'solid'],
            [2, 'Bronze Rider', 500,   '#CD7F32', 'solid'],
            [3, 'Silver Rider', 2000,  '#9CA3AF', 'solid'],
            [4, 'Gold Rider',   5000,  '#F59E0B', 'solid'],
            [5, 'Legenda',      10000, 'foil',    'gradient'],
        ];

        $now = (new \DateTime())->format('Y-m-d H:i:s.v');
        foreach ($levels as [$level, $name, $minPoints, $color, $colorType]) {
            $connection->insert('loyalty_level', [
                'id'         => Uuid::randomBytes(),
                'level'      => $level,
                'name'       => $name,
                'min_points' => $minPoints,
                'color'      => $color,
                'color_type' => $colorType,
                'created_at' => $now,
            ]);
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
