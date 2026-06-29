<?php
/**
 * SPS Order Tracking Cron Script
 *
 * Tento skript prejde všetky objednávky so stavom "vytlacene" (alebo "wc-vytlacene")
 * a ak na externom linku nájde reťazec "Odnáška", prepne stav objednávky na "completed".
 * Po aktualizácii odošle notifikačný e-mail.
 *
 * Spúšťaj tento skript z CRON jobu cez PHP CLI.
 */

// Nahraďte nasledujúcu cestu cestou ku koreňovému adresáru vašej WordPress inštalácie.
require_once '/data/f/8/f84b874e-bdca-4794-b635-56ab8774b05e/mt-sport.sk/web/wp-load.php';

/**
 * Konštanty pre stavy objednávok a e-mailové adresy.
 */
define( 'SPS_STATUS_VYTLACENE', 'vytlacene' );
define( 'SPS_STATUS_COMPLETED', 'completed' );
define( 'SPS_NOTIFICATION_EMAIL', 'info@mt-sport.sk' );

/**
 * Pomocná funkcia, ktorá načíta objednávky so zadaným stavom.
 *
 * @param string $status Požadovaný stav objednávky.
 * @param int    $limit Maximálny počet objednávok (nastav -1 pre všetky).
 * @param string $return Formát návratovej hodnoty - 'ids' alebo 'objects'.
 * @return array
 */
function sps_get_orders_by_status( $status, $limit = -1, $return = 'ids' ) {
    $args = array(
        'status' => $status,
        'limit'  => $limit,
        'return' => $return,
    );
    return wc_get_orders( $args );
}

/**
 * Aktualizuje jednu objednávku.
 *
 * Vykoná HTTP požiadavku na externú URL založenú na čísle objednávky. Ak sa v načítanom obsahu
 * nájde ktorýkoľvek z reťazcov "Odnáška", "Pickedup", "Vstup", "Loaded", "SPLIT",
 * prepne stav objednávky zo stavu "vytlačené" na "completed".
 *
 * @param WC_Order $order Objednávka.
 * @return bool True, ak bola objednávka aktualizovaná, inak false.
 */
function sps_update_single_order( $order ) {
    $order_number = $order->get_order_number();
    $url = "https://t-t.sps-sro.sk/result.php?cmd=VERKNR_SEARCH&sprache=SK&km_mandnr=1&kundenr=32599&verknr=" . urlencode( $order_number );

    $response = wp_remote_get( $url, array( 'timeout' => 30 ) );
    if ( is_wp_error( $response ) ) {
        error_log( "SPS Cron Error: HTTP request failed for order {$order_number}" );
        return false;
    }

    $body = wp_remote_retrieve_body( $response );

// Rozšírený regex: hľadáme Odnáška, Pickedup, Vstup, Loaded, SPLIT, Prvá registrácia
if ( preg_match( '/(Odnáška|Pickedup|Vstup|Loaded|SPLIT|Prvá registrácia)/i', $body ) ) {
    // Normalizujeme stav – odstránime prípadnú predponu "wc-"
    $current_status = str_replace( 'wc-', '', $order->get_status() );
    if ( SPS_STATUS_VYTLACENE === $current_status ) {
        $order->update_status(
            SPS_STATUS_COMPLETED,
            __( 'Aktualizácia na základe sledovacích dát – našiel sa jeden z definovaných kľúčových výrazov.', 'sps-order-tracking-cron' )
        );
        error_log( "SPS Cron: Order {$order_number} updated to completed." );
        return true;
    }
}
    return false;
}

/**
 * Odosiela e-mail s informáciami o aktualizovaných objednávkach.
 *
 * @param array $updated_orders Pole čísel objednávok.
 */
function sps_send_notification( $updated_orders ) {
    if ( empty( $updated_orders ) ) {
        return;
    }
    // Notifikačná e-mailová adresa nastavena na "jakub@mt-sport.sk"
    $to      = 'info@mt-sport.sk';
    $subject = 'SPS Order Tracking - Aktualizované objednávky';
    $message = "Nasledujúce objednávky boli aktualizované na stav \"completed\":\n\n" . implode( "\n", $updated_orders );
    $headers = array( 'Content-Type: text/plain; charset=UTF-8' );

    wp_mail( $to, $subject, $message, $headers );
    error_log( "SPS Cron: Notification mail sent for orders: " . implode( ", ", $updated_orders ) );
}

/**
 * Cron funkcia – spracuje všetky objednávky so stavom "vytlacene" naraz,
 * bez dávkovania (bez obmedzenia počtu objednávok).
 *
 * Táto funkcia sa spúšťa len v pracovné dni (pondelok - piatok).
 */
function sps_update_order_status_batch() {
    // Spracovávame iba pracovné dni (1 = pondelok, ... 5 = piatok)
    if ( date( 'N' ) > 5 ) {
        error_log( 'SPS Cron: Dnes nie je pracovný deň, cron úloha sa nevykonala.' );
        wp_mail(
            'info@mt-sport.sk',
            'SPS CRON sa dnes nespustil',
            'Dnes je víkend (' . date( 'l' ) . '), takže CRON sa neaktivoval.',
            array( 'Content-Type: text/plain; charset=UTF-8' )
        );
        return;
    }

    $orders_ids = sps_get_orders_by_status( SPS_STATUS_VYTLACENE, -1, 'ids' );
    $updated_orders = array();

    $timestamp = current_time( 'mysql' );
    error_log( "SPS Cron: Spustený CRON o {$timestamp}, nájdených objednávok: " . count( $orders_ids ) );
    wp_mail(
        'info@mt-sport.sk',
        'SPS CRON bol spustený o ' . $timestamp,
        "Počet objednávok so stavom vytlacene: " . count( $orders_ids ),
        array( 'Content-Type: text/plain; charset=UTF-8' )
    );

    if ( ! empty( $orders_ids ) ) {
        foreach ( $orders_ids as $order_id ) {
            $order = wc_get_order( $order_id );
            if ( sps_update_single_order( $order ) ) {
                $updated_orders[] = $order->get_order_number();
            }
        }
    }

    if ( ! empty( $updated_orders ) ) {
        sps_send_notification( $updated_orders );
    }

    // Pri tejto verzii neplánujeme ďalšiu dávku, lebo chceme spracovať všetky objednávky naraz.
}

// Spusti dávkové spracovanie
sps_update_order_status_batch();
