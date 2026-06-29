<?php declare(strict_types=1);

namespace Mtsport\Badge;

use Shopware\Core\Framework\Plugin;

/**
 * MT-SPORT Badge plugin — kernel class.
 *
 * Lifecycle:
 *   1. Načíta src/Resources/config/services.xml (DI registration)
 *   2. Spustí Migration (vytvorí mtsport_badge tabuľku + seed "Novinka")
 *   3. Zaregistruje BadgeDefinition cez shopware.entity.definition tag
 *   4. Exposes /api/mtsport-badge (Admin) + /store-api/mtsport-badge (Store)
 */
class MtsportBadge extends Plugin
{
}
