<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Premenuje stav `kurier_sps` na „Odoslať cez SPS" (predtým „Odoslať cez SPS Balíkovo").
 * Plugin rozhodne Balíkovo vs štandardný kuriér automaticky — preto univerzálny názov.
 *
 * Idempotentné — UPDATE prekladov pre všetky jazyky podľa locale.
 */
class Migration1748800003RenameSpsState extends MigrationStep
{
    /** locale prefix => name */
    private const NAMES = [
        'sk' => 'Odoslať cez SPS',
        'cs' => 'Odeslat přes SPS',
        '*'  => 'Ship via SPS',
    ];

    public function getCreationTimestamp(): int
    {
        return 1748800003;
    }

    public function update(Connection $connection): void
    {
        $stateId = $connection->fetchOne(
            "SELECT s.`id`
             FROM `state_machine_state` s
             INNER JOIN `state_machine` m ON m.`id` = s.`state_machine_id`
             WHERE m.`technical_name` = 'order.state' AND s.`technical_name` = 'kurier_sps'"
        );
        if ($stateId === false) {
            return;
        }

        $languages = $connection->fetchAllAssociative('
            SELECT l.`id` AS id, loc.`code` AS code
            FROM `language` l
            INNER JOIN `locale` loc ON loc.`id` = l.`locale_id`
        ');

        foreach ($languages as $lang) {
            $code = (string) $lang['code'];
            $name = str_starts_with($code, 'sk') ? self::NAMES['sk']
                : (str_starts_with($code, 'cs') ? self::NAMES['cs'] : self::NAMES['*']);

            $connection->executeStatement(
                'UPDATE `state_machine_state_translation`
                 SET `name` = :name, `updated_at` = NOW()
                 WHERE `state_machine_state_id` = :sid AND `language_id` = :lid',
                ['name' => $name, 'sid' => $stateId, 'lid' => $lang['id']]
            );
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
