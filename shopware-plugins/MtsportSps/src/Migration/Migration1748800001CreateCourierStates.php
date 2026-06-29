<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Migration\MigrationStep;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Vytvorí dva custom stavy na `order.state` state machine:
 *   - kurier_sps       → prechod doň spustí WebShip SPS Balíkovo zásielku (OrderShipmentSubscriber)
 *   - kurier_toptrans  → placeholder pre Toptrans (reálne odosielanie zatiaľ neimplementované)
 *
 * Pre KAŽDÝ jazyk v systéme vloží preklad (pokrýva systémový default → žiadna missing-translation chyba).
 * Vstupné prechody: open / in_progress → nový stav (zdieľaná action_name = `go_<state>`).
 * Výstupné prechody: nový stav → in_progress / completed / cancelled (štandardné akcie process/complete/cancel),
 * aby stav nebol slepá ulička.
 *
 * Idempotentné — opakované spustenie nič nezduplikuje.
 */
class Migration1748800001CreateCourierStates extends MigrationStep
{
    private const STATE_MACHINE = 'order.state';

    /** technical_name => [en-GB, sk-SK, cs-CZ] */
    private const STATES = [
        'kurier_sps'      => ['Ship via SPS Balíkovo', 'Odoslať cez SPS Balíkovo', 'Odeslat přes SPS Balíkovo'],
        'kurier_toptrans' => ['Ship via Toptrans', 'Odoslať cez Toptrans', 'Odeslat přes Toptrans'],
    ];

    /** technical_name vstupných stavov, z ktorých sa dá prejsť do nového stavu */
    private const FROM_STATES = ['open', 'in_progress'];

    /** technical_name => action_name pre výstupné prechody (aby stav nebol dead-end) */
    private const TO_STATES = [
        'in_progress' => 'process',
        'completed'   => 'complete',
        'cancelled'   => 'cancel',
    ];

    public function getCreationTimestamp(): int
    {
        return 1748800001;
    }

    public function update(Connection $connection): void
    {
        $stateMachineId = $connection->fetchOne(
            'SELECT `id` FROM `state_machine` WHERE `technical_name` = :tn',
            ['tn' => self::STATE_MACHINE]
        );
        if ($stateMachineId === false) {
            return;
        }

        $now = (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT);

        $languages = $connection->fetchAllAssociative('
            SELECT l.`id` AS id, loc.`code` AS code
            FROM `language` l
            INNER JOIN `locale` loc ON loc.`id` = l.`locale_id`
        ');

        foreach (self::STATES as $technicalName => $names) {
            [$enName, $skName, $czName] = $names;

            $stateId = $connection->fetchOne(
                'SELECT `id` FROM `state_machine_state` WHERE `state_machine_id` = :sm AND `technical_name` = :tn',
                ['sm' => $stateMachineId, 'tn' => $technicalName]
            );

            if ($stateId === false) {
                $stateId = Uuid::randomBytes();
                $connection->insert('state_machine_state', [
                    'id'               => $stateId,
                    'state_machine_id' => $stateMachineId,
                    'technical_name'   => $technicalName,
                    'created_at'       => $now,
                ]);
            }

            foreach ($languages as $lang) {
                $exists = $connection->fetchOne(
                    'SELECT 1 FROM `state_machine_state_translation` WHERE `state_machine_state_id` = :s AND `language_id` = :l',
                    ['s' => $stateId, 'l' => $lang['id']]
                );
                if ($exists !== false) {
                    continue;
                }

                $code = (string) $lang['code'];
                $name = str_starts_with($code, 'sk') ? $skName
                    : (str_starts_with($code, 'cs') ? $czName : $enName);

                $connection->insert('state_machine_state_translation', [
                    'state_machine_state_id' => $stateId,
                    'language_id'            => $lang['id'],
                    'name'                   => $name,
                    'created_at'             => $now,
                ]);
            }

            // Vstupné prechody: open / in_progress → nový stav (zdieľaná akcia)
            foreach (self::FROM_STATES as $fromTn) {
                $fromId = $this->stateId($connection, $stateMachineId, $fromTn);
                if ($fromId !== null) {
                    $this->ensureTransition($connection, $stateMachineId, 'go_' . $technicalName, $fromId, $stateId, $now);
                }
            }

            // Výstupné prechody: nový stav → in_progress / completed / cancelled
            foreach (self::TO_STATES as $toTn => $action) {
                $toId = $this->stateId($connection, $stateMachineId, $toTn);
                if ($toId !== null) {
                    $this->ensureTransition($connection, $stateMachineId, $action, $stateId, $toId, $now);
                }
            }
        }
    }

    public function updateDestructive(Connection $connection): void
    {
    }

    private function stateId(Connection $connection, string $stateMachineId, string $technicalName): ?string
    {
        $id = $connection->fetchOne(
            'SELECT `id` FROM `state_machine_state` WHERE `state_machine_id` = :sm AND `technical_name` = :tn',
            ['sm' => $stateMachineId, 'tn' => $technicalName]
        );

        return $id === false ? null : $id;
    }

    private function ensureTransition(
        Connection $connection,
        string $stateMachineId,
        string $actionName,
        string $fromStateId,
        string $toStateId,
        string $now
    ): void {
        $exists = $connection->fetchOne(
            'SELECT 1 FROM `state_machine_transition`
             WHERE `state_machine_id` = :sm AND `action_name` = :a AND `from_state_id` = :f AND `to_state_id` = :t',
            ['sm' => $stateMachineId, 'a' => $actionName, 'f' => $fromStateId, 't' => $toStateId]
        );
        if ($exists !== false) {
            return;
        }

        $connection->insert('state_machine_transition', [
            'id'               => Uuid::randomBytes(),
            'state_machine_id' => $stateMachineId,
            'action_name'      => $actionName,
            'from_state_id'    => $fromStateId,
            'to_state_id'      => $toStateId,
            'created_at'       => $now,
        ]);
    }
}
