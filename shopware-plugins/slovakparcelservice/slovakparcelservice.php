<?php

declare(strict_types=1);

use SPS\Webship\ZipCityChecker\ZipCityChecker;

use SlovakParcelService\SlovakParcelServiceCommon;


/**
 * Plugin Name: SlovakParcelService
 * Plugin URI: https://www.solver.sk/SPSwebshop/
 * Description: Slovak Parcel Service shipping methods
 * Version: 2.8.3
 * Author: Solver IT s.r.o.
 * Author URI: https://www.solver.sk/
 * Text Domain: slovakparcelservice
 * Requires PHP: 7.0
 * Domain Path: /languages
 *
 */

if ( ! defined( 'WPINC' ) ) {
    die;
}

use Automattic\WooCommerce\Utilities\OrderUtil;


if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' )))) {
    
    require_once( __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR  . 'WebshipWebservice.php' );
    require_once( __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR  . 'ZipCityChecker.php' );
    require_once( __DIR__ . DIRECTORY_SEPARATOR . 'SlovakParcelServiceCommon.php' );
    
    
    function slovakparcelservice_shipping_methods() {
     
        if (!class_exists('WC_SlovakParcelService_PickupPlace_Shipping_Method') ) {
            
            require_once( __DIR__ . DIRECTORY_SEPARATOR . "WC_SlovakParcelService_PickupPlace_Shipping_Method.php");
          
       }   // end of if
       
       // Shipping method to Address
       if (!class_exists('WC_SlovakParcelService_Address_Shipping_Method') ) {
           
           require_once ( __DIR__ . DIRECTORY_SEPARATOR . "WC_SlovakParcelService_Address_Shipping_Method.php");
           
       }// end of if
    }   // end of function  slovakparcelservice_shipping_methods()
    
    // register initialization function - create classes init settings
    add_action( 'woocommerce_shipping_init', 'slovakparcelservice_shipping_methods' );
        
    // add shipping methods to woocommerce
    add_filter( 'woocommerce_shipping_methods', 'add_slovakparcelservice_shipping_methods' );
    function add_slovakparcelservice_shipping_methods( $methods ) {
        $methods['slovakparcelservice_pickupplace'] = 'WC_SlovakParcelService_PickupPlace_Shipping_Method';
        $methods['slovakparcelservice_address'] = 'WC_SlovakParcelService_Address_Shipping_Method';
        return $methods;
    }
    

    // add settings tab
    add_filter( 'woocommerce_get_settings_pages', 'add_settings_tab' );
    function add_settings_tab($settings) {
        $settings[] = include __DIR__  . '/inc/settings.php';
        return $settings;
    }
    
    // uninstalation
    register_uninstall_hook(__FILE__,  'uninstall' );
    function uninstall() {
       
       //  delete setings alloptions
       delete_option('woocommerce_slovakparcelservice_version');
       delete_option('woocommerce_slovakparcelservice_apiusername');
       delete_option('woocommerce_slovakparcelservice_apipassword');
       delete_option('woocommerce_slovakparcelservice_codpayments');
       delete_option('woocommerce_slovakparcelservice_codsending');
       delete_option('woocommerce_slovakparcelservice_codsending_cz');
       delete_option('woocommerce_slovakparcelservice_refreshlastrun');
       
       delete_option('woocommerce_slovakparcelservice_statuses');
       delete_option('woocommerce_slovakparcelservice_statusesswitch');
       
       delete_option('woocommerce_slovakparcelservice_statusexportswitch');
       delete_option('woocommerce_slovakparcelservice_statusexport');
       
       delete_option('woocommerce_slovakparcelservice_printingsettings');
       delete_option('woocommerce_slovakparcelservice_printingformat');
       delete_option('woocommerce_slovakparcelservice_paperformat');
       delete_option('woocommerce_slovakparcelservice_a4position');
       delete_option('woocommerce_slovakparcelservice_pdfcontent');
       delete_option('woocommerce_slovakparcelservice_zplresolution');
       
       delete_option('woocommerce_slovakparcelservice_emailnotification');
       delete_option('woocommerce_slovakparcelservice_smsnotification');
       delete_option('woocommerce_slovakparcelservice_phonenotification');
       
       delete_option('woocommerce_slovakparcelservice_addr_delivery_countries');
       delete_option('woocommerce_slovakparcelservice_pp_delivery_countries');

        // TODO delete shipping methods
    }
    
    
    // load translations
    add_action('plugins_loaded', 'slovakparcelservice_woocommerce_init');
    function slovakparcelservice_woocommerce_init () {
        $plugin_rel_path = basename( dirname( __FILE__ ) ) . '/languages';
        load_plugin_textdomain( 'slovakparcelservice', false, $plugin_rel_path );
    }
    
   
    // ##################   after PROCEED TO CHECKOUT  ##########################
    function strip_instance( $instance ) {
        
        if ( $instance === null ) {
            return null;
        }
        $instance = explode(':', $instance);
        return array_shift($instance);
    }
    
    function split_instance ( $instance ) {
        
        if ( $instance === null ) {
            return null;
        }
        
        return  explode(':', $instance);
    }
    
    // WC BLOCKS
    
    
    
    // after PLACE ORDER   check if ps is choosen and phone is ok
    function on_order_validation() {
        
        
        $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
        $chosen_shipping = $chosen_shipping[0];
        
        $shipping =  strip_instance($chosen_shipping);
        
        if( $shipping !==  'slovakparcelservice_pickupplace' && $shipping !== 'slovakparcelservice_address' )  {
            
            return true;
        }
        
        $pp = get_session_pp_data();
        if ( $shipping ===  'slovakparcelservice_pickupplace' ) {
            
            // check if PS/PT is selected
            $message = __('Please select balíkovo', 'slovakparcelservice');
            $message = '<a href="#sps-parcelshop-wrapper">' . $message . '</a>';
           
            if ( $pp['name'] === '' ) {
                wc_add_notice( $message, 'error' );
                return false;
            }
        }
                
        // check for slovak delivery
        if (  ( $shipping ===  'slovakparcelservice_pickupplace' && $pp['countryiso'] === 'SK' )  ||
              ( $shipping === 'slovakparcelservice_address'   &&  WC()->customer->get_shipping_country() === 'SK' )  ) {
        
            // check if phone number format
            if(isset($_POST['billing_phone'])) {
                $phone_number = $_POST['billing_phone'];
                $isOK = false;
            
                if(substr($phone_number,0,5) == "+4219" && strlen($phone_number) == 13) {
                    $isOK = true;
                }
                if(substr($phone_number,0,6) == "004219" && strlen($phone_number) == 14) {
                    $isOK = true;
                }
                if(substr($phone_number,0,2) == "09" && strlen($phone_number) == 10) {
                    $isOK = true;
                }
                if($isOK === false){
                    $message = __('Telephone number has to be in "004219..." or "+4219..." or "09..." format', 'slovakparcelservice');
                    $message = '<a href="#billing_phone">' . $message . '</a>';
                    wc_add_notice( $message, 'error' );
                    return false;
                }
            }
            
            // check zip  city
            $customer = WC()->customer ;
            $zip_for_test = null;
            $city_for_test = null;
                
            if (  $shipping ===  'slovakparcelservice_address') {
                $zip_for_test = $customer->get_shipping_postcode();
                $city_for_test = $customer->get_shipping_city();
            }else {
                $zip_for_test = $pp['zip'];
                $city_for_test = $pp['city'];
            }
            $ret = ZipCityChecker::checkZipCity($zip_for_test, $city_for_test  );
            if ( ! $ret['result'] ) {
                    
                if (  $shipping ===  'slovakparcelservice_address') {
                   $message = '';
                   if ( count($ret['options']) > 0  ) {
                        $message =  __('No zip city match, please use one of these cities for shipping :<br>', 'slovakparcelservice');
                    
                        $message .= "<pre style=\"padding:0;\">" . $ret['options'][0] ;
                        
                        for( $i = 1 ; $i < count( $ret['options'] ); $i++) {
                            $message .=  "<br>" . $ret['options'][$i];
                        }
                        $message .= "</pre>";
                    }else {
                        $message =  __('No city for zip, please check zip', 'slovakparcelservice');
                    }
                    wc_add_notice( $message, 'error' );
                    return false;
                }else {
                    // pickup place
                    //$pp = get_session_pp_data();
                    
                    $message =  'balíkovo ';
                    $message .=  $pp['name'] . " " . $pp['address'] . ", " . $pp['zip'] ." " . $pp['city'] ;
                    $message .= __(' contains invalid data. Please select other one.','slovakparcelservice');
                    wc_add_notice( $message, 'error' );
                    return false;
                }
            } else {
                //  fix city for address
                if (  $shipping === 'slovakparcelservice_address') {
                    if (  strcmp( $ret['options'][0], $customer->get_shipping_city() ) !== 0  ) {
                        WC()->session->set('sps_city_fix', $ret['options'][0]);
                    }
                }
            }
        }
        
        // check non slovak delivery
        if (  ( $shipping ===  'slovakparcelservice_pickupplace' && $pp['countryiso']  !== 'SK' )  ||
        ( $shipping === 'slovakparcelservice_address'  &&  WC()->customer->get_shipping_country() !== 'SK' )  ) {
            
            // CZ phone number check
            if( ( $shipping ===  'slovakparcelservice_pickupplace' && $pp['countryiso']  === 'CZ' )  ||
            ( $shipping === 'slovakparcelservice_address'   &&  WC()->customer->get_shipping_country() === 'CZ' )  ) {
                
                // check if phone number format
                if(isset($_POST['billing_phone'])) {
                    $phone_number = $_POST['billing_phone'];
                    $isOK = false;
                    
                    if ( preg_match("/^((\+|00)420|)[0-9]{9}$/", $phone_number) ) {
                        $isOK = true;
                    }
                    if($isOK === false){
                        $message = __('Telephone number has to be in "00420xxxxxxxxx" or "+420xxxxxxxxx" or "xxxxxxxxx" format', 'slovakparcelservice');
                        $message = '<a href="#billing_phone">' . $message . '</a>';
                        wc_add_notice( $message, 'error' );
                        return false;
                    }
                }
            }
                
            // HU  phone number check
            if( ( $shipping ===  'slovakparcelservice_pickupplace' && $pp['countryiso'] === 'HU' )  ||
                ( $shipping === 'slovakparcelservice_address'   &&  WC()->customer->get_shipping_country() === 'HU' )  ) {
                    
                // check if phone number format
                if(isset($_POST['billing_phone'])) {
                    $phone_number = $_POST['billing_phone'];
                    $isOK = false;
                        
                    if ( preg_match("/^(0036|\+36|06)[0-9]{9}$/", $phone_number) ) {
                        $isOK = true;
                    }
                    if($isOK === false){
                        $message = __('Telephone number has to be in "0036xxxxxxxxx" or "+36xxxxxxxxx" or "06xxxxxxxxx" format', 'slovakparcelservice');
                        $message = '<a href="#billing_phone">' . $message . '</a>';
                        wc_add_notice( $message, 'error' );
                        return false;
                    }
                }
            }
            
            // check zip format non SK
            $customer = WC()->customer ;
            $zip_for_test = null;
            $country_for_test = null;
                
            if (  $shipping ===  'slovakparcelservice_address') {
                $zip_for_test = $customer->get_shipping_postcode();
                $country_for_test = $customer->get_shipping_country();
            }else {
                $zip_for_test = $pp['zip'];
                $country_for_test = $pp['countryiso'];
            }
            $ret = ZipCityChecker::checkZipFormat($country_for_test, $zip_for_test);
            if  ( !$ret["res"] ) {
                if ( $shipping ===  'slovakparcelservice_pickupplace' ) {
                    //pickupplace
                    $message =  'balíkovo ';
                    $pp = get_session_pp_data();
                    $message .= $pp['countryiso'] . " " . $pp['name'] . " " . $pp['address'] . ", " . $pp['zip'] . " " . $pp['city'] ;
                    $message .= __(' contains invalid data. Please select other one.','slovakparcelservice');
                    wc_add_notice( $message, 'error' );
                    return false;
                }else {
                    // address
                    if (  !isset($ret["min"] )) {
                        $message = __('Delivery country is not suported', 'slovakparcelservice');
                        wc_add_notice( $message, 'error' );
                        return false;
                    }
                    $message = __('Zip format check failed.', 'slovakparcelservice');
                    $message .= __(' Zip min length : ', 'slovakparcelservice') . strval($ret["min"])  ." " . __(', zip max length : ', 'slovakparcelservice')  .  strval($ret["max"])  ;
                    if ( ! $ret["alphanum"]) {
                        $message .= __('. Digits only.', 'slovakparcelservice');
                    }else {
                        $message .= __('. Digits and letters.', 'slovakparcelservice');
                    }
                    wc_add_notice( $message, 'error' );
                    return false;
                }
            }
        }
        return true;
    }
    add_action( 'woocommerce_checkout_process', 'on_order_validation' ); // on order validation
    
    
    // not in BLOCKS
    add_action( 'woocommerce_checkout_create_order', 'checkout_create_order',10,2 );
    function checkout_create_order ( $order, $data) {
        
        //error_log( date_create()->format("Y-m-d_H-i-s.uP") . " :: checkout_create_order" . print_r($order,true) . "\n", 3, "/srv/http/wordpress/log.txt" );
       // error_log( date_create()->format("Y-m-d_H-i-s.uP") . " :: checkout_create_order (data) " . print_r($data,true) . "\n", 3, "/srv/http/wordpress/log.txt" );
        
        $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
        $chosen_shipping = $chosen_shipping[0];
        
        $shipping = strip_instance( $chosen_shipping );
        if( $shipping !== 'slovakparcelservice_address' )  {
            return $order;
        }
       
        // check fixes city in session data
        if( WC()->session->get('sps_city_fix') !== null ) {
            $order->set_shipping_city(WC()->session->get('sps_city_fix'));
            WC()->session->__unset('sps_city_fix');
        }
        return $order;
        
    }
    
    // ala woocommerce_checkout_order_processed/woocommerce_checkout_create_order  - copy & paste + mod from on_order_validation()
    add_action('woocommerce_store_api_checkout_order_processed', 'store_api_order_process',10);
    function store_api_order_process($order) {
        
        $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' ); // get from order ??
        $chosen_shipping = $chosen_shipping[0];
        
        $shipping_arr =  split_instance($chosen_shipping);
        
        if ($shipping_arr === null  ) {
            $shipping = null;
        }else {
            $shipping =  $shipping_arr[0];
            $instance =  $shipping_arr[1];
        }
        
        if( $shipping !==  'slovakparcelservice_pickupplace' && $shipping !== 'slovakparcelservice_address' )  {
            return true;
        }
        
        // check if pp is selected
        $pp = get_session_pp_data();
        if ( $shipping ===  'slovakparcelservice_pickupplace' ) {
            $message = __('Please select balíkovo', 'slovakparcelservice');
            $message = '<a href="#sps-parcelshop-wrapper">' . $message . '</a>';
            
            if ( $pp['name'] === '' ) {
                throw new Exception($message);
            }
        }

        $phone_number = $order->get_shipping_phone();

        if (is_null($phone_number)) {
            $phone_number = '';
        }

        $country = $order->get_shipping_country();
        // SK - phone number format check + zip/city check
        // getrorder delivery address phone

        // check for slovak delivery
        if (($shipping === 'slovakparcelservice_pickupplace' && $pp['countryiso'] === 'SK') || ($shipping === 'slovakparcelservice_address' && $country === 'SK')) {
            
            $isOK = false;


            if ( preg_match("/^((\+|00)421|0)9[0-9]{8}$/", $phone_number)){
                $isOK = true;
            }
            
            if ($isOK === false) {
                $message = __('Telephone number has to be in "004219..." or "+4219..." or "09..." format', 'slovakparcelservice');
                $message = '<a href="#billing_phone">' . $message . '</a>';
                throw new Exception($message);
            }

            // check zip city
            $zip_for_test = null;
            $city_for_test = null;

            if ($shipping === 'slovakparcelservice_address') {
                $zip_for_test = $order->get_shipping_postcode();
                $city_for_test = $order->get_shipping_city();
            } else {
                $zip_for_test = $pp['zip'];
                $city_for_test = $pp['city'];
            }
            $ret = ZipCityChecker::checkZipCity($zip_for_test, $city_for_test);
            if (! $ret['result']) {

                if ($shipping === 'slovakparcelservice_address') {

                    if (count($ret['options']) > 0) {
                        $message = __('No zip city match, please use one of these cities for shipping :<br>', 'slovakparcelservice');

                        $message .= "<pre style=\"padding:0;\">" . $ret['options'][0];

                        for ($i = 1; $i < count($ret['options']); $i ++) {
                            $message .= "<br>" . $ret['options'][$i];
                        }
                        $message .= "</pre>";
                    } else {
                        $message = __('No city for zip, please check zip', 'slovakparcelservice');
                    }
                    throw new Exception($message);
                } else {
                    // pickup place invalid data
                    $message = 'balíkovo ';
                    $message .= $pp['name'] . " " . $pp['address'] . ", " . $pp['zip'] . " " . $pp['city'];
                    $message .= __(' contains invalid data. Please select other one.', 'slovakparcelservice');
                    throw new Exception($message);
                    }
            } else {
                //  fix city for address
                if (  $shipping === 'slovakparcelservice_address') {
                    if (  strcmp( $ret['options'][0], $city_for_test ) !== 0  ) {
                        $order->set_shipping_city($ret['options'][0]);  // do woocommerce_checkout_create_order  here
                    }
                }
            }
        }
        
        // check non slovak delivery
        if (  ( $shipping ===  'slovakparcelservice_pickupplace' && $pp['countryiso']  !== 'SK' )  ||
                ( $shipping === 'slovakparcelservice_address'  &&  $country !== 'SK' )  ) {

                // CZ phone number check
            if (($shipping === 'slovakparcelservice_pickupplace' && $pp['countryiso'] === 'CZ') || ($shipping === 'slovakparcelservice_address' && $country === 'CZ')) {

                // check if phone number format
                $isOK = false;

                if (preg_match("/^((\+|00)420|)[0-9]{9}$/", $phone_number)) {
                    $isOK = true;
                }
                if ($isOK === false) {
                    $message = __('Telephone number has to be in "00420xxxxxxxxx" or "+420xxxxxxxxx" or "xxxxxxxxx" format', 'slovakparcelservice');
                    $message = '<a href="#billing_phone">' . $message . '</a>';
                    throw new Exception($message);
                }
            }

            // HU phone number check
            if (($shipping === 'slovakparcelservice_pickupplace' && $pp['countryiso'] === 'HU') || ($shipping === 'slovakparcelservice_address' && $country === 'HU')) {

                // check if phone number format
                $isOK = false;

                if (preg_match("/^(0036|\+36|06)[0-9]{9}$/", $phone_number)) {
                    $isOK = true;
                }
                if ($isOK === false) {
                    $message = __('Telephone number has to be in "0036xxxxxxxxx" or "+36xxxxxxxxx" or "06xxxxxxxxx" format', 'slovakparcelservice');
                    $message = '<a href="#billing_phone">' . $message . '</a>';
                    throw new Exception($message);
                }
            }

            // check zip format non SK
            $zip_for_test = null;
            $country_for_test = null;

            if ($shipping === 'slovakparcelservice_address') {
                $zip_for_test = $order->get_shipping_postcode();
                $country_for_test = $order->get_shipping_country();
            } else {
                $zip_for_test = $pp['zip'];
                $country_for_test = $pp['countryiso'];
            }
            $ret = ZipCityChecker::checkZipFormat($country_for_test, $zip_for_test);
            if (! $ret["res"]) {
                if ($shipping === 'slovakparcelservice_pickupplace') {
                    // pickupplace
                    $message = 'balíkovo ';
                    $pp = get_session_pp_data();
                    $message .= $pp['countryiso'] . " " . $pp['name'] . " " . $pp['address'] . ", " . $pp['zip'] . " " . $pp['city'];
                    $message .= __(' contains invalid data. Please select other one.', 'slovakparcelservice');
                    throw new Exception($message);
                } else {
                    // address
                    if (! isset($ret["min"])) {
                        $message = __('Delivery country is not suported', 'slovakparcelservice');
                        throw new Exception($message);
                    }
                    $message = __('Zip format check failed.', 'slovakparcelservice');
                    $message .= __(' Zip min length : ', 'slovakparcelservice') . strval($ret["min"]) . " " . __(', zip max length : ', 'slovakparcelservice') . strval($ret["max"]);
                    if (! $ret["alphanum"]) {
                        $message .= __('. Digits only.', 'slovakparcelservice');
                    } else {
                        $message .= __('. Digits and letters.', 'slovakparcelservice');
                    }
                    throw new Exception($message);
                }
            }
        }
        
        // Check COD here  c&p + Mod from slovakparcelservice_gateways_filter
        // check if payment is cod type
        $arr = get_option('woocommerce_slovakparcelservice_codpayments');
        if ( ! is_array($arr) ) {
            $arr = array();
        }
        $cod_payments = array_values($arr );
        //get $order -payment
        $payment = $order->get_payment_method();
        
         if ( ! in_array($payment, $cod_payments ) ) {
            //is not COD payment
            clear_session_pp_data();
            return true;
        }
        
        $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
        $method = new $shipping_class_names[$shipping]($instance);
        $shop_currency = get_woocommerce_currency();
        $currency = $method->get_instance_option('currency');
        $state = WC()->customer->get_shipping_country();
        
        $message =  __('Cod type payment is not avalible for ', 'slovakparcelservice' ) . " " . $method->title ;
        
        // not EUR to EUR country
        if ( $shop_currency !== 'EUR'  && ZipCityChecker::getCurrencyForCountry($state) === 'EUR' ) {
            $message .= __('. Sending non EUR currency to country with EUR.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        // not EUR as EUR to noEUR country
        if ( $state !== 'CZ') {
            $codsending = get_option('woocommerce_slovakparcelservice_codsending');
        }else {
            $codsending = get_option('woocommerce_slovakparcelservice_codsending_cz');
        }
        if ( $shop_currency !== 'EUR'  &&  ZipCityChecker::getCurrencyForCountry($state) !== 'EUR'
            &&  $codsending === 'yes'   ){
            $message .= __('. Sending Cod is set to EUR for this non EUR country.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        // wrong currency to nonEUR country
        if (ZipCityChecker::getCurrencyForCountry($state) !== 'EUR' && $codsending !== 'yes' && $shop_currency !== $currency ) {
            $message .= __('. Wrong currency for destination country.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        // EUR to no EUR country
        if (  $shop_currency === 'EUR' && ZipCityChecker::getCurrencyForCountry($state) !== 'EUR' && $codsending  !== 'yes' ) {
            $message .= __('. Sending Cod in EUR to non EUR countries is not enabled.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        $total = WC()->cart->total;
        if ( ( $state === 'SK' && $total > 5000)
            || ($shop_currency === 'EUR' && $state !== 'SK' && $total > 3300 )
            || ($shop_currency === 'CZK' && $state !== 'SK' && $total > 80000 )   // CZK   3300 *24  kurz  ~ 80000
            ) {
            $message .= __('. Cod amount is over limit.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        // pp has cod enable
        if ( $shipping === 'slovakparcelservice_pickupplace' &&  WC()->session->get('sps_pp_iscod') === 'false' ) {
            $message .= __('. Selected balikovo does not support Cod payment.', 'slovakparcelservice' );
            throw new Exception($message);
        }
        
        clear_session_pp_data();
        return true;
        
    }
    
    
   // BLOCKS
  // add_action('woocommerce_store_api_cart_select_shipping_rate', 'store_api_cart_select_shipping_rate', 10, 3);
  //
  //  function store_api_cart_select_shipping_rate($package_id, $rate_id, $request) {
  //
  //
  //    //$chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
  //    //$chosen_shipping = $chosen_shipping[0];
  //    // 0 name 1 id
  //      $shipping_arr = split_instance($rate_id);
  //
  //      wc_get_logger()->debug('store_api_cart_select_shipping_rate :: ' . $rate_id );
  //
  //      //
  //      if ( $shipping_arr[0] !== 'slovakparcelservice_address' && $shipping_arr[0] !== 'slovakparcelservice_pickupplace' ){
  //          return;
  //      }
  //
  //
  // }
    
    
    // JS include with parameters
    add_action('wp_enqueue_scripts', 'slovakparcelservice_checkout_script', 999);
    function slovakparcelservice_checkout_script () {
        if(!is_checkout()  ) {
            return;
        }
       
        wp_enqueue_script('slovakparcelservice_checkout_helper', plugins_url( '/js/helper.js', __FILE__ ), array('jquery'), null );
        wp_add_inline_script('slovakparcelservice_checkout_helper', 'var SPSwoocommerceajax = ' . json_encode(array( 'url' => admin_url( 'admin-ajax.php' ))), 'before' );
        wp_enqueue_script('slovakparcelservice_widget', 'https://balikomat.sps-sro.sk/widget/v1/widget/js/widget.js', false, null );
        
        // wp_inline scripts for wc blocks js parameters
        if ( class_exists("WC_Blocks_Utils") && WC_Blocks_Utils::has_block_in_page( wc_get_page_id('checkout'), 'woocommerce/checkout' )){
            
            wp_enqueue_script('slovakparcelservice_block_checkout_helper', plugins_url( '/js/block_helper.js', __FILE__ ), array('jquery'), null );
        }
    }
    
    
    // JS to admin page
    add_action('admin_enqueue_scripts', 'slovakparcelservice_admin_script');
    function slovakparcelservice_admin_script($hook) {
        
        // only if have seleced zone in shipping tab
        if ($hook !== 'woocommerce_page_wc-settings' || ! isset($_GET['tab'])  ||   $_GET['tab'] !==  'shipping'  || ! isset($_GET['zone_id']) ){
            return;
        }
        
        echo '<script type="text/javascript">' .
        'var SPS = SPS||{};' .
        'SPS.weight_text = "'  .  __( 'Weight (<=)', 'slovakparcelservice' ) .'";' .
        'SPS.cost_text = "'  .  __( 'Shipping Cost', 'slovakparcelservice' ) .'";' .
        'SPS.add_range_text = "'  .  __( 'Add/Set Range', 'slovakparcelservice' ) .'";' .
        'SPS.del_range_text = "'  .  __( 'Delete Range', 'slovakparcelservice' ) .'";' .
        'SPS.weight_over_text = "'  . __( 'Weight over highest range', 'slovakparcelservice' ) . '";'.
        'SPS.weight_over_add_text ="' .  __( 'Set/Unset Over Weight Cost', 'slovakparcelservice' ) . '";'.
        '</script>' ;
        
        wp_enqueue_script('slovakparcelservice_admin_helper', plugins_url( '/js/admin.js', __FILE__ ), false, null );
    }
    
    
    add_action( 'woocommerce_after_shipping_rate', 'slovakparcelservice_inject_map', 20, 2 ); // display after shipping label
    // input  WC_Shipping_Rate
    function slovakparcelservice_inject_map( $method, $index ) {
     
        //filter correct place for iframe
        if(!is_checkout()  ) {
            return;
        }
        
        $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
        $chosen_shipping = array_shift( $chosen_shipping );  // with name:id
        
        if($method->method_id != 'slovakparcelservice_pickupplace' or $method->get_id() != $chosen_shipping){
            return;
        }
        
        $customer = WC()->session->get('customer');
        $centerAddress = ( empty($customer['shipping_address_1'])? "" : $customer['shipping_address_1']  . ', ' ) .
            ( empty( $customer['shipping_postcode']) ? "" : $customer['shipping_postcode']  . ' ' ) .
            ( empty( $customer['shipping_city'] ) ? "" : $customer['shipping_city'] );
        
            
        //get info from session
        $pp = get_session_pp_data();
        
        $html = "";
        $html .= '<div id="sps-parcelshop-wrapper" class="shipping_method" >';
              
        $html.= '<button id="sps-parcelshop-wrapper-button"  type="button">' . __("balíkovo Select", 'slovakparcelservice') . '</button>';
                                
        if ( ! $pp['name'] === '' ) {
            $html.= '<div id="sps_info2" style="display:none;">  <label for="sps_pp_full_address2">balíkovo:</label>';
            $html.= '<input type="text" id="sps_pp_full_address2"  title="" style="width:100%;"  readonly></div>';
        }else {
            $html.= '<div id="sps_info2" style="display:block;">  <label for="sps_pp_full_address2">balíkovo:</label>';
            $html.= '<input type="text" id="sps_pp_full_address2" value="' .  $pp['name'] .'"  title="' . $pp['info'] . ', ' .  $pp['address'] . ', ' . $pp['zip'] . ' ' . $pp['city'] . ', ' .  $pp['countryiso'] . '" style="width:100%;"  readonly></div>';
            
        }
        
        
        // get config for
        $shipping_exploded = explode(":", $chosen_shipping);
        
        $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
        $method = new $shipping_class_names[$shipping_exploded[0]]($shipping_exploded[1]);
        
        $method_delivery = $method->get_instance_option('delivery');
        
        $html .= '<script>';
        if ( $method_delivery === 'ps' ){
            $html .= 'var type="PS";';
        }else if ( $method_delivery === 'pt' ) {
            $html .= 'var type="PT";';
        }else {
            $html .= 'var type = null;';
        }
        
        //get zone with our shipping method , check for countries or continents
        $state = WC()->customer->get_shipping_country();
        
        if ( $state === 'SK' ) {
             $html .= 'var country = "SK";';
        }else if ( $state === 'CZ' ) {
            $html .= 'var country = "CZ";';
        }
        
        $html .= ' var address = "'.  $centerAddress . '";';
        
        $html .= '
            (function($) {
                $(document).ready(function(){


                    console.log("SPS balikovo SELECTED");

                    var $ = jQuery;

                    $("#sps-parcelshop-wrapper-button").on("click", function() {

                        console.log("SPS balikovo CLICK");

                        var pp = null ;
                        if ( document.getElementById("sps_pp_full_address2") && document.getElementById("sps_pp_full_address2").value !== "" ) {
                            pp = document.getElementById("sps_pp_full_address2").value;
                        }
    
                        var SPSwidget = window.SPSwidget || {};
                        SPSwidget.config = SPSwidget.config || {};

                        SPSwidget.config.pp = pp;
                        SPSwidget.config.type = type;
                        SPSwidget.config.address = address;
                        SPSwidget.config.country = country;
                        
                        SPSwidget.showMap();
                    });
                });
            }(jQuery));
        </script>';
        
        $html .= '</div>';
        echo $html;
    }
    


    // save meta data to order ( before save to DB )
     function on_save( $order_id ) {
         $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
         $chosen_shipping = $chosen_shipping[0];
         
         $shipping = strip_instance( $chosen_shipping );
         if( $shipping !== 'slovakparcelservice_pickupplace' && $shipping !== 'slovakparcelservice_address' )  {
             return true;
         }
        
         $we_have_blocks = false ;
         if ( $order_id instanceof \WC_Order  ) {
             // BLOCKS
             $we_have_blocks = true;
             $order = $order_id;
         }else {
            //CORE
            $order = wc_get_order($order_id);
         }
         
         if ($shipping ==  'slovakparcelservice_pickupplace' ) {
            // check if ps name is in data
            
            $pp = get_session_pp_data();
            if ( $pp['name'] === "" ) {
                return;
            }
            
            $order->update_meta_data('_slovakparcelservice_pp_name', $pp['name']);
            //pdate_post_meta( $order_id, '_slovakparcelservice_pp_info', $_POST['sps_pp_info'] );
            $order->update_meta_data('_slovakparcelservice_pp_address', $pp['address'] );
            $order->update_meta_data('_slovakparcelservice_pp_zip', $pp['zip'] );
            $order->update_meta_data('_slovakparcelservice_pp_city', $pp['city'] );
            $order->update_meta_data('_slovakparcelservice_pp_countryISO', $pp['countryiso'] );
            $order->update_meta_data('_slovakparcelservice_pp_cod', $pp['cod'] );
            $order->update_meta_data('_slovakparcelservice_type', $pp['type'] );

            
            // add note with pickup place details
            $order->add_order_note(  __("Slovak Parcel Service - Selected balíkovo", 'slovakparcelservice') . " : " .
                $pp['info'] .", " . $pp['address'] . ", " . $pp['zip'] ." " . $pp['city'] . ", " . $pp['countryiso'] , 0);

            $customer_note =   $order->get_customer_note();
            $customer_note =   __("Slovak Parcel Service - Selected balíkovo", 'slovakparcelservice') . " : " .
                $pp['info'] .", " . $pp['address'] . ", " . $pp['zip'] ." " . $pp['city'] . ", " . $pp['countryiso'] ."\r\n". $customer_note;
            
            $order->set_customer_note($customer_note);

         }else {
             $order->update_meta_data( '_slovakparcelservice_type', 'ADDR' );
         }
         
         if (! $we_have_blocks) {  //dont clear session data if have BLOCKS this is before order is checked in blocks
            clear_session_pp_data();
         }
         
         
         // get code paymens ftom settings
         $arr = get_option('woocommerce_slovakparcelservice_codpayments');
         if ( ! is_array($arr) ) {
            $arr = array();
         }
         $cod_payments = array_values( $arr);
         
         $payment = WC()->session->get( 'chosen_payment_method' );
         
         WC()->session->get( 'chosen_shipping_methods' );
         
         if ( in_array($payment, $cod_payments)){
             $is_cod = '1';
         } else {
             $is_cod = '0';
         }
         
         $order->update_meta_data('_slovakparcelservice_is_cod', $is_cod);
         
         $order->update_meta_data('_slovakparcelservice_label_url', '' );
         $order->update_meta_data('_slovakparcelservice_endofday_url', '' );
         $order->save();
         
    }
    
    add_action( 'woocommerce_checkout_update_order_meta',  'on_save' ); // update order meta data CORE
    add_action( 'woocommerce_store_api_checkout_update_order_meta', 'on_save' );  // update order meta data  BLOCKS
    
    
    
    
    
    //  ### link to  woocommerce shipping setting from plugin page
    function plugin_add_settings_link( $links ) {
        $settings_link = '<a href="'.admin_url( 'admin.php?page=wc-settings&tab=slovakparcelservice' ).'">' . __( 'Settings', 'slovakparcelservice') . '</a>';
        array_unshift( $links, $settings_link);
        return $links;
    }
    
    // plugin page "Settings" link common config for all methods
    add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'plugin_add_settings_link' );
    
    
    // https://stackoverflow.com/questions/45516819/add-a-custom-action-button-in-woocommerce-admin-order-list
    
    //   ###  add columns to woocomerce order list
    add_filter( 'manage_edit-shop_order_columns', 'slovakparcelservice_custom_shop_order_column', 20 );
    add_filter( 'manage_woocommerce_page_wc-orders_columns', 'slovakparcelservice_custom_shop_order_column', 20 ); //HPOS OK
    function slovakparcelservice_custom_shop_order_column($columns) {
        $reordered_columns = array();
        foreach( $columns as $key => $column){
       
            // insert before status
            if( $key === 'order_status' ){
                $reordered_columns['slovakparcelservice'] =  __( 'SPS','slovakparcelservice');
                $reordered_columns[$key] = $column;
            }else {
                $reordered_columns[$key] = $column;
            }
        }
        return $reordered_columns;
    }
    //  add content to custom  columns
    add_action( 'manage_shop_order_posts_custom_column' , 'slovakparcelservice_custom_orders_list_column_content', 20, 2 );
    add_action( 'manage_woocommerce_page_wc-orders_custom_column', 'slovakparcelservice_custom_orders_list_column_content', 20, 2 ); //HPOS - OK
    function slovakparcelservice_custom_orders_list_column_content($column, $post_id) {
        
        // fast check for column
        if ( $column !==  'slovakparcelservice' &&  $column !==  'shipping_address' ) {
            return;
        }
        
        //require_once(__DIR__ . DIRECTORY_SEPARATOR . 'SlovakParcelServiceCommon.php' );
        
        // check for HPOS ->post_ids objects v string
        $order = $post_id instanceof WC_Order ?  $post_id  : wc_get_order($post_id);
        
        if ($column ===  'slovakparcelservice') {
            //$pdf_url = get_post_meta( $order->get_id(), '_slovakparcelservice_label_url', true );
            $pdf_url = $order->get_meta('_slovakparcelservice_label_url');
                
            
            if ( !empty($pdf_url)) {
                echo '<p style="display: inline-block;"><a href="' . $pdf_url . '" target="_blank" class="button wc-action-button">'. __( 'Label PDF','slovakparcelservice') . '</a>';
            } else {
                echo '<p style="display: inline-block;">';
                
                // TODO
                //if ( metadata_exists('post', $order->get_id(),  '_slovakparcelservice_label_url') ) {
                if ( $order->meta_exists('_slovakparcelservice_label_url') ) {
                    
                    //check if use filter for export is enabled
                    $add_export = false;
                    if ( get_option('woocommerce_slovakparcelservice_statusesswitch') === 'yes' ) {
                        
                        $stats = get_option('woocommerce_slovakparcelservice_statuses');
                        if ( ! is_array($stats)){
                            $stats = array();
                        }
                        $order_stat = "wc-" . $order->get_status();

                        if (in_array($order_stat, $stats) ){
                            $add_export = true;
                        }
                    }else {
                        $add_export = true;
                    }
                    
                    if  ( $add_export ) {
                        echo  '<button type="submit" name="slovakparcelservice_export_data"  class="button" value="' . strval($order->get_id()). '">' .
                            __( 'Export Data', 'slovakparcelservice' )   . '</button>';
                        
                         
                        // allow num packages settings for address (except Poland  )
                        if ( $order->get_meta('_slovakparcelservice_type') === 'ADDR'   &&  $order->get_shipping_country() !==  'PL' ) {
                            
                            // calculate mon count of packages
                            // get cart weight / 50
                            //calc  weight
                            $total_weight = 0.0;
                            foreach ($order->get_items() as $item) {
                                $total_weight +=   (int) $item->get_quantity() * (float) $item-> get_product()->get_weight();
                            }
                            // convert to kg;
                            $conv  = SlovakParcelService\SlovakParcelServiceCommon::convert_weight($total_weight, get_option('woocommerce_weight_unit'));
                            if ($conv  === null ) {  // unknown uweight unit , assume kg
                                $conv = $total_weight;
                            }
                            
                            $int_min = intval( ceil( $conv / SlovakParcelService\SlovakParcelServiceCommon::MAX_WEIGHT_ADDR ));
                            if ($int_min === 0 ) {
                                $int_min = 1;
                            }
                            $min = strval($int_min);
                            
                            echo '<input type="number" size="5" class="no-link"  min="'. $min .'" max="20" value="'. $min . '" step="1" name="slovakparcelservice_packages_' . strval($order->get_id()) . '">';
                        }
                    }
                }
            }
            //$pdf_url = get_post_meta( $order->get_id(), '_slovakparcelservice_endofday_url', true );
            $pdf_url = $order->get_meta('_slovakparcelservice_endofday_url');
            if ( !empty($pdf_url)) {
                echo '<a href="' . $pdf_url . '" target="_blank" class="button wc-action-button">'. __( 'EndOfDay PDF','slovakparcelservice') . '</a></p>';
            }else {
                echo  '</p>';
            }
        }
        // PS/PT PLACE ID
        if ( $column ===  'shipping_address'){
            //$order = wc_get_order($post_id);
            // global $the_order;
            
            // WC_Order_Item_Shipping[]
            $shipping_items =  $order->get_items( 'shipping' );
            
            $ship_id = '';
            if ( count($shipping_items) > 0 ) {
                $ship_id = reset( $shipping_items )->get_method_id();
            }
            
            if ( $ship_id === 'slovakparcelservice_pickupplace' ) {
                echo '<span class="description">' . $order->get_meta('_slovakparcelservice_type') . " (" . $order->get_meta('_slovakparcelservice_pp_countryISO') .":" . $order->get_meta('_slovakparcelservice_pp_name')  .")"  . '</span>';
            }
        }
    }
    
    
    // export data button handling
  
    //  woocommerce_order_query   //HPOS  // woocommerce_shop_order_list_table_prepare_items_query_args ???
    add_filter( 'woocommerce_order_query_args', 'slovakparcelservice_data_export_hpos');    // HPOS
    function  slovakparcelservice_data_export_hpos($query_args ) {
        
        global $pagenow;
        
        // $_GET['page'] == wc-orders  &&  $pagenow == 'admin.php', parent  '' - filter child call
        if (class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&  OrderUtil::custom_orders_table_usage_is_enabled() &&  isset($_GET['page']) && $_GET['page'] === 'wc-orders'  &&  $pagenow === 'admin.php'
                       && isset( $_GET['slovakparcelservice_export_data'] ) && !empty($_GET['slovakparcelservice_export_data'])   && $query_args['parent'] === ''  )  {
            
            slovakparcelservice_data_export_common($_GET['slovakparcelservice_export_data'], 'admin.php');
        }
        
        return $query_args;
    }
    
   
    add_action( 'pre_get_posts', 'slovakparcelservice_data_export_cpt');
    function  slovakparcelservice_data_export_cpt($query ) {
            global $pagenow;
            if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil')  &&  ! OrderUtil::custom_orders_table_usage_is_enabled() &&  $query->is_admin && $query->is_main_query()  && $pagenow == 'edit.php' &&  $_GET['post_type'] == 'shop_order'
                && isset( $_GET['slovakparcelservice_export_data'] ) && !empty($_GET['slovakparcelservice_export_data']) ) {
                    
                    slovakparcelservice_data_export_common($_GET['slovakparcelservice_export_data'], 'edit.php' );
                }
    }
     
  
    function slovakparcelservice_data_export_common($data, $redir_page) {
        
        
        $sps_printing = array() ;
        $sps_printing['settings'] = urldecode($_GET[ 'sps_printingsettings']);
        $sps_printing['format'] = urldecode( $_GET['sps_printingformat']);
        $sps_printing['paper'] = urldecode( $_GET[ 'sps_paperformat']);
        $sps_printing['a4position'] = urldecode( $_GET['sps_a4position']);
        $sps_printing['pdfcontent'] = urldecode( $_GET['sps_pdfcontent']);
        $sps_printing['zplresolution'] = urldecode( $_GET[ 'sps_zplresolution']);
        
        // save sps_printing
        update_option('woocommerce_slovakparcelservice_printingsettings', $sps_printing['settings'],false);
        update_option('woocommerce_slovakparcelservice_printingformat', $sps_printing['format'],false);
        update_option('woocommerce_slovakparcelservice_paperformat', $sps_printing['paper'],false);
        update_option('woocommerce_slovakparcelservice_a4position', $sps_printing['a4position'],false);
        update_option('woocommerce_slovakparcelservice_pdfcontent', $sps_printing['pdfcontent'],false);
        update_option('woocommerce_slovakparcelservice_zplresolution', $sps_printing['zplresolution'],false);
                    
        //get webship api username and password
        $api_username = '';
        $api_password = '';
        
        $ship_meth = WC()->shipping->get_shipping_methods();

        if (! session_id()) {
            session_start();
        }
        
        //wc_get_logger()->debug('Shipping_methods  :: '  . var_export($ship_meth,true));
        
         //. check sps is enbaled ??
        foreach($ship_meth as $name =>  $method) {
            if ( $name != 'slovakparcelservice_pickupplace' && $name != 'slovakparcelservice_address' ) {
                continue;
            }
            $api_username = get_option('woocommerce_slovakparcelservice_apiusername');
            $api_password = get_option('woocommerce_slovakparcelservice_apipassword');
            break;
        }
         
        // store to session
        $result_data = array();
        $result_data['errors'] = array();
        $result_data['warnings'] = array();
        $result_data['infos'] = array();
                    
        // empty string or null
        if ( empty( $api_username) || empty( $api_password)) {
        
            $result_data['errors'][] = __('Export data to Slovak Parcel Service failed : missing API username or password.', 'slovakparcelservice');
              
            $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
            $params = array();
            foreach ($_GET as $key => $value) {
            
                if ( $key !== 'slovakparcelservice_export_data') {
                
                    if( $key === 'paged' && $value === '1' ){
                        continue;
                    }
                    $params[$key] = $value;
                }
            }
            $location = add_query_arg($params, $redir_page );
            wp_redirect( admin_url( $location ) );
            exit;
        }
        
        
        // check if already exported
        $order = wc_get_order($data);
        
        //$pdf_url =  get_post_meta( $order->get_id(), '_slovakparcelservice_label_url', true );
        $pdf_url = $order->get_meta('_slovakparcelservice_label_url');
        
        if ( empty($pdf_url) ) {
           
            // check for after export status - null do nothing , redir on invalid after status
            $after_status = null;
            if ( get_option('woocommerce_slovakparcelservice_statusexportswitch') === 'yes' ) {
                $after_status = get_option('woocommerce_slovakparcelservice_statusexport');
                if ( ! $after_status || !in_array($after_status, array_keys(wc_get_order_statuses()) )  ) {
                
                    $result_data['errors'][] = __('Export data to Slovak Parcel Service failed : after export status is not avalaible.', 'slovakparcelservice');
                    
                    $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
                    
                    $params = array();
                    foreach ($_GET as $key => $value) {
                    
                        if ( $key !== 'slovakparcelservice_export_data') {
                    
                            if( $key === 'paged' && $value === '1' ){
                                continue;
                            }
                            $params[$key] = $value;
                        }
                    }
                    $location = add_query_arg($params, $redir_page );
                    wp_redirect( admin_url( $location ) );
                    exit;
                }
            }
            
            // check if cod , order curecny and config mathes
            $is_cod = (int) $order->get_meta('_slovakparcelservice_is_cod');
            if ( $is_cod) {
                // get receiver country
                $order_type = $order->get_meta('_slovakparcelservice_type');
                if ( $order_type === 'PS' || $order_type === 'PT'  ) {
                    $country_deli =  $order->get_meta('_slovakparcelservice_pp_countryISO');
                }else {
                    $country_deli = $order->get_shipping_country();
                }
                $country_curr = ZipCityChecker::getCurrencyForCountry($country_deli);
                
                if ( $country_deli !== 'CZ' ) {
                    $cod_as_eur  = get_option('woocommerce_slovakparcelservice_codsending','no'); //def ot no
                }else {
                    $cod_as_eur  = get_option('woocommerce_slovakparcelservice_codsending_cz','no'); //def ot no
                }
                
                $order_curr =  $order->get_currency();
                
                $can_send_data = true ;
                
                // ( cudzia mena do EUR krajiny )
                if (  $order_curr !== "EUR" &&  $country_curr === 'EUR' ) {
                    $can_send_data = false;
                }
                
                // ( neeuro  ako euro  )
                if ( $order_curr !== "EUR" && $country_curr !== 'EUR' && $cod_as_eur ==='yes' ){
                    $can_send_data = false;
                }
                
                if ($country_curr !== 'EUR' && $cod_as_eur !=='yes' && $country_curr !==  $order_curr ){
                    $can_send_data = false;
                }
                
                // (neposielam ako EUR  do ne EUR)
                if ( $order_curr === "EUR" &&  $country_curr !== 'EUR' && $cod_as_eur !== 'yes' ) {
                    $can_send_data = false;
                }
                
                // only what can go wrong here is changed codsending option after order was created
                
                if ( ! $can_send_data ) {
                    $result_data['errors'][] = __('Export data to Slovak Parcel Service failed : wrong currency/cod sending setting.', 'slovakparcelservice');
                    
                    $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
                    
                    $params = array();
                    foreach ($_GET as $key => $value) {
                        
                        if ( $key !== 'slovakparcelservice_export_data') {
                            
                            if( $key === 'paged' && $value === '1' ){
                                continue;
                            }
                            $params[$key] = $value;
                        }
                    }
                    $location = add_query_arg($params, $redir_page );
                    wp_redirect( admin_url( $location ) );
                    exit;
                    
                }
                
            }
            
            // check numbe rof packages
            $num_packages = 1;
            
            if ( $order->get_meta('_slovakparcelservice_type' )  === 'ADDR') {
                
                if ( isset($_GET['slovakparcelservice_packages_' .  strval($data) ])  ) {
                 
                    $str_to_test = $_GET['slovakparcelservice_packages_' . strval($order->get_id())];
                                          
                    if ( !ctype_digit($str_to_test) || ($packages_count = intval($str_to_test)) == 0  ) {
                        $result_data['errors'][] = __('Export data to Slovak Parcel Service : incorrect count of packages', 'slovakparcelservice');
                        
                        $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
                        
                        $params = array();
                        foreach ($_GET as $key => $value) {
                            
                            if ( $key !== 'slovakparcelservice_export_data') {
                                
                                if( $key === 'paged' && $value === '1' ){
                                    continue;
                                }
                                $params[$key] = $value;
                            }
                        }
                        $location = add_query_arg($params, $redir_page );
                        wp_redirect( admin_url( $location ) );
                        exit;
                        
                    }else {
                        $num_packages = $packages_count;
                    }
                }
            }
            
            $ret = export_data($order->get_id() , $api_username, $api_password, $sps_printing, $after_status, $num_packages   );
            
            if (isset($ret['errors'][0] ) ) {
                $result_data['errors'][] =  __('Export data to Slovak Parcel Service failed for order', 'slovakparcelservice' ) . $ret['errors'][0];
            }
            if ( isset($ret['warnings'][0] ) ) {
                $result_data['warnings'][] = __('Export data to Slovak Parcel Service warning for order', 'slovakparcelservice' ) . $ret['warnings'][0];
            }
        } else {
            $result_data['infos'][] = __('Export data to Slovak Parcel Service : already exported', 'slovakparcelservice' ) . " : " . $order->get_id() ;
        }
        
        $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
        
        //redir shop_order
        
        $params = array();
        foreach ($_GET as $key => $value) {
        
            // remove slovakparcelservice_export_data from params
            if ( $key !== 'slovakparcelservice_export_data') {
            
                if( $key === 'paged' && $value === '1' ){
                    continue;
                }
                $params[$key] = $value;
            }
        }
        
        $location = add_query_arg($params, $redir_page );
        
        wp_redirect( admin_url( $location ) );
        exit;
    }
    

    // ### bulk export data in admin order list   https://stackoverflow.com/questions/52916661/process-custom-bulk-action-on-admin-orders-list-in-woocommerce
    add_filter( 'bulk_actions-edit-shop_order', 'slovakparcelservice_add_bulk_export' );
    add_filter( 'bulk_actions-woocommerce_page_wc-orders', 'slovakparcelservice_add_bulk_export' );  //HPOS DONE
    function slovakparcelservice_add_bulk_export($bulk_actions) {
        $bulk_actions['slovakparcelservice_bulk_export_data']  = __('Export SPS data', 'slovakparcelservice');
        return $bulk_actions;
    }

    
    // handle bulk action
    add_filter('handle_bulk_actions-edit-shop_order', 'slovakparcelservice_bulk_export_data', 10, 3 );
    add_filter('handle_bulk_actions-woocommerce_page_wc-orders','slovakparcelservice_bulk_export_data', 10, 3 );   //HPOS DONE
    function slovakparcelservice_bulk_export_data( $redirect_to, $action, $post_ids) {

        if (  $action !== 'slovakparcelservice_bulk_export_data') {
            return $redirect_to;
        }
        
        $sps_printing = array() ;
        $sps_printing['settings'] = urldecode($_GET[ 'sps_printingsettings']);
        $sps_printing['format'] = urldecode( $_GET['sps_printingformat']);
        $sps_printing['paper'] = urldecode( $_GET[ 'sps_paperformat']);
        $sps_printing['a4position'] = urldecode( $_GET['sps_a4position']);
        $sps_printing['pdfcontent'] = urldecode( $_GET['sps_pdfcontent']);
        $sps_printing['zplresolution'] = urldecode( $_GET[ 'sps_zplresolution']);
        
        // save sps_printing
        update_option('woocommerce_slovakparcelservice_printingsettings', $sps_printing['settings'],false);
        update_option('woocommerce_slovakparcelservice_printingformat', $sps_printing['format'],false);
        update_option('woocommerce_slovakparcelservice_paperformat', $sps_printing['paper'],false);
        update_option('woocommerce_slovakparcelservice_a4position', $sps_printing['a4position'],false);
        update_option('woocommerce_slovakparcelservice_pdfcontent', $sps_printing['pdfcontent'],false);
        update_option('woocommerce_slovakparcelservice_zplresolution', $sps_printing['zplresolution'],false);
        
        // iter over post_ids , check if is sps  and not exported yet then export
        
        //get webship api username and password
        $api_username = '';
        $api_password = '';
                
        $ship_meth = WC()->shipping->get_shipping_methods();
        
        foreach($ship_meth as $name =>  $method) {
            // api config is in parent , call parent
            if ( $name === 'slovakparcelservice_pickupplace' ||  $name === 'slovakparcelservice_address' ) {
                $api_username = get_option('woocommerce_slovakparcelservice_apiusername');
                $api_password = get_option('woocommerce_slovakparcelservice_apipassword');
                break;
            }
        }
        
        $result_data = array();
        
        $result_data['errors'] = array();
        $result_data['warnings'] = array();
        $result_data['infos'] = array();
        
        if ( empty( $api_username) || empty( $api_password)) {
            
            $result_data['errors'][] = __('Export data to Slovak Parcel Service failed : missing API username or password.', 'slovakparcelservice');
            
            if (! session_id()) {
                session_start();
            }
            $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
            
            return $redirect_to;
        }
        
        // check for after export status - null do nothing
        $after_status = null;
        if ( get_option('woocommerce_slovakparcelservice_statusexportswitch') === 'yes' ) {
            
            $after_status = get_option('woocommerce_slovakparcelservice_statusexport');
            if ( ! $after_status || !in_array($after_status, array_keys(wc_get_order_statuses()) )  ) {
                
                $result_data['errors'][] = __('Export data to Slovak Parcel Service failed : after export status is not avalaible.', 'slovakparcelservice');
               
                if (! session_id()) {
                    session_start();
                }
                $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
                
                return $redirect_to;
            }
        }
        
        //check all orders and filter out
        // check
        $check_export = false;
        $stats = array();
        
        if ( get_option('woocommerce_slovakparcelservice_statusesswitch') === 'yes' ) {
            $check_export = true;
            $stats = get_option('woocommerce_slovakparcelservice_statuses');
            if ( ! is_array($stats)){
                $stats = array();
            }
        }
        
        
        $cod_as_eur_all  = get_option('woocommerce_slovakparcelservice_codsending','no'); //def or no
        $cod_as_eur_cz  = get_option('woocommerce_slovakparcelservice_codsending_cz','no'); //def or no
        
        
        $orders_packages_count =  array();
        
        
        for ( $i = count($post_ids) - 1 ; $i >= 0 ; $i-- ) {
         
            $order = wc_get_order($post_ids[$i]);
            
            if ($check_export) {
                $status = "wc-" . $order->get_status();
                if ( !in_array($status, $stats)) {
                    $result_data['infos'][] = __('Export data to Slovak Parcel Service : NOT in state for export', 'slovakparcelservice' ) . " : $post_ids[$i]";
                    array_splice($post_ids, $i,1);
                    continue;
                }
            }
           // if ( ! metadata_exists('post', $order->get_id(), '_slovakparcelservice_label_url')  ) {
           if ( ! $order->meta_exists('_slovakparcelservice_label_url')  ) {
            
                $result_data['infos'][] = __('Export data to Slovak Parcel Service : NOT Slovak Parcel Service delivery', 'slovakparcelservice' ) . " : $post_ids[$i]";
                array_splice($post_ids, $i,1);
                continue;
            }
            //$pdf_url =  get_post_meta( $order->get_id(), '_slovakparcelservice_label_url', true );
            $pdf_url = $order->get_meta('_slovakparcelservice_label_url');
            if ( ! empty($pdf_url)) {
                $result_data['infos'][] = __('Export data to Slovak Parcel Service : already exported', 'slovakparcelservice' ) . " : $post_ids[$i] ";
                array_splice($post_ids, $i,1);
                continue;
            }
            
            // check codsendign vs oder currency  vs country currency
            $is_cod = (int) $order->get_meta('_slovakparcelservice_is_cod');
            if ( $is_cod) {
                // get receiver country
                $order_type = $order->get_meta('_slovakparcelservice_type');
                if ( $order_type === 'PS' || $order_type === 'PT'  ) {
                    $country_deli =  $order->get_meta('_slovakparcelservice_pp_countryISO');
                }else {
                    $country_deli = $order->get_shipping_country();
                }
                
                if ( $country_deli !== 'CZ') {
                    $cod_as_eur = $cod_as_eur_all;
                }else {
                    $cod_as_eur = $cod_as_eur_cz;
                }
                
                $country_curr = ZipCityChecker::getCurrencyForCountry($country_deli);
                $order_curr =  $order->get_currency();
                $can_send_data = true ;
                
                // ( cudzia mena do EUR krajiny )
                if (  $order_curr !== "EUR" &&  $country_curr === 'EUR' ) {
                    $can_send_data = false;
                }
                
                // ( neeuro  ako euro  )
                if ( $order_curr !== "EUR" && $country_curr !== 'EUR' && $cod_as_eur ==='yes' ){
                    $can_send_data = false;
                }
                
                if ($country_curr !== 'EUR' && $cod_as_eur !=='yes' && $country_curr !==  $order_curr ){
                    $can_send_data = false;
                }
                
                // (neposielam ako EUR  do ne EUR)
                if ( $order_curr === "EUR" &&  $country_curr !== 'EUR' && $cod_as_eur !== 'yes' ) {
                    $can_send_data = false;
                }
                
                // only what can go wrong here is changed codsending option after order was created
                
                if ( ! $can_send_data ) {
                    $result_data['infos'][] = __('Export data to Slovak Parcel Service failed : wrong currency/cod sending setting.', 'slovakparcelservice');
                    array_splice($post_ids, $i,1);
                    continue;
                }
            }
            //check packgae count
            if ( $order->get_meta('_slovakparcelservice_type')  !== 'ADDR' ) {
                array_unshift( $orders_packages_count, 1);
            }else {
                //check $_GET
                if ( !isset ( $_GET['slovakparcelservice_packages_' . strval($order->get_id())])) {
                    array_unshift( $orders_packages_count, 1);
                }else {
                    $str_to_test = $_GET['slovakparcelservice_packages_' . strval($order->get_id())];
                    # check  if it's int string
                    if ( !ctype_digit($str_to_test) || ($packages_count = intval($str_to_test)) === 0  ){
                        $result_data['infos'][] = __('Export data to Slovak Parcel Service : incorrect count of packages', 'slovakparcelservice' ) . " : $post_ids[$i] ";
                        array_splice($post_ids, $i,1);
                        continue;
                    }else {
                        array_unshift( $orders_packages_count, $packages_count );
                    }
                }
            }
        }
        
        if ( count($post_ids) === 0 ) {
            $result_data['infos'][] = __('Export data to Slovak Parcel Service : no shipment(s) for export', 'slovakparcelservice' );
            if (! session_id()) {
                session_start();
            }
            $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
            return $redirect_to;
        }
        
        
        $res = export_data($post_ids , $api_username, $api_password, $sps_printing, $after_status, $orders_packages_count);
        
        foreach( $res['errors'] as $err) {
            $result_data['errors'][] = __('Export data to Slovak Parcel Service failed for order', 'slovakparcelservice' ) . " {$err}";
        }
        foreach($res['warnings'] as $warn){
            $result_data['warnings'][] = __('Export data to Slovak Parcel Service warning for order', 'slovakparcelservice' ) . " {$warn}";
        }
        
        if (! session_id()) {
            session_start();
        }
        $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
        
        return $redirect_to;
    }
    
    // display result  -  HPOS
    add_action( 'admin_notices', 'slovakparcelservice_bulk_export_data_notice' );
    function slovakparcelservice_bulk_export_data_notice() {
        global $pagenow;
        
        
        $is_page = false ;
        // HPOS TEST
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') && OrderUtil::custom_orders_table_usage_is_enabled() ) {
           
            if( 'admin.php' === $pagenow && isset($_GET['page']) && 'wc-orders' === $_GET['page'] ) {
                $is_page = true;
            }
        }else {
            if ( 'edit.php' === $pagenow && isset($_GET['post_type']) && 'shop_order' === $_GET['post_type'] ) {
                $is_page = true;
            }
        }
        
        if ( $is_page ) {
            
            //&& ( isset($_GET['slovakparcelservice_bulk_export_data'] )
            //||  isset($_GET["slovakparcelservice_export_data"])  )  ) {
                
                // check session data
                $results = array();
                if (! session_id()) {
                    session_start();
                }
                
                if (  isset($_SESSION['slovakparcelservice_bulk_export_results']) ) {
                    $results = $_SESSION['slovakparcelservice_bulk_export_results'];
                    unset( $_SESSION['slovakparcelservice_bulk_export_results']);
                }else {
                    return;
                }
                
                // iter over errors
                if ( count ($results['errors'] ) > 0 ) {
                     $err_html = $results['errors'][0];
                     for( $i = 1 ; $i < count ($results['errors']); $i++ ) {
                         $err_html .= '<br>' . $results['errors'][$i];
                     }
                     echo '<div class="notice notice-error is-dismissible"><p>' . $err_html .'</p></div>';
                }
                
                // iter over warning
                if ( count ($results['warnings'] )  > 0  ) {
                    $warn_html = $results['warnings'][0];
                    for ( $i = 1 ; $i < count ($results['warnings'] ) ; $i++ ) {
                        $warn_html .=  '<br>' . $results['warnings'][$i];
                    }
                    echo '<div class="notice notice-warning is-dismissible"><p>' . $warn_html .'</p></div>';
                }
                if ( count ($results['infos'] )  > 0  ) {
                    $info_html = $results['infos'][0];
                    for ( $i = 1 ; $i < count ($results['infos'] ) ; $i++ ) {
                        $info_html .=  '<br>' . $results['infos'][$i];
                    }
                    echo '<div class="notice notice-info is-dismissible"><p>' . $info_html .'</p></div>';
                }
        }
        
    }
    
    
    // input order object api username and password
    /**
     *
     * @param array $order |order_ids
     * @param string $api_username
     * @param string $api_password
     * @return
     */
    function export_data($order_ids, $api_username, $api_password, $sps_printing, $after_status = null, $order_package_count   ) {
     
        $webshipClient = new SPS\Webship\Webservice\WebshipWebserviceClient($api_username, $api_password);
        
        //change to array ids and package count
        if ( !is_array( $order_ids) ) {
            $order_ids = array($order_ids);
            $order_package_count = array($order_package_count);
        }
        
        $shipping_ins_arr = array(); // key shipping_instuance id , arr true if custom  + value  value
        
        
        $shipping_class_names =  WC()->shipping->get_shipping_method_class_names();
        
        for ( $j = 0 ; $j < count($order_ids) ; $j ++) {
            
            $order = wc_get_order($order_ids[$j]);
            
            
            //  insurance
            $shipping_method = reset($order->get_shipping_methods());
            
            // save for later
            $shipping_method_inst_id =  $shipping_method->get_instance_id();
            
            // add to array
            if ( ! array_key_exists( $shipping_method_inst_id, $shipping_ins_arr )) {
            
                $shipping_inst = new $shipping_class_names[$shipping_method->get_method_id()]($shipping_method_inst_id );
            
                $insur_custom  = $shipping_inst->get_instance_option('insurance_custom');
                $insur_val =  $shipping_inst->get_instance_option('insurance_value');  // if not set use order value
                if ( $insur_custom !== "yes" || $insur_val === '' ) {
                    $insur_custom = false ;
                }else {
                    $insur_custom = true ;
                    $insur_val = (float)$insur_val;
                }
                $shipping_ins_arr[$shipping_method_inst_id] = array('cust' => $insur_custom, 'value' => $insur_val );
            }
            
            
            $shipment = $webshipClient->createWebserviceShipment();
            
            //shipping phone or get billing phone
            // $phone =  $order->get_shipping_phone();  // always empty ???
            // support for older versions of WC
            $phone = is_callable( [ $order, 'get_shipping_phone' ] ) ? $order->get_shipping_phone() : $order->get_meta( '_shipping_phone', true );
            if ( empty($phone)) {
                $phone = $order->get_billing_phone();
            }
        
            $email = $order->get_billing_email();
            //  meta data
            $ps_name = '';
            $ps_addr = '';
            $ps_zip = '';
            $ps_city = '';
            $ps_type = '';
            $ps_countryISO = '';
            $ps_is_cod = '';
        
            $ps_type = $order->get_meta('_slovakparcelservice_type');
            
            if ( $ps_type !== 'ADDR' ) {
                
                $ps_name = $order->get_meta('_slovakparcelservice_pp_name');
                $ps_addr = $order->get_meta('_slovakparcelservice_pp_address');
                $ps_zip  = $order->get_meta('_slovakparcelservice_pp_zip');
                $ps_city = $order->get_meta('_slovakparcelservice_pp_city');
                $ps_countryISO = $order->get_meta('_slovakparcelservice_pp_countryISO');
                
                if ( $ps_type === 'PS' ) {
                    $webshipClient->setShipmentToPS($shipment);
                }else if ($ps_type === 'PT') {
                    $webshipClient->setShipmentToPT($shipment);
                }
            
            } else {
                 // get addr info from
                $ps_addr = $order->get_shipping_address_1();
                $addr2 = $order->get_shipping_address_2();
                if ( $addr2 !== null && $addr2 !== '') {
                    $ps_addr = $ps_addr ." \n" . $addr2;
                }
                $ps_city = $order->get_shipping_city();
                
                // RECHECK POSTCODE ( wc changes postcode for PL )
                $ps_zip = $order->get_shipping_postcode();
                //remove all non aphanum
                $ps_zip = preg_replace( '/[\W]/', '',  $ps_zip);
                
                // use company else contact
                $company = $order->get_shipping_company();
                if ( $company !== null && $company !== '') {
                    $ps_name = $company;
                } else {
                    $ps_name = $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name();
                }
                
               // woocommerc uses ISO
               $ps_countryISO =  $order->get_shipping_country();
               
            }
            
            $ps_is_cod = $order->get_meta('_slovakparcelservice_is_cod');
            
            
            //	$city, $zip, $country, $street, $name, $contactPerson, $mobile, $email
            $webshipClient->setShipmentReceiverAddress($shipment, $ps_city, $ps_zip, $ps_countryISO, $ps_addr, $ps_name,
                                           $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name(), $phone, $email );
        
            
            if ($shipping_ins_arr[$shipping_method_inst_id]['cust'] ) {
                $webshipClient->setShipmentInsurValue($shipment, strval($shipping_ins_arr[$shipping_method_inst_id]['value']));
            }else {
                $webshipClient->setShipmentInsurValue($shipment ,strval($order->get_total()));
            }
            // add support for plugins that implements filter "woocommerce_order_number"  ex Sequential Order Numbers for WooCommerce
           
            // set number of packages
            if ($order_package_count[$j] === 1 ) {
                $webshipClient->addShipmentPackage($shipment,strval( $order->get_order_number()), "1.00");
            }else {
                for ( $c = 1 ; $c <= $order_package_count[$j] ; $c++) {
                    $webshipClient->addShipmentPackage($shipment, strval( $order->get_order_number()) ."-" . strval($c) , "1.00");
                }
            }
       
            // if country != SK  set service export
             if ($ps_countryISO !== 'SK' ) {
                 $webshipClient->setShipmentServiceName($shipment, \SPS\Webship\Webservice\serviceName::EXPORT);
             }
            
             
             //notify
             $emailnotification = get_option('woocommerce_slovakparcelservice_emailnotification');
             $smsnotification = get_option('woocommerce_slovakparcelservice_smsnotification');
             
             // check if country has notify enabled
             if ( ZipCityChecker::getNotyfiForCountry($ps_countryISO)) {
                
                 if ( $emailnotification === "yes"){
                    $webshipClient->setShipmentEmailNotify($shipment);
                 }
            
                 if ( $ps_type === 'ADDR' && $smsnotification === "yes" ) {
                    $webshipClient->setShipmentSMSNotify($shipment);
                }
             }
             
             // phone notification
             if ($ps_type === 'ADDR' && get_option('woocommerce_slovakparcelservice_phonenotification') === "yes" ){
                 $webshipClient->setShipmentPhoneNotify($shipment);
             }
             
    
             // COD use meta data or fallback (  backward compability )
             if ( ( isset($ps_is_cod ) && $ps_is_cod === '1') || ( ( ! isset( $ps_is_cod) || $ps_is_cod === '0' )  && $order->get_payment_method() == 'cod' ) ) {
                $webshipClient->setShipmentCod($shipment, $order->get_total());
            }
            $webshipClient->addShipmentToList($shipment);
            
        }
        
        //$sps_printing
        if ( $sps_printing['settings'] === 'custom') {
            
            if ( $sps_printing['format'] === 'zpl') {
                $webshipClient->setPrintingSettingsFileFormat(\SPS\Webship\Webservice\fileFormat::ZPL);
                //def 200
                if ( $sps_printing['zplresolution'] == 'dpi_300') {
                    $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_300);
                }else if ($sps_printing['zplresolution'] == 'dpi_600') {
                    $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_600);
                }else {
                    $webshipClient->setPrintingSettingsZplResolution(\SPS\Webship\Webservice\zplResolution::DPI_204);
                }
            }else {
                $webshipClient->setPrintingSettingsFileFormat(\SPS\Webship\Webservice\fileFormat::PDF);
                
                //content def pdf
                if ( $sps_printing['pdfcontent'] === 'bitmap') {
                    $webshipClient->setPrintingSettingsPdfContentFormat(\SPS\Webship\Webservice\pdfContentFormat::BITMAP);
                }else {
                    $webshipClient->setPrintingSettingsPdfContentFormat(\SPS\Webship\Webservice\pdfContentFormat::PDF);
                }
                
                //paper  a4 a6 termal
                if ( $sps_printing['paper'] === "a6") {
                    $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::A6);
                }else if ($sps_printing['paper'] === "thermal_58") {
                    $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::THERMAL_58);
                }else {
                    $webshipClient->setPrintingSettingsPaperFormat(\SPS\Webship\Webservice\paperFormat::A4);
                    
                    //a4 position def 1
                    if ( $sps_printing['a4position'] === "2") {
                        $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P2);
                    }else if ( $sps_printing['a4position'] === "3") {
                        $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P3);
                    }else if ( $sps_printing['a4position'] === "4") {
                        $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P4);
                    } else {
                        $webshipClient->setPrintingSettingsPrintFromPos(\SPS\Webship\Webservice\printFromPos::P1);
                    }
                }
                
                
            }
        }
        
        $ret = array();
        $ret['errors'] = array();
        $ret['warnings'] = array();
        
        if ( count($webshipClient->shipments) === 1) {
      
            $resp = null;
            
            if ($webshipClient->printingSettings === null  ) {
                $resp = $webshipClient->createAndPrintCifShipment();
            }else {
                $resp = $webshipClient->createAndPrintCifShipmentWithSettings2();
            }
            
            if ( ! $resp->hasErrors() ) {
                $order = wc_get_order($order_ids[0]);
                
                $order->update_meta_data('_slovakparcelservice_label_url', $resp->getDocumentUrl() );
                
                if($after_status !== null ) {
                    $order->set_status($after_status);
                }
                $order->save();
            } else {
        
                $ret['errors'][] = "{$order_ids[0]} : " . $resp->getErrors();
            }
            if ( $resp->hasWarnings() ) {
         
                $ret['warnings'][] = "{$order_ids[0]} : " . $resp->getWarnings();
            }
        } else {
            $resp = $webshipClient->createCifShipments();
            $resp2 = null;
            if ($webshipClient->printingSettings === null  ) {
                $resp2 = $webshipClient->printShipmentLabels();
            }else {
                $resp2 = $webshipClient->printLabelsWithSettings();
            }
            
            //array of $resp
            // iter over and finde failed and non failed , update non failed
            for ( $i = 0 ; $i < count($resp) ; $i++ ) {
                
                if (! $resp[$i]->hasErrors() ) {
                    $order = wc_get_order($order_ids[$i]);
                    $order->update_meta_data('_slovakparcelservice_label_url', $resp2->getDocumentUrl() );
                   
                    if($after_status !== null ) {
                        $order->set_status($after_status);
                    }
                    $order->save();
                }  else {
                    $ret['errors'][] = "{$order_ids[$i]} : " . $resp[$i]->getErrors();
                }
                if ( $resp[$i]->hasWarnings()) {
                    $ret['warnings'][] = "{$order_ids[$i]} : " . $resp[$i]->getWarnings();
                }
            }
        }
        
        return $ret;
    }
    
    
    // ### add custom filter to header of admin order list table
    add_action( 'woocommerce_order_list_table_restrict_manage_orders', 'slovakparcelservice_order_filter_hpos', 10, 2);  //  HPOS
    function slovakparcelservice_order_filter_hpos($type,$which) {
        global $pagenow;
        
        // $which == top,  $type  == shop-order
        
        if ( $pagenow === "admin.php") {
      
            if ( isset( $_GET['slovakparcelservice_order_filter'])){
                
                echo '<span class="actions button"  style="color:#3c434a;" ><label class="actions" for="slovakparcelservice_order_filter">'.  __("Slovak Parcel Service orders only", 'slovakparcelservice' ) .'</label><input type="checkbox" style="height: 1rem;"  id="slovakparcelservice_order_filter" name="slovakparcelservice_order_filter" checked value="slovakparcelservice_order_filter"></span>';
                
            }else {
                echo '<span class="actions button"  style="color:#3c434a;" ><label class="actions" for="slovakparcelservice_order_filter">'.  __("Slovak Parcel Service orders only", 'slovakparcelservice' ) .'</label><input type="checkbox" style="height: 1rem;" id="slovakparcelservice_order_filter" name="slovakparcelservice_order_filter" value="slovakparcelservice_order_filter"></span>';
            }
        }
    }
    
    
    add_action( 'restrict_manage_posts', 'slovakparcelservice_order_filter' );
    function slovakparcelservice_order_filter() {
        global $pagenow, $post_type;
        if ('shop_order' === $post_type && 'edit.php' === $pagenow ) {
            if ( isset($_GET['slovakparcelservice_order_filter'] )) {
                echo '<span class="actions button"  style="color:#3c434a;" ><label class="actions" for="slovakparcelservice_order_filter">'.  __("Slovak Parcel Service orders only", 'slovakparcelservice' ) .'</label><input type="checkbox" style="height: 1rem;"  id="slovakparcelservice_order_filter" name="slovakparcelservice_order_filter" checked value="slovakparcelservice_order_filter"></span>';
            } else {
                echo '<span class="actions button"  style="color:#3c434a;" ><label class="actions" for="slovakparcelservice_order_filter">'.  __("Slovak Parcel Service orders only", 'slovakparcelservice' ) .'</label><input type="checkbox" style="height: 1rem;" id="slovakparcelservice_order_filter" name="slovakparcelservice_order_filter" value="slovakparcelservice_order_filter"></span>';
            }
        }
    }
    
    //filter HPOS
    add_action('woocommerce_order_query_args','apply_slovakparcelservice_order_filter_hpos');
    function apply_slovakparcelservice_order_filter_hpos($query_args) {
        global $pagenow;
        
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') && OrderUtil::custom_orders_table_usage_is_enabled() && isset($_GET['page']) && $_GET['page'] === 'wc-orders'  &&  $pagenow === 'admin.php'  && isset( $_GET['slovakparcelservice_order_filter'] ) )  {
            
            $query_args['meta_key'] =  '_slovakparcelservice_type' ;
        }
        return $query_args;
    }
        
    
    // filter  non HPOS
    add_action( 'request', 'apply_slovakparcelservice_order_filter');
    function apply_slovakparcelservice_order_filter($vars) {
        global $pagenow, $typenow;
        
        if (class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&  !  OrderUtil::custom_orders_table_usage_is_enabled() &  $pagenow === 'edit.php' && 'shop_order' === $typenow  && isset( $_GET['slovakparcelservice_order_filter'] ) ) {
            $vars['meta_key'] =  '_slovakparcelservice_type' ;
        }
        
        return $vars;
    }
   

    // printing settings + end of day button
    add_action ('woocommerce_order_list_table_extra_tablenav', 'slovakparcelservice_extra_tablenav',10,2 );
    function slovakparcelservice_extra_tablenav($type, $which) {
        
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&   OrderUtil::custom_orders_table_usage_is_enabled() &&  'shop_order' === $type && 'top' === $which ) {
            
            // form name
            slovakparcelservice_extra_tablenav_common('wc-orders-filter');
        }
    }

    // ###   add custom EndOfDay button above  order table
    add_action( 'manage_posts_extra_tablenav', 'slovakparcelservice_endofday_button', 20, 1 );
    function slovakparcelservice_endofday_button($which) {
        global $typenow;
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&  !  OrderUtil::custom_orders_table_usage_is_enabled() && 'shop_order' === $typenow && 'top' === $which ) {
            
            slovakparcelservice_extra_tablenav_common('posts-filter');
        }
    }
    
    function slovakparcelservice_extra_tablenav_common($form) {
     
        $printingsettings = get_option('woocommerce_slovakparcelservice_printingsettings');
        $printingformat = get_option('woocommerce_slovakparcelservice_printingformat');
        $paperformat = get_option('woocommerce_slovakparcelservice_paperformat');
        $a4position = get_option('woocommerce_slovakparcelservice_a4position');
        $pdfcontent = get_option('woocommerce_slovakparcelservice_pdfcontent');
        $zplresolution = get_option('woocommerce_slovakparcelservice_zplresolution');
       
         $output = "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\"><div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_printingsettings\" name=\"sps_printingsettings\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('Printing Settings','slovakparcelservice') ."\">";
         if ($printingsettings === 'custom') {
             $output .= '<option value="webship" >' . __("Webship settings",'slovakparcelservice') . '</option>
                      <option value="custom" selected>' .  __("Custom settings",'slovakparcelservice') . '</option></select></div>';
         }else {
             $output .= '<option value="webship" selected>' . __("Webship settings",'slovakparcelservice') . '</option>
                        <option value="custom">' .  __("Custom settings",'slovakparcelservice') . '</option></select></div>';
         }
         // printing format
         $output .= "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_printingformat\" name=\"sps_printingformat\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('Printing Format','slovakparcelservice') ."\">";
         if ($printingformat === 'zpl') {
             $output .= '<option value="pdf">PDF</option>
                      <option value="zpl" selected>ZPL</option></select></div>';
         }else {
             $output .= '<option value="pdf" selected>PDF</option>
                        <option value="zpl">ZPL</option></select></div>';
         }
         // paperformat
         $output .= "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_paperformat\" name=\"sps_paperformat\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('Paper Format','slovakparcelservice') ."\">";
         if ( $paperformat === 'a6'){
             $output .= '<option value="a4">A4</option><option value="a6" selected>A6</option>
                      <option value="thermal_58" >'.__('Thermal 58mm','slovakparcelservice') .'</option></select></div>';
             
         }else if ($paperformat === 'thermal_58') {
             $output .= '<option value="a4">A4</option><option value="a6">A6</option>
                      <option value="thermal_58" selected>'.__('Thermal 58mm','slovakparcelservice').'</option></select></div>';
         }else {
             $output .= '<option value="a4" selected>A4</option><option value="a6">A6</option>
                      <option value="thermal_58">'.__('Thermal 58mm','slovakparcelservice').'</option></select></div>';
         }
         // a4position
         $output .= "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_a4position\" name=\"sps_a4position\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('A4 Start Position','slovakparcelservice') ."\">";
         if ( $a4position === "2" ) {
             $output .= '<option value="1">1</option><option value="2" selected>2</option>
                      <option value="3">3</option><option value="4">4</option></option></select></div>';
         }else if ($a4position === "3") {
             $output .= '<option value="1">1</option><option value="2">2</option>
                      <option value="3" selected>3</option><option value="4">4</option></option></select></div>';
         }else if ($a4position === "4") {
             $output .= '<option value="1">1</option><option value="2">2</option>
                      <option value="3">3</option><option value="4" selected>4</option></option></select></div>';
         }else {
             $output .= '<option value="1" selected>1</option><option value="2">2</option>
                      <option value="3">3</option><option value="4">4</option></option></select></div>';
         }
         // pdfcontent
         $output .= "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_pdfcontent\" name=\"sps_pdfcontent\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('PDF Content','slovakparcelservice') ."\">";
         if ( $pdfcontent === "bitmap") {
             $output .= '<option value="pdf">'.__("Native PDF",'slovakparcelservice').'</option><option value="bitmap" selected>'.__("Bitmap",'slovakparcelservice').'</option></select></div>';
         }else {
             $output .= '<option value="pdf" selected>'.__("Native PDF",'slovakparcelservice').'</option><option value="bitmap">'.__("Bitmap",'slovakparcelservice').'</option></select></div>';
         }
         // zplresolution
         $output .= "<div class=\"actions custom\" style=\"display:inline-block;width:auto;\">".
             "<select id=\"sps_zplresolution\" name=\"sps_zplresolution\" form=\"". $form . "\" title=\"SlovakParcelService&#10;" . __('ZPL Resolution','slovakparcelservice') ."\">";
         if ($zplresolution === "dpi_300" ) {
             $output .= '<option value="dpi_204">204 DPI</option><option value="dpi_300" selected>300 DPI</option><option value="dpi_600">600 DPI</option></select></div>';
         }else if ($zplresolution === "dpi_600") {
             $output .= '<option value="dpi_204">204 DPI</option><option value="dpi_300">300 DPI</option><option value="dpi_600" selected>600 DPI</option></select></div>';
         }else {
             $output .= '<option value="dpi_204" selected>204 DPI</option><option value="dpi_300">300 DPI</option><option value="dpi_600">600 DPI</option></select></div>';
         }
         
         // button End of Day
        $output .= "<div class=\"alignleft actions custom\">
            <button type=\"submit\" name=\"slovakparcelservice_endofday\" style=\"height:32px;display:inline-block;width:auto;\" class=\"button\" value=\"slovakparcelservice_endofday\">" .
                 __( 'Generate SPS EndOfDay', 'slovakparcelservice' ) ." </button></div>";
         
         $output .= "</div>";
         echo $output;
        
    }
    
    //END OF DAY  HPOS
    add_action('woocommerce_order_list_table_restrict_manage_orders' , 'slovakparcelservice_endofday_hpos',10,2 );   //HPOS
    function slovakparcelservice_endofday_hpos($type, $which) {
        global $pagenow, $typenow;
    
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&  OrderUtil::custom_orders_table_usage_is_enabled() &&  $pagenow === 'admin.php' && isset($_GET['page'] ) &&  $_GET['page'] === 'wc-orders'  &&  isset($_GET['slovakparcelservice_endofday'])) {
            slovakparcelservice_endofday_common('admin.php');
        }
    }
    
    
    add_action( 'restrict_manage_posts', 'slovakparcelservice_endofday' );
    function slovakparcelservice_endofday() {
        global $pagenow, $typenow;
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&  !  OrderUtil::custom_orders_table_usage_is_enabled() &&  'shop_order' === $typenow && 'edit.php' === $pagenow && isset($_GET['slovakparcelservice_endofday'])) {
            
            slovakparcelservice_endofday_common('edit.php');
        }
    }
    
    function slovakparcelservice_endofday_common($page){
        
            $api_username = '';
            $api_password = '';
            
            $api_username = get_option('woocommerce_slovakparcelservice_apiusername');
            $api_password = get_option('woocommerce_slovakparcelservice_apipassword');
                
            $result_data = array();
            $result_data['errors'] = array();
            $result_data['warnings'] = array();
            $result_data['infos'] = array();
            // empty string or null
            if ( empty( $api_username) || empty( $api_password)) {
                    
                $result_data['errors'][] = __('Slovak Parcel Service EndOfDay failed : missing API username or password.', 'slovakparcelservice');
                    
                if (! session_id()) {
                    session_start();
                }
                $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;
                $params = array();
                foreach ($_GET as $key => $value) {
                    if ( $key !== 'slovakparcelservice_endofday') {
                        if( $key === 'paged' && $value === '1' ){
                            continue;
                        }
                        $params[$key] = $value;
                    }
                }
                $location = add_query_arg($params, $page );
                wp_redirect( admin_url( $location ) );
                exit;
            }
                
            $webshipClient = new SPS\Webship\Webservice\WebshipWebserviceClient($api_username, $api_password);
            $resp = $webshipClient->printEndOfDay();
            
            
            if ( $resp->hasErrors() ) {
                //save to session
                if (! session_id()) {
                    session_start();
                }
                $result_data['errors'][] =  __('Slovak Parcel Service EndOfDay failed : ', 'slovakparcelservice') . $resp->getErrors();
                $_SESSION['slovakparcelservice_bulk_export_results'] = $result_data;

            }else {
                $url = $resp->getDocumentUrl();
                
                // update all order that has label url but no endof day url  // TODO HOPS NOT SAME
                
                if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil') &&   OrderUtil::custom_orders_table_usage_is_enabled() ) {
                
                    $orders = wc_get_orders(
                        array(
                            'type' => 'shop_order',
                            'limit' => -1,
                            'return' => 'ids',
                            'meta_query' => array(
                                array( 'key' => '_slovakparcelservice_label_url', 'compare' => '!=', 'value' => ''),
                                array( 'key'=> '_slovakparcelservice_endofday_url', 'compare' => '=', 'value' => '')
                            )
                        )
                    );
                }else {
                    $orders = wc_get_orders(
                        array(
                            'type' => 'shop_order',
                            'limit' => -1,
                            'return' => 'ids',
                            '_slovakparcelservice_label_url' => array('compare' => '!=', 'value' => ''),
                            '_slovakparcelservice_endofday_url' => array('compare' => '=', 'value' => '')
                        )
                    );
                }
                
                foreach ( $orders as $order_id) {
                    
                    $order = wc_get_order($order_id);
                    $order->update_meta_data('_slovakparcelservice_endofday_url', $url );
                    $order->save();
                }
            }
            
            //redir
            $params = array();
            foreach ($_GET as $key => $value) {
             
                if ( $key !== 'slovakparcelservice_endofday') {
                    
                    if( $key === 'paged' && $value === '1' ){
                        continue;
                    }
                    $params[$key] = $value;
                }
            }
            
            $location = add_query_arg($params, $page );
            wp_redirect( admin_url( $location ) );
            exit;
        
    }
    
    // add support custom params in wc_get_order()  no HPOS
    //  queryvars array of array
    add_filter( 'woocommerce_order_data_store_cpt_get_orders_query', 'handle_custom_query_var', 10, 2 );
    function handle_custom_query_var( $query, $query_vars ) {
        
        $vars_array = ['_slovakparcelservice_label_url',
                       '_slovakparcelservice_endofday_url',
                       '_slovakparcelservice_type',
                       '_slovakparcelservice_is_cod',
                       '_slovakparcelservice_pp_countryISO' ];
   
       foreach( $vars_array as $var) {
            if ( ! empty( $query_vars[$var] ) ) {
                
                // value not mandatory
                
                if ( isset(  $query_vars[$var]['value']) ) {
                
                    $query['meta_query'][] = array(
                        'key' => $var,
                        'compare' => esc_attr( $query_vars[$var]['compare'] ),
                        'value' => esc_attr( $query_vars[$var]['value'] )
                    );
                }else {
                    $query['meta_query'][] = array(
                        'key' => $var,
                        'compare' => esc_attr( $query_vars[$var]['compare'] )
                    );
                }
            }
        }
        
        return $query;
    }
       
 
    
    
    //////////////////////////////////
    
    // filter out  slovakparcelservice shipping methods  if not supported delivery country is selected  ( for now )
    add_filter( 'woocommerce_package_rates', 'slovakparcelservice_shipping_method_filter', 10, 2 );
    function slovakparcelservice_shipping_method_filter( $available_shipping_methods, $package ) {
        
    
        // get cart currency
        $shop_currency = get_woocommerce_currency();
        
        $state = WC()->customer->get_shipping_country();
        
       
        foreach (  $available_shipping_methods as $key => $rate ) {
            $shipping_class = explode(":", $key)[0];
            
            if ($shipping_class === 'slovakparcelservice_pickupplace' ) {
                
                //$shipping = new WC_SlovakParcelService_PickupPlace_Shipping_Method( $rate ->get_instance_id() );
                
                $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
                $shipping = new $shipping_class_names[$shipping_class]($rate ->get_instance_id());
                
                $currency = $shipping->get_instance_option('currency');
                
                //not enabled for country or wrong currency for shipping method
                if  ( !in_array($state, get_option('woocommerce_slovakparcelservice_pp_delivery_countries', array())) || $shop_currency !== $currency ) {
                    
                    unset( $available_shipping_methods[$key] );
                    continue;
                }
            }
            
            if ( $shipping_class === 'slovakparcelservice_address' ) {
                
                //$shipping = new WC_SlovakParcelService_Address_Shipping_Method($rate ->get_instance_id() );
                
                $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
                $shipping = new $shipping_class_names[$shipping_class]($rate ->get_instance_id());
                $currency = $shipping->get_instance_option('currency');
                
                // not enabled for country or wrong currency for shipping method
                if ( !in_array($state, get_option('woocommerce_slovakparcelservice_addr_delivery_countries', array())) || $shop_currency !== $currency ) {
                    unset( $available_shipping_methods[$key] );
                    continue;
                }
            }
        }
        
        return $available_shipping_methods;
    }
    
    
    
    // payment methods filter
    add_filter('woocommerce_available_payment_gateways', 'slovakparcelservice_gateways_filter', 1);
    function slovakparcelservice_gateways_filter($gateways) {
        
        if ( !is_checkout()  ) {
            return $gateways;
        }
         
       // wc_get_logger()->debug('available_payment_gateways  GATEWAYS:: ' . var_export($gateways,true));
        
        //get shipping method
        $chosen_shipping = WC()->session->get( 'chosen_shipping_methods' );
        
        
        //wc_get_logger()->debug('available_payment_gateways  SCHSOEN SHIPPING :: ' . var_export($chosen_shipping,true));
        
        # no instance id 10638  proper fix
        if($chosen_shipping === null ) {
            return $gateways;
        }
        
        $chosen_shipping = $chosen_shipping[0];
        //$shipping = strip_instance( $chosen_shipping );
        $shipping_arr = split_instance($chosen_shipping);
        
        if ($shipping_arr === null  ) {
            $shipping = null;
        }else {
            $shipping = $shipping_arr[0];
        }
        
        if ( $shipping !== 'slovakparcelservice_address' && $shipping !== 'slovakparcelservice_pickupplace' ){
            
            return $gateways;
        }
        
        # no instance id 10638
        if (count( $shipping_arr ) < 2 ) {
           // return $gateways;
           
           // DEBUG
           //trigger_error("Shipment without instance", E_USER_ERROR);
           return array();
        }
        $instance_id = $shipping_arr[1];
        
        
        $filter_cod = false;
        
        // get cart currency
        $shop_currency = get_woocommerce_currency();
        //if ($shipping === 'slovakparcelservice_pickupplace') {
        //    $shipping = new WC_SlovakParcelService_PickupPlace_Shipping_Method( $instance_id);
        //}else {
        //    $shipping = new WC_SlovakParcelService_Address_Shipping_Method($instance_id);
        //}
        $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
        $shipping = new $shipping_class_names[$shipping]($instance_id);
        
        $currency = $shipping->get_instance_option('currency');
        
        // eshop   | sending in EUR  |  country has EUR  | eshop cur vs coutry curr
        // EUR          +                   -                     x +( cant be)               1
        // EUR          +                   -                     x -                         1
        // EUR        x +                   +                       +                         1
        // EUR        x -                   +                       +                         1
        //  -         x +                   +                       x +                       0  ( cudzia mena do EUR krajiny )
        //  -         x +                   +                       x -                       0  ( cudzia mena do EUR krajiny )
        //  -         x -                   +                       x +                       0  ( cudzia mena do EUR krajiny )
        //  -         x -                   +                       x -                       0  ( cudzia mena do EUR krajiny )
        //  -           +                   -                       x +                       0  ( neeuro  ako euro  )
        //  -           +                   -                       x -                       0  ( neeuro ako euro  )
        //  -           -                   -                       +                         1
        //  -  x        -                   -                       -                         0  ( nesedi cudzia mena )
        // EUR x        -                   -                       -                         0  ( nesedi cudzia mena )
        // EUR        x -                   +                       - (cant be)               1
        // EUR        x +                   +                       - (cant be)               1
        // EUR          -                   -                       + (cant be )              0  (neposielam ako EUR  do ne EUR)
              
        
        $state = WC()->customer->get_shipping_country();
        
        
        // ( cudzia mena do EUR krajiny )
        if ( $shop_currency !== 'EUR'  &&   ZipCityChecker::getCurrencyForCountry($state) === 'EUR' ) {
            $filter_cod = true;
        }
        
        
        // ( neeuro  ako euro  )
        if ( $state !== 'CZ') {
            $codsending = get_option('woocommerce_slovakparcelservice_codsending');
        }else {
            $codsending = get_option('woocommerce_slovakparcelservice_codsending_cz');
        }
        
        if ( $shop_currency !== 'EUR'  &&  ZipCityChecker::getCurrencyForCountry($state) !== 'EUR'
            &&  $codsending === 'yes'   ){
                $filter_cod = true;
        }
        
        // ( nesedi cudzia mena )
        if (ZipCityChecker::getCurrencyForCountry($state) !== 'EUR' && $codsending !== 'yes' && $shop_currency !== $currency ) {
                $filter_cod = true;
        }
        
        // (neposielam ako EUR  do ne EUR)
        if (  $shop_currency === 'EUR' && ZipCityChecker::getCurrencyForCountry($state) !== 'EUR' && $codsending  !== 'yes' ) {
             $filter_cod = true;
        }
        
        
        // order is not in EUR
        //if ( get_woocommerce_currency() !== 'EUR') {
        //    $filter_cod = true;
        //}
        
       // not EUR , not sending EUR ->native curency, curency doesnt match country currency
       // if ( $shop_currency !== 'EUR' &&   get_option('woocommerce_slovakparcelservice_codsending') !== 'yes'  &&
       //      $shop_currency !==  ZipCityChecker::getCurrencyForCountry($state) ) {
       //        $filter_cod = true;
       // }
        
        
      //  if (  get_option('woocommerce_slovakparcelservice_codsending') !== 'yes' && ZipCityChecker::getCurrencyForCountry($state) !== 'EUR' ) {
      //      $filter_cod = true;
      //  }
      
      
        // check total price for cod SK vs non SK
        $total = WC()->cart->total;
        if ( ( $state === 'SK' && $total > 5000)
            || ($shop_currency === 'EUR' && $state !== 'SK' && $total > 3300 )
            || ($shop_currency === 'CZK' && $state !== 'SK' && $total > 80000 )   // CZK     3300 *24  kurz  ~ 80000
          ) {
            $filter_cod = true;
        }
        
        // check delivery place supports cod

        if ( $shipping === 'slovakparcelservice_pickupplace' &&  WC()->session->get('sps_pp_iscod') === 'false' ) {  // undefined is true
            $filter_cod = true;
        }
        
        if ( $filter_cod) {
            // get all cods
            $arr = get_option('woocommerce_slovakparcelservice_codpayments');
            
            if ( ! is_array($arr) ) {
                $arr = array();
            }
            $cod_payments = array_values($arr );
            
            foreach (  array_keys( $gateways ) as $gateway_id ) {
                if ( in_array($gateway_id, $cod_payments )) {
                    unset( $gateways[$gateway_id] );
                }
            }
        }
        return $gateways;
    }
    
    
    add_filter('woocommerce_cart_shipping_method_full_label', 'add_text_on_free_shipping', 10,2 );
    
    function add_text_on_free_shipping( $label, $method ) {
        
        if ( ! (  $method->cost > 0 ) ) {
            if ( $method->method_id === 'slovakparcelservice_pickupplace' || $method->method_id === 'slovakparcelservice_address' ){
           
                // get config
                if ( get_option('woocommerce_slovakparcelservice_free_text') === 'yes'){
                    $label .= ": ".  __( 'Free','slovakparcelservice');
                }
            }
        }
        return $label;
    }
    
    
    // EMAIL/ORDER Detail
    add_filter( 'woocommerce_order_shipping_to_display', 'add_text_on_free_shipping_order', 10, 3 );
    function add_text_on_free_shipping_order($shipping, $order, $tax_display ) {
        
        if ( ! ( 0 < abs( (float) $order->get_shipping_total() ) )) {
            $methods = $order->get_shipping_methods();
            
            // only if only one shipping - avoid splitting $shipping and recombining
            // index is not zero
            if ( count($methods) === 1 ) {
                $method = $methods[array_keys($methods)[0]]->get_method_id();
                
                if ($method === 'slovakparcelservice_pickupplace' || $method === 'slovakparcelservice_address' ) {
                    if ( get_option('woocommerce_slovakparcelservice_free_text') === 'yes'){
                        $shipping .= ": ".  __( 'Free','slovakparcelservice');
                    }
                }
            }
        }
        return $shipping;
    }
    
    
    
    
    
    
    //scheduler
    add_action( 'sps_zipcity_hook', 'sps_zipcity_update' );
    
    function sps_zipcity_update(){
        
        global $wpdb;
        
        $link = "https://webship.sps-sro.sk/pscDownload";
        
        $data = "";
        // try curl first
        if ( function_exists('curl_version') ) {
            $ch = curl_init($link);
            curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $data = curl_exec($ch);
            curl_close($ch);
        } else if ( ini_get('allow_url_fopen') ) {  //  "0" and "" evals to false
            $data = file_get_contents($link);  # data is utf-8
        }else {
            wc_get_logger()->error( 'sps_zipcity_update :: No CURL and: allow_url_fopen is disabled');
            return;
        }
        
        if (!$data) {
            wc_get_logger()->error( 'sps_zipcity_update :: Data download failed');
            return;
        }
        
        // split by new lines, no new line in city name
        $csv_arr_tmp = explode("\n", $data);
        $csv_arr = array();
        foreach ( $csv_arr_tmp as $arr ) {
            $arr_tmp = explode(";", $arr);
            
            if (count($arr_tmp) === 2) {  # last line is empty
                $csv_arr[] = array( trim($arr_tmp[0], '"'), trim($arr_tmp[1], '"')  );
            }
        }

        // 1st row is header
        if ( count( $csv_arr) <= 1 ) {
            wc_get_logger()->error( 'sps_zipcity_update :: Data is empty' );
            return;
        }
        $wpdb->query( "START TRANSACTION" );
        
        $wpdb->query("SELECT * from " . $wpdb->prefix . ZipCityChecker::$table_name  . " order by  zip asc, city asc   FOR UPDATE"  );
        
        $wpdb->query("truncate table " . $wpdb->prefix . ZipCityChecker::$table_name );
        
        //db conn
        for ( $i = 1 ; $i < count( $csv_arr) ; $i++ ) {
            
            $city_nospace = preg_replace('/\s+/', '',  $csv_arr[$i][1] );
            //$wpdb->query($wpdb->prepare( 'insert into wp_slovakparcelservice_zipcity ( zip, city, city_noaccent ) VALUES ( %s, %s, %s)', preg_replace('/\s+/', '', $csv_arr[$i][0]), $csv_arr[$i][1], iconv("utf-8", "ascii//TRANSLIT", $csv_arr[$i][1]) ) );
            $wpdb->query($wpdb->prepare( 'insert into ' . $wpdb->prefix . ZipCityChecker::$table_name. ' ( zip, city, city_noaccent, city_nospace, city_nos_noacc ) VALUES ( %s, %s, %s, %s ,%s )  ON DUPLICATE KEY update city_nospace = %s ',
            preg_replace('/\s+/', '',  $csv_arr[$i][0]),  $csv_arr[$i][1],  ZipCityChecker::deaccent( $csv_arr[$i][1]), $city_nospace, ZipCityChecker::deaccent( $city_nospace), $city_nospace )) ;
        }
        $res =  $wpdb->query( "COMMIT" );
        
        if( $res !== FALSE) {
            $options_arr =  get_option('woocommerce_slovakparcelservice_refreshlastrun');
            $options_arr = time();
            update_option('woocommerce_slovakparcelservice_refreshlastrun', $options_arr );
        }else {
            wc_get_logger()->error( 'sps_zipcity_update :: DB update failed' );
        }
    }
    
    
    
    // remove schedule task on uninstall
    register_deactivation_hook( __FILE__, 'sps_zipcity_deactivate' );
    function sps_zipcity_deactivate() {
        $timestamp = wp_next_scheduled( 'sps_zipcity_hook' );
        wp_unschedule_event( $timestamp, 'sps_zipcity_hook' );
    }
    
    
    register_activation_hook( __FILE__, 'slovakparcelservice_activation' );
    
    function slovakparcelservice_activation() {

        $version = get_option('woocommerce_slovakparcelservice_version', null);
        
        
        // always try to create sps tables  new install/reinstall,  activation only
        create_sps_database_tables();

        if ( isset ( $version ) ) {
            // old version >=  2.3.0
	        // check version do diff upgrade ( config , DB )
            // nothing to do now for 2.3.0

        } else {
            $settings = get_option('woocommerce_slovakparcelservice_settings', null);
            if ( isset($settings)) {

                if ( ! isset ($settings['version'] ) ) {
                    //  < 2.2.3
                    //fix meta data
                    meta_data_fix();
                }
                // settings fix - ugrade
                foreach ( $settings as $item => $value ) {

                    update_option('woocommerce_slovakparcelservice_' . $item , $value );
                }
                delete_option('woocommerce_slovakparcelservice_settings');
                update_option('woocommerce_slovakparcelservice_version', get_plugin_data(__FILE__)['Version'] );
            }else {
                // NEW INSTALL || REINSTALL
                 // DB + meta data fix
                 meta_data_fix();
                 update_option('woocommerce_slovakparcelservice_version', get_plugin_data(__FILE__)['Version'] );
            }
        }
        
        // fix setting for all pickupplace shipping

        slovakparcelservice_settings_upgrade();
        
    }
    
    
    add_action( 'upgrader_process_complete', 'slovakparcelservice_settings_upgrade');
    
    // update fix setting for all pickupplace shipping - remove overweight , fix ranges
    function slovakparcelservice_settings_upgrade() {
        
        //require_once(__DIR__ . DIRECTORY_SEPARATOR . 'SlovakParcelServiceCommon.php' );
        
        //wc_get_logger()->debug('slovakparcelservice_settings_upgrade');
        
        $max_weight = SlovakParcelService\SlovakParcelServiceCommon::MAX_WEIGHT_PP;
        
        $delivery_zones = WC_Shipping_Zones::get_zones();
        foreach ((array) $delivery_zones as $key => $the_zone) {
            foreach ($the_zone['shipping_methods'] as $sh) {
                if (  $sh->id  === "slovakparcelservice_pickupplace" ) {
                    
                    $cost_by_weight = $sh->get_instance_option( 'costbyweight');

                    //wc_get_logger()->debug('costbyweight ' . strval($sh->instance_id) . ' :: ' . $cost_by_weight );
                    
                    if ( ! is_string($cost_by_weight) || strlen($cost_by_weight) < 2  ) {
                        $cost_by_weight = "{}";
                    }
                    $cost_by_weight = json_decode($cost_by_weight,true);
                    
                   // wc_get_logger()->debug('costbyweight ' . strval($sh->instance_id) . ' :: ' . var_export($cost_by_weight,true));
                    
                    // ranges empty or max weight <= $max_weight && overweightisnull
                    // nothing to do
                    $idx_limit = -1;
                    
                    if ( isset($cost_by_weight['ranges'] )) {
                        // find fris range at or over limit
                        for ( $i = 0 ; $i <  count($cost_by_weight['ranges']) ; $i++ ) {
                            if ($cost_by_weight['ranges'][$i]['weight'] >= $max_weight ){
                                $idx_limit = $i;
                                break;
                            }
                        }
                    }else {
                        $cost_by_weight['ranges'] = array();
                    }
                    if ( $idx_limit >= 0 ) {
                        // remove ranges
                        array_splice($cost_by_weight['ranges'], $idx_limit + 1 );
                        //set weigh to max value
                        $cost_by_weight['ranges'][$idx_limit]['weight'] = $max_weight;
                    }else {
                        if ( isset( $cost_by_weight['overweight'])) {
                            // ad range value from overweight
                            $cost_by_weight['ranges'][] = ['weight' => $max_weight, 'cost'=> $cost_by_weight['overweight'] ];
                        }
                    }
                    $cost_by_weight['overweight'] = null;
                    
                    //$sh->update_option('costbyweight', json_encode( $cost_by_weight));
                    $sh->update_instance_option('costbyweight', json_encode( $cost_by_weight));
                }
            }
        }
        
    }
    
    ///

    
    // fix old data
    function meta_data_fix() {
        
        // HPOS and non HPOS acts differently
        // fix  old data - nometa _slovakparcelservice_is_cod
        if ( class_exists('Automattic\WooCommerce\Utilities\OrderUtil')  &&   OrderUtil::custom_orders_table_usage_is_enabled() ) {
        
            $orders = wc_get_orders(
                array(
                    'type' => 'shop_order',
                    'limit' => -1,
                    'return' => 'ids',
                    'meta_query' => array (
                        array( 'key'=> '_slovakparcelservice_type', 'compare' => 'EXISTS'),
                        array( 'key' => '_slovakparcelservice_is_cod', 'compare' => 'NOT EXISTS')
                    )
                )
            );
        }else {
            $orders = wc_get_orders(
                array(
                   'type' => 'shop_order',
                   'limit' => -1,
                   'return' => 'ids',
                   '_slovakparcelservice_type'=> array( 'compare' => 'EXISTS'), #not works for unknown reason //??  must be without value
                       # re try with exists
                       #    array( 'key' => '_slovakparcelservice_type', 'compare' => '!=', 'value' => ''),
                   '_slovakparcelservice_is_cod' => array( 'compare' => 'NOT EXISTS')
                )
            );
        }
        
        for ($i = 0 ; $i < count ($orders) ; $i++ ) {
            
            $order = wc_get_order($orders[$i]);
            
            // https://github.com/woocommerce/woocommerce/issues/24531
            if ( is_a( $order, 'WC_Order_Refund' ) ) {
                $order = wc_get_order( $order->get_parent_id() );
            }
            
             //check for payment method 'cod'
             $is_cod = '1';
             if (  $order->get_payment_method() !== 'cod'){
                $is_cod = '0';
             }
            //   $order = wc_get_order( $orders[$i]);
            $order->update_meta_data('_slovakparcelservice_is_cod', $is_cod );
            $order->save();
        }
        
        
        // no meta  _slovakparcelservice_pp_countryISO only for PS /PT
        if (class_exists('Automattic\WooCommerce\Utilities\OrderUtil') && OrderUtil::custom_orders_table_usage_is_enabled() ) {
            $orders = wc_get_orders(
                array(
                    'type' => 'shop_order',
                    'limit' => -1,
                    'return' => 'ids',
                    'meta_query' => array (
                        array( 'key' => '_slovakparcelservice_type',          'compare' => '!=', 'value' => 'ADDR'),
                        array( 'key' => '_slovakparcelservice_pp_countryISO', 'compare' => 'NOT EXISTS')
                    )
                )
            );
        }else {
            $orders = wc_get_orders(
                array(
                    'type' => 'shop_order',
                    'limit' => -1,
                    'return' => 'ids',
                    '_slovakparcelservice_type' => array('compare' => '!=', 'value' => 'ADDR'),
                    '_slovakparcelservice_pp_countryISO' => array( 'compare' => 'NOT EXISTS')
                )
            );
        }
        
        for ($i = 0 ; $i < count ($orders) ; $i++ ) {
            $order = wc_get_order( $orders[$i]);
            $order->update_meta_data( '_slovakparcelservice_pp_countryISO', 'SK' );
            $order->save();
        }
    }
    
    
    function clear_session_pp_data() {
        
        WC()->session->__unset('sps_pp_name');
        WC()->session->__unset('sps_pp_cod');
        WC()->session->__unset('sps_pp_info');
        WC()->session->__unset('sps_pp_address');
        WC()->session->__unset('sps_pp_zip');
        WC()->session->__unset('sps_pp_city');
        WC()->session->__unset('sps_pp_countryiso');
        WC()->session->__unset('sps_pp_type');
    }
    
    
    function get_session_pp_data() {
       
        $sps_pp_name = WC()->session->get('sps_pp_name');
        $sps_pp_cod = WC()->session->get('sps_pp_cod');
        $sps_pp_info = WC()->session->get('sps_pp_info');
        $sps_pp_address = WC()->session->get('sps_pp_address');
        $sps_pp_zip = WC()->session->get('sps_pp_zip');
        $sps_pp_city = WC()->session->get('sps_pp_city');
        $sps_pp_countryiso = WC()->session->get('sps_pp_countryiso');
        $sps_pp_type = WC()->session->get('sps_pp_type');
        
         $sps_pp_name = $sps_pp_name ?? '';
         $sps_pp_cod = $sps_pp_cod ?? '';
         $sps_pp_info = $sps_pp_info ?? '';
         $sps_pp_address = $sps_pp_address ?? '';
         $sps_pp_zip = $sps_pp_zip ?? '';
         $sps_pp_city = $sps_pp_city ?? '';
         $sps_pp_countryiso = $sps_pp_countryiso ?? '';
         $sps_pp_type =  $sps_pp_type ?? '';
        
        return array("name" => $sps_pp_name, "cod" => $sps_pp_cod, "info" =>  $sps_pp_info , "address" => $sps_pp_address,
            "zip" => $sps_pp_zip, "city"=> $sps_pp_city, "countryiso"=> $sps_pp_countryiso, "type" => $sps_pp_type  );
        
    }
    
    
   
    //  create or update DB tables
    function create_sps_database_tables() {
        
        global $wpdb;
        
        $wpdb->query("CREATE TABLE IF not exists`" . $wpdb->prefix . ZipCityChecker::$table_name ."` (
            `zip` varchar(5) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_noaccent` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_nospace` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            `city_nos_noacc` varchar(100) COLLATE utf8mb4_slovak_ci NOT NULL,
            PRIMARY KEY (`zip`,`city`),
            KEY `wp_slovakparcelservice_zipcity_zip_IDX` (`zip`) USING BTREE,
            KEY `wp_slovakparcelservice_zipcity_city_IDX` (`city`) USING BTREE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_slovak_ci" );
        
        // check if primary key exists on  $wpdb->prefix . ZipCityChecker::$table_name
        $ret = $wpdb->get_var( "select count(*) from information_schema.table_constraints where table_name = '". $wpdb->prefix . ZipCityChecker::$table_name . "'  and constraint_name = 'PRIMARY'" );
        
        if ( $ret === '0' ) {
            // remove dupl rows
            $dupl = $wpdb->get_results("select count(*) as count, zip,city from ". $wpdb->prefix . ZipCityChecker::$table_name  ." group by zip,city order by count desc", ARRAY_A );
            for ( $i = 0  ; $i < count( $dupl); $i++ ) {
                if  ( (int) $dupl[$i]['count']  > 1 ) {
                    $wpdb->query($wpdb->prepare( "delete from ". $wpdb->prefix . ZipCityChecker::$table_name  ." where zip = %s and city = %s  LIMIT " . strval ( (int) $dupl[$i]['count'] -1 ), $dupl[$i]['zip'] , $dupl[$i]['city']  ));
                }else {
                    break;
                }
            }
            // add primary key
            $wpdb->query("ALTER TABLE " .  $wpdb->prefix . ZipCityChecker::$table_name ." ADD  PRIMARY KEY (`zip`,`city`)");
        }
        
        $wpdb->query("CREATE TABLE IF not exists`" . $wpdb->prefix . ZipCityChecker::$table_countriesdata ."` (
            `num_code` int NOT NULL,
            `iso_code` varchar(2) NOT NULL,
            `zip_minlength` int  NOT NULL,
            `zip_maxlength` int NOT NULL,
            `zip_is_alphanum` boolean NOT NULL,
            `cod` boolean NOT NULL,
            `notify` boolean NOT NULL,
            `currency` varchar(3) NOT NULL,
            UNIQUE KEY `slovakparcelservice_zipformat_iso_code_IDX` (`iso_code`) USING BTREE
            )
             ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_slovak_ci" );
        
         // check number of rows in  $wpdb->prefix . ZipCityChecker::$table_zipformat
        $ret = $wpdb->get_var("select count(*) from `" . $wpdb->prefix . ZipCityChecker::$table_countriesdata ."`");
        
        if ( $ret === '0' ) {
            $wpdb->query(" insert into `" . $wpdb->prefix . ZipCityChecker::$table_countriesdata . "`"
                . " (num_code, iso_code, zip_minlength, zip_maxlength, zip_is_alphanum, cod, notify, currency)  VALUES  "
                . " ( 40, 'AT',	1,	4,	0,	1, 0, 'EUR'), "
                . " ( 56, 'BE',	1,	4,	0,	0, 0, 'EUR'), "
                . " (100, 'BG',	4,	4,	0,	1, 1, 'EUR'), "
                . " (191, 'HR',	5,	5,	0,	1, 0, 'EUR'), "
                . " (203, 'CZ',	5,	5,	0,	1, 1, 'CZK'), "
                . " (208, 'DK',	4,	4,	0,	0, 0, 'DKK'), "
                . " (233, 'EE',	5,	5,	0,	0, 0, 'EUR'), "
                . " (246, 'FI',	5,	5,	0,	0, 0, 'EUR'), "
                . " (250, 'FR',	1,	5,	0,	0, 0, 'EUR'), "
                . " (276, 'DE',	1,	5,	0,	1, 0, 'EUR'), "
                . " (348, 'HU',	1,	4,	0,	1, 1, 'HUF'), "
                . " (380, 'IT',	1,	5,	0,	1, 0, 'EUR'), "
                . " (428, 'LV',	4,	4,	0,	0, 0, 'EUR'), "
                . " (440, 'LT',	5,	5,	0,	0, 0, 'EUR'), "
                . " (442, 'LU',	1,	4,	0,	0, 0, 'EUR'), "
                . " (528, 'NL',	6,	6,	1,	0, 0, 'EUR'), "
                . " (616, 'PL',	1,	5,	0,	0, 0, 'PLN'), "
                . " (620, 'PT',	7,	7,	0,	0, 0, 'EUR'), "
                . " (642, 'RO',	1,	6,	0,	1, 0, 'RON'), "
                . " (703, 'SK',	1,	5,	0,	1, 1, 'EUR'), "
                . " (705, 'SI',	4,	4,	0,	1, 0, 'EUR'), "
                . " (724, 'ES',	1,	5,	0,	0, 1, 'EUR'), "
                . " (752, 'SE',	5,	5,	0,	0, 0, 'SEK') "
            );
        }else {
            
            // update HR BG to EUR
            $wpdb->update( $wpdb->prefix . ZipCityChecker::$table_countriesdata, array ('currency' => 'EUR'), array('iso_code' =>'BG'));
            $wpdb->update( $wpdb->prefix . ZipCityChecker::$table_countriesdata, array ('currency' => 'EUR'), array('iso_code' =>'HR'));
            
        }
    }
    
    // ajax
    add_action( 'wp_ajax_slovakparcelservice_update_pp', 'slovakparcelservice_update_pp_ajax' );
    add_action( 'wp_ajax_nopriv_slovakparcelservice_update_pp', 'slovakparcelservice_update_pp_ajax' );
    
    function slovakparcelservice_update_pp_ajax() {
        
        if (isset($_POST['sps_pp_name']) && $_POST['sps_pp_name'] !== '' &&
            isset($_POST['sps_pp_cod'])  && $_POST['sps_pp_cod'] !== ''
                        
            ) {
            
            WC()->session->set('sps_pp_name', $_POST['sps_pp_name']);
            WC()->session->set('sps_pp_cod', $_POST['sps_pp_cod']);
            WC()->session->set('sps_pp_info', isset($_POST['sps_pp_info']) ? $_POST['sps_pp_info'] : "");
            WC()->session->set('sps_pp_address', isset($_POST['sps_pp_address']) ? $_POST['sps_pp_address'] : "");
            WC()->session->set('sps_pp_zip', isset($_POST['sps_pp_zip']) ? $_POST['sps_pp_zip'] : "");
            WC()->session->set('sps_pp_city', isset($_POST['sps_pp_city']) ? $_POST['sps_pp_city'] : "");
            WC()->session->set('sps_pp_countryiso', isset($_POST['sps_pp_countryiso']) ? $_POST['sps_pp_countryiso'] : "");
            WC()->session->set('sps_pp_type', isset($_POST['sps_pp_type']) ? $_POST['sps_pp_type'] : "");
            
            echo '{ "result": 0 }';
            
            wp_die();
        }
    }
    
    //get selected pp data
    add_action('wp_ajax_slovakparcelservice_get_pp_data','slovakparcelservice_get_pp_data_ajax');
    add_action('wp_ajax_nopriv_slovakparcelservice_get_pp_data','slovakparcelservice_get_pp_data_ajax');
    
    function slovakparcelservice_get_pp_data_ajax() {
       
        $pp = get_session_pp_data();
       
        echo json_encode($pp);
        wp_die();
    }
    
    add_action('wp_ajax_slovakparcelservice_get_address','slovakparcelservice_get_address_ajax');
    add_action('wp_ajax_nopriv_slovakparcelservice_get_address','slovakparcelservice_get_address_ajax');
    
    function slovakparcelservice_get_address_ajax () {
        
        // balikovo is selected shipping method
        
        $data = array();
        
        $chosen_shipping = WC()->session->get('chosen_shipping_methods');
        $chosen_shipping = array_shift( $chosen_shipping );
        // name instance_id
        $shipping_exploded = explode(":", $chosen_shipping);
        
        if ($shipping_exploded[0] !== 'slovakparcelservice_pickupplace' ){
            return;
        }
        
        $shipping_class_names = WC()->shipping->get_shipping_method_class_names();
        // works,  calling constructor does not work -- class not found
        $method = new $shipping_class_names[$shipping_exploded[0]]($shipping_exploded[1]);
        $method_delivery = $method->get_instance_option('delivery');
        
        if ( $method_delivery === 'ps' ){
            $data['type']="PS";
        }else if ( $method_delivery === 'pt' ) {
            $data['type']="PT";
        }else {
            $data['type']= "";
        }
        
        $customer = WC()->session->get('customer');
        $centerAddress = ( empty($customer['shipping_address_1'])? "" : $customer['shipping_address_1']  . ', ' ) .
        ( empty( $customer['shipping_postcode']) ? "" : $customer['shipping_postcode']  . ' ' ) .
        ( empty( $customer['shipping_city'] ) ? "" : $customer['shipping_city'] );
        
        $state = WC()->customer->get_shipping_country();
        
        if ( $state === 'SK' ) {
            $data['country'] = "SK";
        }else if ( $state === 'CZ' ) {
            $data['country'] = "CZ";
        }
        
        $data['address'] = $centerAddress;
        
        echo json_encode($data);
        wp_die();
        
    }
    
    // declare HPOS  compability
    add_action( 'before_woocommerce_init', function() {
        if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
        }
    } );
    
    
       // add_action('plugins_loaded', 'load_plugins', 0);
      //  function load_plugins() {
     //       require_once( plugin_dir_path( __FILE__ ) . 'SlovakParcelServiceCommon.php' );
     //   }
    
    
}
