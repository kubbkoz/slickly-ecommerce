<?php declare(strict_types=1);

namespace Mtsport\Badge\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Pivot table mtsport_badge_product — ManyToMany medzi mtsport_badge a product.
 *
 * Umožňuje:
 *   - Priradiť konkrétne badges produktu v admin editácii produktu (sw-product-detail extension)
 *   - V badge detail vidieť zoznam priradených produktov
 *   - Cascade delete (vymaže pivot pri delete badge ALEBO product)
 */
class Migration1748900000CreateBadgeProductMapping extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748900000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `mtsport_badge_product` (
                `badge_id`            BINARY(16) NOT NULL,
                `product_id`          BINARY(16) NOT NULL,
                `product_version_id`  BINARY(16) NOT NULL,
                `created_at`          DATETIME(3) NOT NULL,
                PRIMARY KEY (`badge_id`, `product_id`, `product_version_id`),
                CONSTRAINT `fk_mtsport_badge_product_badge`
                    FOREIGN KEY (`badge_id`)
                    REFERENCES `mtsport_badge` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT `fk_mtsport_badge_product_product`
                    FOREIGN KEY (`product_id`, `product_version_id`)
                    REFERENCES `product` (`id`, `version_id`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
