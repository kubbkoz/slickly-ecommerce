<?php

declare(strict_types=1);

require_once  __DIR__ . DIRECTORY_SEPARATOR . 'SlovakParcelServiceCommon.php' ;

use SlovakParcelService\SlovakParcelServiceCommon;

class WC_SlovakParcelService_Address_Shipping_Method extends WC_Shipping_Method {
    
    const MAX_WEIGHT = SlovakParcelServiceCommon::MAX_WEIGHT_ADDR; //per package
    
    public $id;
    public $instance_id;
    public $method_title;
    public $title;
    public $supports;
    
    public $tax_status;
    public $cost;
    public $costtype;
    public $costbyweight;
    public $free;
    public $delivery;
    public $currency;
    
    public $instance_form_fields;
    
    
    public function __construct($instance_id = 0) {
        
        $this->id = 'slovakparcelservice_address';
        $this->instance_id   = absint( $instance_id );
        $this->method_title = __('Slovak Parcel Service - Address','slovakparcelservice' );
        $this->method_description = __('Slovak Parcel Service delivery to address', 'slovakparcelservice');
        $this->title = __('Slovak Parcel Service delivery to address', 'slovakparcelservice');
        
        // $this->supports =  array('settings', 'shipping-zones', 'instance-settings', 'instance-settings-modal');
        $this->supports =  array( 'shipping-zones', 'instance-settings', 'instance-settings-modal');
        
        $this->init();
        
    }
    public function init() {
        $this->init_form_fields();
        $this->init_settings();
        
        
        $this->title                = $this->get_option( 'title' );
        $this->tax_status           = $this->get_option( 'tax_status' );
        $this->cost                 = $this->get_option( 'cost' );
        $this->costtype             = $this->get_option( 'costtype' );
        $this->costbyweight         = $this->get_option( 'costbyweight');
        //    $this->codcost              = $this->get_option( 'codcost' );
        $this->free                 = $this->get_option( 'free' );
        $this->free_vat             = $this->get_option( 'free_vat' );
        
        $this->currency =  $this->get_option( 'currency' );
    }
    
    public function init_form_fields() {
        $this->instance_form_fields =  include __DIR__ . '/inc/instance_settings_address.php';
    }
    
    // convert weight o kg , ret null when unknown  unit
    public static function convert_weight($val ){
        $unit_arr = ['kg','g','lbs','oz'];
        $woo_weight_unit = get_option('woocommerce_weight_unit');
        if (! in_array( $woo_weight_unit, $unit_arr )) {
            return null;
        }
        if ($woo_weight_unit === 'kg' ) {
            return $val;
        }else if ($woo_weight_unit === 'g' ) {
            return $val / 1000;
        }else if ($woo_weight_unit === 'lbs' ) {
            return $val * 0.45359237;
        }else if ($woo_weight_unit === 'oz' ) {
            return $val * 0.028349523125;
        }
    }
    
    
    public function calculate_shipping( $package = array() ) {
        
        // check for weight
        $cart_contents =  WC()->cart->get_cart_contents();
        
        foreach( $cart_contents as $item) {
            
            // data vs parent_data   WC_Product_Variation
            $weight = $item['data']->get_data()['weight'];
            if (  $weight === ''  &&  get_class($item['data']) === 'WC_Product_Variation' ) {
                $weight =  $item['data']->get_parent_data()['weight'];  // get parent weight  if weight is not explicitly set for WC_Product_Variation
            }
            
            $conv_w  = self::convert_weight(intval($weight));
            
            if ( $conv_w === null || $conv_w > self::MAX_WEIGHT ) {
                return array();
            }
        }
        
        $costtype = $this->get_instance_option('costtype');
        if ($costtype  === 'fixed' ) {
            $cost = $this->get_instance_option('cost'); // default - non class price
        }else {
            // by weight
            // get price per sum
            $cost_by_weight =  $this->get_instance_option('costbyweight');
            if ( ! is_string($cost_by_weight) || strlen($cost_by_weight) < 2 ) {
                $cost_by_weight = "{}";
            }
            $cost_by_weight = json_decode($cost_by_weight,true);
            
            if ( isset( $cost_by_weight['ranges']) ) {
                $cost_by_weight_ranges = $cost_by_weight['ranges'];
            }else {
                $cost_by_weight_ranges = array();
            }
            if ( isset ($cost_by_weight['overweight']) ) {
                $cost_by_weight_overweight  = $cost_by_weight['overweight'];
            }else {
                $cost_by_weight_overweight = null;
            }
            
            
            if ( count($cost_by_weight_ranges) > 1) {
                usort($cost_by_weight_ranges, function($a,$b) {
                    return $a["weight"] <=> $b["weight"];
                });
            }
            
            $weight_sum = $this->convert_weight( WC()->cart->get_cart_contents_weight());
            
            $cost = -1;
            for ( $i = 0 ; $i < count($cost_by_weight_ranges) ; $i++  ) {
                if ( $weight_sum > $cost_by_weight_ranges[$i]['weight'] ) {
                    continue;
                }
                $cost = $cost_by_weight_ranges[$i]['cost'];
                break;
            }
            
            // over max configured range
            if ( $cost == -1 ) {
                if ( $cost_by_weight_overweight === null ) {
                    return array();
                } else  {
                    $cost = $cost_by_weight_overweight;
                }
            }
        }
        
        $classes = [];
        
        foreach($package['contents'] as $contents) {
            if(!$class_id = $contents['data']->get_shipping_class_id()) {
                continue;
            }
            
            if( $temp = $this->get_option('class_cost_' . $class_id) ) {
                $classes[$class_id] = $temp;
            }
        }
        
        // use shipping classes
        if(sizeof($classes)) {
            // different calc types: order: use max(rate) class: - sum of rates
            $cost = ( $this->get_option('calctype') == 'class' ) ? array_sum($classes) : max($classes);
        }
        
        //no rate over the defined limit
        $free = $this->get_instance_option('free'); // default - non class price
        if ( $free === '' ) {
            $free = null;
        }else {
            $free = floatval($free);
        }
        
        $free_vat = $this->get_instance_option('free_vat');
        if ( $free_vat !== 'yes' ) {
            $free_vat = false;
        }else {
            $free_vat = true;
        }
        
        if ( $free_vat ) {
            $cart_vat =  WC()->cart->get_cart_contents_tax();
        }else {
            $cart_vat = 0.0 ;
        }
        
        if ( ! is_null( $free ) && ( floatval( WC()->cart->get_cart_contents_total() ) + $cart_vat ) >= $free ) {
            $cost = 0;
        }
        
        if($this->get_instance_option('tax_status')=='taxable') {
            $is_shipping_taxable = true;
        } else {
            $is_shipping_taxable = false;
        }
        
        // check coupons
        $apl_coupons_arr = WC()->cart->applied_coupons;
        foreach ($apl_coupons_arr as $apl_coupon ) {
            
            # check if coupon has free shipping
            $coupon = new \WC_Coupon( $apl_coupon );
            if ( $coupon->is_valid_for_cart() && $coupon->get_free_shipping() ){
                $cost = 0;
                break;
            }
        }
        
        $rate = array(
            'id'      => $this->get_rate_id(),
            'label'   => $this->title,
            'cost'    => $cost,
            'taxes' => $is_shipping_taxable,
            'calc_tax' => 'per_order'
        );
        // Set the rate#
        $this->add_rate( $rate );
        do_action( 'woocommerce_' . $this->id . '_shipping_add_rate', $this, $rate );
    }
}

?>