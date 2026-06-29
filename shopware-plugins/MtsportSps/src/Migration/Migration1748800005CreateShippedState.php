<?php declare(strict_types=1);

namespace Mtsport\Sps\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Stav `odoslane` („Odoslané") na order.state — ScheduledTask tracking ho nastaví, keď
 * SPS T&T potvrdí prevzatie zásielky kuriérom.
 *
 * Vstupné prechody: kurier_sps / in_progress → odoslane (action `ship`).
 * Výstupné: odoslane → completed (`complete`) / cancelled (`cancel`).
 * Idempotentné.
 */
class Migration1748800005CreateShippedState extends MigrationStep
{
    private const STATE_MACHINE = 'order.state';
    private const TECHNICAL_NAME = 'odoslane';
    private const NAMES = ['sk' => 'Odoslané', 'cs' => 'Odesláno', '*' => 'Shipped'];

    public function getCreationTimestamp(): int
    {
        return 1748800005;
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

        $now = (new \DateTime())->format('Y-m-d H:i:s.v');

        $stateId = $this->stateId($connection, $stateMachineId, self::TECHNICAL_NAME);
        if ($stateId === null) {
            $stateId = Uuid::randomBytes();
            $connection->insert('state_machine_state', [
                'id'               => $stateId,
                'state_machine_id' => $stateMachineId,
                'technical_name'   => self::TECHNICAL_NAME,
                'created_at'       => $now,
            ]);
        }

        $languages = $connection->fetchAllAssociative('
            SELECT l.`id` AS id, loc.`code` AS code
            FROM `language` l INNER JOIN `locale` loc ON loc.`id` = l.`locale_id`
        ');
        foreach ($languages as $lang) {
            $exists = $connection->fetchOne(
                'SELECT 1 FROM `state_machine_state_translation` WHERE `state_machine_state_id` = :s AND `language_id` = :l',
                ['s' => $stateId, 'l' => $lang['id']]
            );
            if ($exists !== false) {
                continue;
            }
            $code = (string) $lang['code'];
            $name = str_starts_with($code, 'sk') ? self::NAMES['sk']
                : (str_starts_with($code, 'cs') ? self::NAMES['cs'] : self::NAMES['*']);
            $connection->insert('state_machine_state_translation', [
                'state_machine_state_id' => $stateId,
                'language_id'            => $lang['id'],
                'name'                   => $name,
                'created_at'             => $now,
            ]);
        }

        // Vstupné prechody → odoslane (zdieľaná akcia `ship`)
        foreach (['kurier_sps', 'in_progress'] as $fromTn) {
            $fromId = $this->stateId($connection, $stateMachineId, $fromTn);
            if ($fromId !== null) {
                $this->ensureTransition($connection, $stateMachineId, 'ship', $fromId, $stateId, $now);
            }
        }
        // Výstupné prechody z odoslane
        foreach (['completed' => 'complete', 'cancelled' => 'cancel'] as $toTn => $action) {
            $toId = $this->stateId($connection, $stateMachineId, $toTn);
            if ($toId !== null) {
                $this->ensureTransition($connection, $stateMachineId, $action, $stateId, $toId, $now);
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

    private function ensureTransition(Connection $c, string $sm, string $action, string $from, string $to, string $now): void
    {
        $exists = $c->fetchOne(
            'SELECT 1 FROM `state_machine_transition` WHERE `state_machine_id` = :sm AND `action_name` = :a AND `from_state_id` = :f AND `to_state_id` = :t',
            ['sm' => $sm, 'a' => $action, 'f' => $from, 't' => $to]
        );
        if ($exists !== false) {
            return;
        }
        $c->insert('state_machine_transition', [
            'id'               => Uuid::randomBytes(),
            'state_machine_id' => $sm,
            'action_name'      => $action,
            'from_state_id'    => $from,
            'to_state_id'      => $to,
            'created_at'       => $now,
        ]);
    }
}
