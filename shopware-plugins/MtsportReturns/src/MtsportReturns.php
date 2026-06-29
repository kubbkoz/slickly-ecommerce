<?php declare(strict_types=1);

namespace Mtsport\Returns;

use Shopware\Core\Framework\Plugin;

/**
 * MT-SPORT Returns plugin — kernel class.
 *
 * Lifecycle:
 *   1. Načíta src/Resources/config/services.xml (DI registration)
 *   2. Spustí Migration (vytvorí mtsport_return_request tabuľku + email templates)
 *   3. Zaregistruje ReturnRequestDefinition cez shopware.entity.definition tag
 *   4. Exposes:
 *      - /api/mtsport-return-request (Admin API — automaticky)
 *      - POST /store-api/mtsport-return            (submit form)
 *      - POST /store-api/mtsport-return/lookup-order (order lookup)
 *
 * Workflow:
 *   - Customer submitne formulár → status = 'received'
 *   - Admin zmeni status (processing → approved | rejected)
 *   - ReturnStatusSubscriber posiela email pri každej zmene (8 templates)
 */
class MtsportReturns extends Plugin
{
}
