<?php declare(strict_types=1);

namespace Mtsport\Returns\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1748700000CreateReturnRequest extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748700000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `mtsport_return_request` (
                `id`                  BINARY(16)   NOT NULL,
                `reference_number`    VARCHAR(25)  NOT NULL,
                `form_type`           VARCHAR(20)  NOT NULL DEFAULT \'vratenie\',
                `order_number`        VARCHAR(60)  NOT NULL,
                `order_id`            VARCHAR(64)  NULL,
                `first_name`          VARCHAR(100) NULL,
                `last_name`           VARCHAR(100) NULL,
                `customer_name`       VARCHAR(200) NULL,
                `customer_email`      VARCHAR(200) NOT NULL,
                `customer_phone`      VARCHAR(60)  NULL,
                `customer_address`    TEXT         NULL,
                `order_date`          DATE         NULL,
                `invoice_number`      VARCHAR(100) NULL,
                `bank_account`        VARCHAR(100) NULL,
                `items_description`   TEXT         NULL,
                `reason_category`     VARCHAR(60)  NULL,
                `reason_detail`       TEXT         NULL,
                `attachment_paths`    LONGTEXT     NULL,
                `warranty_paths`      LONGTEXT     NULL,
                `withdrawal_date`     DATE         NULL,
                `status`              VARCHAR(30)  NOT NULL DEFAULT \'received\',
                `ip_address`          VARCHAR(45)  NULL,
                `user_agent`          VARCHAR(255) NULL,
                `confirmation_sent`   TINYINT(1)   NOT NULL DEFAULT 0,
                `admin_notes`         TEXT         NULL,
                `created_at`          DATETIME(3)  NOT NULL,
                `updated_at`          DATETIME(3)  NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uniq_reference_number` (`reference_number`),
                KEY `idx_form_type`       (`form_type`),
                KEY `idx_status`          (`status`),
                KEY `idx_order_number`    (`order_number`),
                KEY `idx_customer_email`  (`customer_email`),
                KEY `idx_created_at`      (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
