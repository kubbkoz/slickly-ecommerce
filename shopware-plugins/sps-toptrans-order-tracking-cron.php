<?php
/**
 * SPS & TOPTRANS Order Tracking Cron Script
 *
 * Logika rozdeľovania:
 * 1. Skontroluje meta pole '_toptrans_tracking_number'.
 * 2. Ak je vyplnené -> Použije logiku TOPTRANS (hľadá na zp.toptrans.cz).
 * 3. Ak je prázdne -> Použije logiku SPS (hľadá na t-t.sps-sro.sk).
 *
 * Ak sa nájdu definované kľúčové slová, prepne stav na 'completed'.
 */

require_once '/data/f/8/f84b874e-bdca-4794-b635-56ab8774b05e/mt-sport.sk/web/wp-load.php';

// Konfigurácia
define( 'NOTIFICATION_EMAIL', 'info@mt-sport.sk' );
define( 'STATUS_COMPLETED', 'completed' );

/**
 * Získa ID objednávok podľa stavov
 */
function tracker_get_orders( $statuses ) {
    return wc_get_orders( array(
        'status' => $statuses,
        'limit'  => -1,
        'return' => 'ids',
    ) );
}

/**
 * --- LOGIKA TOPTRANS ---
 * Hľadá na zp.toptrans.cz podľa čísla z meta poľa.
 */
function check_toptrans_logic( $tracking_number ) {
    $url = "https://zp.toptrans.cz/cs/search/results?searchParams%5Bobj%5D=" . urlencode( $tracking_number );

    $args = array(
        'timeout'    => 30,
        'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    );

    $response = wp_remote_get( $url, $args );

    if ( is_wp_error( $response ) ) {
        error_log( "Toptrans HTTP Error: " . $tracking_number );
        return false;
    }

    $body = wp_remote_retrieve_body( $response );

    // Hľadané výrazy
    if ( preg_match( '/(Na svozovém depu|Mezi depy|Na rozvozovém depu|Na rozvozu)/iu', $body ) ) {
        return true;
    }

    return false;
}

/**
 * --- LOGIKA SPS ---
 * Hľadá na t-t.sps-sro.sk podľa čísla objednávky (aj s suffixom -1).
 */
function perform_sps_request( $number ) {
    $url = "https://t-t.sps-sro.sk/result.php?cmd=VERKNR_SEARCH&sprache=SK&km_mandnr=1&kundenr=32599&verknr=" . urlencode( $number );
    
    $response = wp_remote_get( $url, array( 'timeout' => 30 ) );
    if ( is_wp_error( $response ) ) return false;
    
    $body = wp_remote_retrieve_body( $response );
    
    if ( preg_match( '/(Odnáška|Pickedup|Vstup|Loaded|SPLIT|Prvá registrácia)/i', $body ) ) {
        return true;
    }
    return false;
}

function check_sps_logic( $order_number ) {
    // 1. Základné číslo
    if ( perform_sps_request( $order_number ) ) return true;
    // 2. Suffix -1
    if ( perform_sps_request( $order_number . '-1' ) ) return true;
    
    return false;
}

/**
 * --- HLAVNÉ SPRACOVANIE JEDNEJ OBJEDNÁVKY ---
 * Vracia string "X - DOPRAVCA" ak bola aktualizovaná, inak false.
 */
function process_single_order( $order ) {
    $order_number = $order->get_order_number();
    
    // Zistíme tracking číslo pre Toptrans
    $tt_tracking_number = $order->get_meta( '_toptrans_tracking_number' );

    $should_update = false;
    $carrier_label = '';

    // === ROZCESTNÍK ===
    
    if ( ! empty( $tt_tracking_number ) ) {
        // MÁME tracking číslo -> TOPTRANS LOGIKA
        $carrier_label = 'TOPTRANS';
        if ( check_toptrans_logic( $tt_tracking_number ) ) {
            $should_update = true;
        }
    } else {
        // NEMÁME tracking číslo -> SPS LOGIKA (fallback)
        $carrier_label = 'SPS';
        if ( check_sps_logic( $order_number ) ) {
            $should_update = true;
        }
    }

    // === UPDATE STAVU ===
    
    if ( $should_update ) {
        $current_status = str_replace( 'wc-', '', $order->get_status() );
        
        // Aktualizujeme iba ak ešte nie je completed
        if ( STATUS_COMPLETED !== $current_status ) {
            $order->update_status(
                STATUS_COMPLETED,
                "CRON Auto-update ($carrier_label): Nájdený pohyb zásielky."
            );
            error_log( "CRON: Objednávka $order_number prepnutá na completed ($carrier_label)." );
            
            // Vrátime formát pre email
            return $order_number . ' - ' . $carrier_label;
        }
    }

    return false;
}

/**
 * --- NOTIFIKÁCIA ---
 */
function send_cron_notification( $updated_list ) {
    if ( empty( $updated_list ) ) return;
    
    $subject = 'Order Tracking CRON - Report';
    $message = "Nasledujúce objednávky boli prepnuté na 'completed':\n\n" . implode( "\n", $updated_list );
    $headers = array( 'Content-Type: text/plain; charset=UTF-8' );

    wp_mail( NOTIFICATION_EMAIL, $subject, $message, $headers );
}

/**
 * --- SPUSTENIE CRONU ---
 */
function run_tracking_cron() {
    // Víkendová pauza
    if ( date( 'N' ) > 5 ) return;

    // 1. Získame IDčka osobitne pre každý stav, aby sme mali presné počty
    $ids_vytlacene = tracker_get_orders( array('vytlacene') );
    $ids_toptrans  = tracker_get_orders( array('toptransv') );

    $count_vytlacene = count( $ids_vytlacene );
    $count_toptrans  = count( $ids_toptrans );
    
    // Spojíme ich do jedného poľa pre spracovanie
    $all_order_ids = array_merge( $ids_vytlacene, $ids_toptrans );

    $timestamp = current_time( 'mysql' );
    error_log( "CRON Start ($timestamp). Vytlacene: $count_vytlacene, Toptrans: $count_toptrans" );
    
    // 2. Informatívny email s rozpisom
    $start_message = "CRON bol spustený.\n\n";
    $start_message .= "Čas: $timestamp\n";
    $start_message .= "Počet 'vytlacene': $count_vytlacene\n";
    $start_message .= "Počet 'toptransv': $count_toptrans\n";

    wp_mail( NOTIFICATION_EMAIL, 'CRON Spustený', $start_message );

    // 3. Spracovanie objednávok
    $updated_list = array();
    if ( ! empty( $all_order_ids ) ) {
        // Odstránime duplicity pre istotu (ak by sa stavy prekrývali, čo by nemali)
        $all_order_ids = array_unique( $all_order_ids );

        foreach ( $all_order_ids as $id ) {
            $order = wc_get_order( $id );
            if ( $order ) {
                $result = process_single_order( $order );
                if ( $result ) {
                    $updated_list[] = $result; 
                }
            }
        }
    }

    send_cron_notification( $updated_list );
}

// Spustiť
run_tracking_cron();