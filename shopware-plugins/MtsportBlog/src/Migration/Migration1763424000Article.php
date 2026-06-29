<?php declare(strict_types=1);

namespace Mtsport\Blog\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Vytvorí `mtsport_article` tabuľku.
 *
 * Timestamp 1763424000 = 2025-11-17 (musí byť v minulosti vzhľadom na install date).
 * Spustí sa pri `plugin:install --activate MtsportBlog`.
 */
class Migration1763424000Article extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1763424000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `mtsport_article` (
                `id`               BINARY(16)    NOT NULL,
                `title`            VARCHAR(255)  NOT NULL,
                `slug`             VARCHAR(255)  NOT NULL,
                `teaser`           LONGTEXT      NULL,
                `content`          LONGTEXT      NULL,
                `published_at`     DATETIME(3)   NULL,
                `author`           VARCHAR(255)  NULL,
                `category`         VARCHAR(255)  NULL,
                `meta_title`       VARCHAR(255)  NULL,
                `meta_description` LONGTEXT      NULL,
                `active`           TINYINT(1)    NOT NULL DEFAULT 1,
                `cover_id`         BINARY(16)    NULL,
                `created_at`       DATETIME(3)   NOT NULL,
                `updated_at`       DATETIME(3)   NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uniq.mtsport_article.slug` (`slug`),
                KEY `fk.mtsport_article.cover_id` (`cover_id`),
                CONSTRAINT `fk.mtsport_article.cover_id`
                    FOREIGN KEY (`cover_id`) REFERENCES `media` (`id`)
                    ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // Spustí sa pri `plugin:uninstall` BEZ --keep-user-data
        $connection->executeStatement('DROP TABLE IF EXISTS `mtsport_article`;');
    }
}
