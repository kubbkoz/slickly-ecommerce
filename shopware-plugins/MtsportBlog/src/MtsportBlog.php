<?php declare(strict_types=1);

namespace Mtsport\Blog;

use Shopware\Core\Framework\Plugin;

/**
 * MT-SPORT Blog plugin — kernel class.
 *
 * Žiadny custom business logic v kernel. Plugin lifecycle automaticky:
 *   1. Načíta src/Resources/config/services.xml (DI registration)
 *   2. Spustí src/Migration/*.php (vytvorí mtsport_article tabuľku)
 *   3. Zaregistruje ArticleDefinition cez shopware.entity.definition tag
 *   4. Exposes /api/mtsport-article (Admin) + /store-api/mtsport-article (Store, vďaka ApiAware flagom)
 */
class MtsportBlog extends Plugin
{
}
