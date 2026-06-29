<?php

/**
 *  Admin settings page
 *
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use SPS\Webship\ZipCityChecker\ZipCityChecker;


if ( ! class_exists('WC_SlovakParcelService_Settings')) {

    class WC_SlovakParcelService_Settings extends WC_Settings_Page {

        public function __construct() {
            $this->id = 'slovakparcelservice';
            $this->label = __( 'SlovakParcelService', 'slovakparcelservice' );

            parent::__construct();

            // Add settings
    		add_action( 'woocommerce_settings_' . $this->id, array( $this, 'output' ) );

	    	// Process/save the settings
		    add_action( 'woocommerce_settings_save_' . $this->id, array( $this, 'save' ) );

            // for scheduler
            add_action( 'woocommerce_update_options_' . $this->id, array( $this, 'check_my_options' ) );

        }


        public function check_my_options() {
                    
            //start scheduler
            if (  wp_next_scheduled( 'sps_zipcity_hook' ) === FALSE ) {
                                       
                // run updater on enabled if not already enabled
                //sps_zipcity_update();
                do_action('sps_zipcity_hook');
                                        
                $first_run = 0;
                if (time() - 60 < ( strtotime("today 5am") ) ) {
                     $first_run = strtotime("today 5am");
                } else {
                    $first_run = strtotime("next day 5am");
                }
                wp_schedule_event($first_run, 'daily', 'sps_zipcity_hook' );
            }
        }
                            

        public function  get_settings_for_default_section() {
            return  $this->get_settings();
        }


        // get seeting  from DB
        public function get_settings() {

            $payment_gateways =  WC()->payment_gateways()->payment_gateways();

            $payments = array();
            foreach( $payment_gateways as $gateway_id => $gateway ){
                if ( $gateway->enabled  === 'yes' ) {
                    $payments[$gateway_id] = $gateway->get_method_title();
                }
            }
        
            $countries_pp = array('CZ' => __("CZ", 'slovakparcelservice' ),'SK' =>  __("SK", 'slovakparcelservice' ));
            
            $countries_add = ZipCityChecker::getCountriesAlphaCodes();
            $countries_address = array();
            foreach ($countries_add as $country ) {
                $countries_address[$country] = __($country, 'slovakparcelservice' );
            }
            

            $settings = array();
            $settings[] = array(
                'title' => __( 'Sloval Parcel Service', 'slovakparcelservice' ),
                'type' => 'title',
            );
            $settings[] = array(
                'title'     =>  __('Webship API Username', 'slovakparcelservice' ),
                'id'       => 'woocommerce_slovakparcelservice_apiusername',
                'type'     => 'text',
                'css'      => 'min-width:300px;'
            );
            $settings[] = array(
                'title'     =>  __('Webship API Password', 'slovakparcelservice' ),
                'id'       => 'woocommerce_slovakparcelservice_apipassword',
                'type'     => 'text',
                'css'      => 'min-width:300px;'
            );
            
            $settings[]  = array(
                'title' =>  __('Countries for addr delivery', 'slovakparcelservice' ),
                'id' =>  'woocommerce_slovakparcelservice_addr_delivery_countries',
                'type' => 'multiselect',
                'options' => $countries_address
            );
            
            $settings[]  = array(
                'title' =>  __('Countries for balikovo delivery', 'slovakparcelservice' ),
                'id' =>  'woocommerce_slovakparcelservice_pp_delivery_countries',
                'type' => 'multiselect',
                'options' => $countries_pp
            );
            
    
            $settings[] = array(
                'title' => __( 'Cod payments', 'slovakparcelservice' ),
                'id'       => 'woocommerce_slovakparcelservice_codpayments',
                'type' => 'multiselect',
                'options' =>  $payments
            );
            
            $settings[] = array(
                'title' => __('Use statuses filter for export', 'slovakparcelservice' ),
                'id'  => 'woocommerce_slovakparcelservice_statusesswitch',
                'type' => 'checkbox',
                'default' => 'no'
            );
            
            $settings[]= array (
                'title' => __('Allowed export statuses', 'slovakparcelservice' ),
                'id'  => 'woocommerce_slovakparcelservice_statuses',
                'type' => 'multiselect',
                'options' => wc_get_order_statuses()
            );
            
            $settings[] = array(
                'title' => __('Update status after data export', 'slovakparcelservice' ),
                'id'  => 'woocommerce_slovakparcelservice_statusexportswitch',
                'type' => 'checkbox',
                'default' => 'no'
            );
            
            $settings[]= array (
                'title' => __('Status after data export', 'slovakparcelservice' ),
                'id'  => 'woocommerce_slovakparcelservice_statusexport',
                'type' => 'select',
                'options' => wc_get_order_statuses()
            );
    
            $settings[] = array(
               'title' => __( 'Cod sending', 'slovakparcelservice' ),
               'id'       => 'woocommerce_slovakparcelservice_codsending',
                'desc' => __('I\'m sending COD to all supported non Eurozone countries (except Czechia) in EUR','slovakparcelservice'),
                'type' => 'checkbox',
                'default' => 'no'
            );
            
            $settings[] = array(
                'title' => __( 'Cod sending to Czechia', 'slovakparcelservice' ),
                'id'       => 'woocommerce_slovakparcelservice_codsending_cz',
                'desc' => __('I\'m sending COD to Czechia in EUR','slovakparcelservice'),
                'type' => 'checkbox',
                'default' => 'no'
            );
            
            $settings[] = array (
                'title' => __('In case of free shipping display text ','slovakparcelservice') . '"' .  __('Free', 'slovakparcelservice') .'"' ,
                'id'       => 'woocommerce_slovakparcelservice_free_text',
                'type' => 'checkbox',
                'default' => 'no'
            );
            
            /*
            $settings[] = array (
                'title' => __('Default Printing Settings', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_printingsettings',
                'type'  => 'select',
                'options'  => array(
                    'webship' => __("Webship settings", 'slovakparcelservice' ),
                    'custom'  => __( "Custom settings", 'slovakparcelservice' )
                 )
            );
            
            $settings[] = array (
                'title' => __('Default Printing Format', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_printingformat',
                'type'  => 'select',
                'options'  => array(
                    'pdf' => 'PDF',
                    'zpl'  => 'ZPL'
                )
            );
            
            $settings[] = array (
                'title' => __('Default Paper Format', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_paperformat',
                'type'  => 'select',
                'options'  => array(
                    'a4' => 'A4',
                    'a6'  => 'A6',
                    'thermal_58' => __('Thermal 58mm', 'slovakparcelservice')
                )
            );
            
            $settings[] = array (
                'title' => __('Default A4 Start Position', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_a4position',
                'type'  => 'select',
                'options'  => array(
                    '1' => '1',
                    '2' => '2',
                    '3' => '3',
                    '4' => '4'
                )
            );
            
            $settings[] = array (
                'title' => __('Default PDF Content', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_pdfcontent',
                'type'  => 'select',
                'options'  => array(
                    'pdf' => __("Native PDF", 'slovakparcelservice'),
                    'bitmap'  => __("Bitmap", 'slovakparcelservice')
                )
            );
            
            $settings[] = array (
                'title' => __('Default ZPL Resolution', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_zplresolution',
                'type'  => 'select',
                'options'  => array(
                    'dpi_204' => '204 DPI',
                    'dpi_300' => '300 DPI',
                    'dpi_600' => '600 DPI'
                )
            );
            */
            
            $settings[] = array (
                'title' => __('Email notification', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_emailnotification',
                'type' => 'checkbox',
                'default' => 'yes'
            );
            
            $settings[] = array (
                'title' => __('SMS notification', 'slovakparcelservice' ),
                'id'    => 'woocommerce_slovakparcelservice_smsnotification',
                'type' => 'checkbox',
                'default' => 'yes'
            );
            
            $settings[] = array (
                'title' => __('Phone notification', 'slovakparcelservice' )  . ' (' .  __('Paid service', 'slovakparcelservice' ) .')',
                'id'    => 'woocommerce_slovakparcelservice_phonenotification',
                'type' => 'checkbox',
                'default' => 'yes'
            );
            
            
            $settings[] = array(
                'type' => 'sectionend',
                'id' => 'woocommerce_slovakparcelservice_settings'
            );


            return apply_filters( 'woocommerce_get_settings_' . $this->id, $settings );
        }


        public function output() {
            $settings = $this->get_settings();


            WC_Admin_Settings::output_fields( $settings );

           echo '<table class="form-table">' . "\n\n";

            $lastrun = get_option('woocommerce_slovakparcelservice_refreshlastrun', 0 );
            //update_option('woocommerce_slovakparcelservice_refreshlastrun', $lastrun );
            $refreshlastrun = '';
            if ($lastrun > 0 ) {
                $dt = new DateTime('@'. strval($lastrun) );
                $tz = new DateTimeZone( "Europe/Bratislava");
                $dt = $dt->setTimezone($tz);
                $refreshlastrun = $dt->format("d. m. Y  H:i:s T");
            }


            echo '<tr valign="top"><th scope="row" class="titledesc">'.
                                   '<label for="woocommerce_slovakparcelservice_refreshlastrun">' . __( 'Zip City Updater last run', 'slovakparcelservice' )   .  '</label></th>'.
                                   '<td class="forminp forminp-text">' .
                                   '<input class="input-text regular-input" type="text" name="woocommerce_slovakparcelservice_refreshlastrun" id="woocommerce_slovakparcelservice_refreshlastrun" style="" value="'. $refreshlastrun  .'" placeholder="" readonly>'.
                                   '</td></tr>';

            // next run
            $nextrun = wp_next_scheduled( 'sps_zipcity_hook' );
            $refreshnextrun = "";
            if ($nextrun) {
                $dt = new DateTime('@'.strval($nextrun));
                $tz = new DateTimeZone( "Europe/Bratislava");
                $dt = $dt->setTimezone($tz);
                $refreshnextrun = $dt->format("d. m. Y  H:i:s T");
            }

            echo '<tr valign="top"><th scope="row" class="titledesc">'.
                '<label for="woocommerce_slovakparcelservice_refreshnextrun">' . __( 'Zip City Updater next run', 'slovakparcelservice' )   .  '</label></th>'.
                '<td class="forminp forminp-text">'.
                '<input class="input-text regular-input" type="text" name="woocommerce_slovakparcelservice_refreshnextrun" id="woocommerce_slovakparcelservice_refreshnextrun" style="" value="'. $refreshnextrun  .'" placeholder="" readonly>'.
                '</td></tr>';



            // // add button
            // echo '<tr valign="top"><th scope="row" class="titledesc"><label for="woocommerce_slovakparcelservice_refreshzipcity">' . __( 'Manual update zip and city list', 'slovakparcelservice' ) . '</label></th>'
            // .  '<td class="forminp"><fieldset><legend class="screen-reader-text"><span>' . __( 'Update Zip and city list', 'slovakparcelservice' ) . '</span></legend>'
            // .  '<button class="button-primary" type="button">'  . __( 'Update', 'slovakparcelservice' ) . '</button>'
            // .  '</fieldset></td></tr>';

            echo '</table>';

        }

        public function save() {

            global $current_section;
    
            $settings = $this->get_settings();
    
            WC_Admin_Settings::save_fields( $settings );
    
            
            do_action( 'woocommerce_update_options_' . $this->id  );
            
        }

    }

}
return new WC_SlovakParcelService_Settings();


