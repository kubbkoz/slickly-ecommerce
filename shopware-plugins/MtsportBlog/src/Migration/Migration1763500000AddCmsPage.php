<?php declare(strict_types=1);

namespace Mtsport\Blog\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Pridá cms_page_id FK ku mtsport_article.
 * Umožňuje pripojiť natívny Shopware CMS layout k blogovému článku.
 */
class Migration1763500000AddCmsPage extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1763500000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            ALTER TABLE `mtsport_article`
            ADD COLUMN `cms_page_id` BINARY(16) NULL AFTER `cover_id`,
            ADD KEY `fk.mtsport_article.cms_page_id` (`cms_page_id`),
            ADD CONSTRAINT `fk.mtsport_article.cms_page_id`
                FOREIGN KEY (`cms_page_id`) REFERENCES `cms_page` (`id`)
                ON DELETE SET NULL ON UPDATE CASCADE;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        $connection->executeStatement('
            ALTER TABLE `mtsport_article`
            DROP FOREIGN KEY `fk.mtsport_article.cms_page_id`,
            DROP KEY `fk.mtsport_article.cms_page_id`,
            DROP COLUMN `cms_page_id`;
        ');
    }
}
