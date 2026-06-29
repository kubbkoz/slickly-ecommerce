<?php declare(strict_types=1);

namespace Mtsport\Sps;

use Shopware\Core\Framework\Plugin;

/**
 * MT-SPORT SPS Balikovo plugin — kernel class.
 *
 * Lifecycle (Migrations bežia pri install/update):
 *   1. Načíta src/Resources/config/services.xml (DI registration)
 *   2. Migration1748800000 → tabuľka mtsport_sps_shipment (1:1 s order)
 *   3. Migration1748800001 → custom stavy order.state: `kurier_sps` + `kurier_toptrans` (+ preklady + prechody)
 *   4. Migration1748800002 → custom field set `mtsport_sps` na entite order (pickup point + tracking viditeľné v admine)
 *   4b. Migration1748800003 → premenovanie `kurier_sps` na „Odoslať cez SPS" (plugin sám rozhodne Balíkovo vs kuriér)
 *   4c. Migration1748800004 → pickup_point_id nullable (courier objednávky bez Balíkomatu)
 *   4d. Migration1748800005 → stav order.state `odoslane` („Odoslané") + prechod `ship` (tracking)
 *   4e. Migration1748800006 → custom field mtsport_sps_package_count (manuálny override počtu balíkov)
 *
 * Admin modul (Resources/app/administration): sekcia „SPS Balíkovo" (zoznam zásielok, bulk štítky,
 * End-of-Day) + override sw-order-list (stĺpce Kuriér/Štítok/Sledovanie).
 * Admin API: POST /api/_action/mtsport-sps/generate-labels + /end-of-day (SpsAdminController).
 * Tracking: SpsTrackingTask (ScheduledTask, scrape T&T) prepína kurier_sps → odoslane.
 * Multi-balík: kuriér SPS = 1 bicykel/balík (config bikeCategoryIds), override custom field.
 *   5. Zaregistruje SpsShipmentDefinition cez shopware.entity.definition tag
 *   6. Exposes:
 *      - /api/mtsport-sps-shipment (Admin API — automaticky)
 *      - POST /store-api/mtsport-sps/pickup-point (uloženie výberu z Nuxt checkoutu)
 *
 * Workflow:
 *   - Nuxt checkout → POST /store-api/mtsport-sps/pickup-point → upsert mtsport_sps_shipment (webshipStatus = 'pending')
 *     + zrkadlí pickup point do order.customFields (mtsport_sps_point_id/name/address)
 *   - Admin prepne stav objednávky na „Odoslať cez SPS Balíkovo" (kurier_sps)
 *   - OrderShipmentSubscriber (config: triggerStateTechnicalName, default 'kurier_sps') zavolá
 *     WebshipClient::createShipment() → uloží labelUrl/trackingNumber, webshipStatus = 'created'|'error'
 *     + zapíše tracking/label do order.customFields (mtsport_sps_tracking/label_url)
 *
 * Konfigurácia (Admin → Rozšírenia → MtsportSps): WebShip credentials, adresa odosielateľa, trigger stav.
 */
class MtsportSps extends Plugin
{
}
