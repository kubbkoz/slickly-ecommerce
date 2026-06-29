<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Migration\MigrationStep;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Custom field set `mtsport_sps` priradený k entite `order` → vybrané SPS Balíkovo
 * výdajné miesto (číslo, názov, adresa) + tracking/štítok sú viditeľné priamo
 * v admin detaile objednávky (karta „Voľné polia").
 *
 * Hodnoty zapisuje SpsShipmentRoute (pri výbere) a OrderShipmentSubscriber (po vytvorení zásielky).
 * Idempotentné.
 */
class Migration1748800002CreateOrderCustomFields extends MigrationStep
{
    private const SET_NAME = 'mtsport_sps';

    /** field name => [position, [en-GB, sk-SK]] */
    private const FIELDS = [
        'mtsport_sps_point_id'      => [1, ['SPS pickup point ID', 'SPS výdajné miesto — číslo']],
        'mtsport_sps_point_name'    => [2, ['SPS pickup point name', 'SPS výdajné miesto — názov']],
        'mtsport_sps_point_address' => [3, ['SPS pickup point address', 'SPS výdajné miesto — adresa']],
        'mtsport_sps_tracking'      => [4, ['SPS tracking number', 'SPS sledovacie číslo']],
        'mtsport_sps_label_url'     => [5, ['SPS label URL', 'SPS štítok (URL)']],
    ];

    public function getCreationTimestamp(): int
    {
        return 1748800002;
    }

    public function update(Connection $connection): void
    {
        $now = (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT);

        $setId = $connection->fetchOne(
            'SELECT `id` FROM `custom_field_set` WHERE `name` = :n',
            ['n' => self::SET_NAME]
        );

        if ($setId === false) {
            $setId = Uuid::randomBytes();
            $connection->insert('custom_field_set', [
                'id'         => $setId,
                'name'       => self::SET_NAME,
                'active'     => 1,
                'config'     => json_encode([
                    'label' => ['en-GB' => 'SPS Balíkovo', 'sk-SK' => 'SPS Balíkovo'],
                    'translated' => true,
                ], JSON_THROW_ON_ERROR),
                'created_at' => $now,
            ]);

            $connection->insert('custom_field_set_relation', [
                'id'              => Uuid::randomBytes(),
                'set_id'          => $setId,
                'entity_name'     => 'order',
                'created_at'      => $now,
            ]);
        }

        foreach (self::FIELDS as $fieldName => [$position, $labels]) {
            $exists = $connection->fetchOne(
                'SELECT 1 FROM `custom_field` WHERE `name` = :n',
                ['n' => $fieldName]
            );
            if ($exists !== false) {
                continue;
            }

            [$enLabel, $skLabel] = $labels;

            $connection->insert('custom_field', [
                'id'         => Uuid::randomBytes(),
                'name'       => $fieldName,
                'type'       => 'text',
                'config'     => json_encode([
                    'label'                => ['en-GB' => $enLabel, 'sk-SK' => $skLabel],
                    'customFieldPosition'  => $position,
                    'customFieldType'      => 'text',
                    'componentName'        => 'sw-field',
                    'type'                 => 'text',
                ], JSON_THROW_ON_ERROR),
                'active'         => 1,
                'set_id'         => $setId,
                'created_at'     => $now,
            ]);
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
