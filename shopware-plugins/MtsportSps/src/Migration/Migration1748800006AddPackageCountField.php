<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Pridá custom field `mtsport_sps_package_count` (int) do setu `mtsport_sps` na entite order —
 * manuálny override počtu balíkov pre danú objednávku (Kuriér SPS). Prázdne = auto (počet bicyklov).
 */
class Migration1748800006AddPackageCountField extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748800006;
    }

    public function update(Connection $connection): void
    {
        $setId = $connection->fetchOne(
            'SELECT `id` FROM `custom_field_set` WHERE `name` = :n',
            ['n' => 'mtsport_sps']
        );
        if ($setId === false) {
            return;
        }

        $exists = $connection->fetchOne(
            'SELECT 1 FROM `custom_field` WHERE `name` = :n',
            ['n' => 'mtsport_sps_package_count']
        );
        if ($exists !== false) {
            return;
        }

        $connection->insert('custom_field', [
            'id'         => Uuid::randomBytes(),
            'name'       => 'mtsport_sps_package_count',
            'type'       => 'int',
            'config'     => json_encode([
                'label'               => ['en-GB' => 'SPS package count (manual)', 'sk-SK' => 'SPS počet balíkov (manuálne)'],
                'helpText'            => ['sk-SK' => 'Prázdne = automaticky (1 balík / bicykel). Platí pre kuriér SPS.'],
                'customFieldPosition' => 6,
                'customFieldType'     => 'number',
                'componentName'       => 'sw-field',
                'type'                => 'number',
                'numberType'          => 'int',
                'min'                 => 1,
            ], JSON_THROW_ON_ERROR),
            'active'     => 1,
            'set_id'     => $setId,
            'created_at' => (new \DateTime())->format('Y-m-d H:i:s.v'),
        ]);
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
