<?php declare(strict_types=1);

namespace Mtsport\Sps\ScheduledTask;

use Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask;

/**
 * Periodický tracking SPS zásielok — každé 3 hodiny od posledného behu.
 * Reálne spracuje iba behy v okne 16:00 → 01:30 (kuriér berie balíky od 16:00, v noci dorazia stavy).
 * Behy: ~16 / 19 / 22 / 01; o 01:30 okno končí.
 */
class SpsTrackingTask extends ScheduledTask
{
    public static function getTaskName(): string
    {
        return 'mtsport_sps.tracking';
    }

    public static function getDefaultInterval(): int
    {
        return 10800; // 3 h
    }
}
