<?php declare(strict_types=1);

namespace Mtsport\Blog\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Pridáva nové polia do mtsport_article:
 *  - featured           TINYINT(1)   DEFAULT 0
 *  - featured_badge_text VARCHAR(100) NULL
 *  - type               VARCHAR(50)  DEFAULT 'blog'
 *  - hero_cover_id      BINARY(16)   NULL  (FK → media)
 *
 * Každý krok kontroluje existence cez information_schema — bezpečné
 * aj pri opakovanom spustení (MariaDB/MySQL kompatibilné).
 */
class Migration1763700000AddNewFields extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1763700000;
    }

    public function update(Connection $connection): void
    {
        // 1. Pridaj stĺpce ak neexistujú
        $columnsToAdd = [
            'featured'            => "TINYINT(1) NOT NULL DEFAULT 0",
            'featured_badge_text' => "VARCHAR(100) NULL",
            'type'                => "VARCHAR(50) NOT NULL DEFAULT 'blog'",
            'hero_cover_id'       => "BINARY(16) NULL",
        ];

        foreach ($columnsToAdd as $column => $definition) {
            $exists = $connection->fetchOne(
                'SELECT COUNT(*) FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE()
                   AND TABLE_NAME   = :table
                   AND COLUMN_NAME  = :column',
                ['table' => 'mtsport_article', 'column' => $column]
            );

            if (!(int) $exists) {
                $connection->executeStatement(
                    "ALTER TABLE `mtsport_article` ADD COLUMN `{$column}` {$definition}"
                );
            }
        }

        // 2. Pridaj index pre hero_cover_id ak neexistuje
        $indexName  = 'fk.mtsport_article.hero_cover_id';
        $indexExists = $connection->fetchOne(
            'SELECT COUNT(*) FROM information_schema.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME  = :table
               AND INDEX_NAME  = :idx',
            ['table' => 'mtsport_article', 'idx' => $indexName]
        );

        if (!(int) $indexExists) {
            $connection->executeStatement(
                "ALTER TABLE `mtsport_article`
                 ADD KEY `{$indexName}` (`hero_cover_id`)"
            );
        }

        // 3. Pridaj FK ak neexistuje
        $fkExists = $connection->fetchOne(
            'SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
             WHERE CONSTRAINT_SCHEMA = DATABASE()
               AND TABLE_NAME        = :table
               AND CONSTRAINT_NAME   = :fk
               AND CONSTRAINT_TYPE   = \'FOREIGN KEY\'',
            ['table' => 'mtsport_article', 'fk' => $indexName]
        );

        if (!(int) $fkExists) {
            $connection->executeStatement(
                "ALTER TABLE `mtsport_article`
                 ADD CONSTRAINT `{$indexName}`
                     FOREIGN KEY (`hero_cover_id`) REFERENCES `media` (`id`)
                     ON DELETE SET NULL ON UPDATE CASCADE"
            );
        }
    }

    public function updateDestructive(Connection $connection): void {}
}
