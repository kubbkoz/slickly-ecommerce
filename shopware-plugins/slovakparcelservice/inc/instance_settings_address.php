<?php

/*
 *  Instance settings for delivery to address shipping method
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$instance_settings = array(
    'title' => array(
        'title' 		=> __( 'Name', 'slovakparcelservice' ),
        'type' 			=> 'text',
        'description' 	=> __( 'Enter name for shipping method', 'slovakparcelservice' ),
        'default'		=> __( 'Slovak Parcel Service delivery to address', 'slovakparcelservice' ),
        'desc_tip'		=> true
    ),
    
    'currency' => array (
        'title' => __('Currency', 'slovakparcelservice' ),
        'type' 			=> 'select',
        'class'         => 'wc-enhanced-select',
        'default' 		=> 'EUR',
        'options'		=> array(
            'EUR' 	=> 'EUR',
            'CZK'=> 'CZK'
        )
    ),
    
    'tax_status' => array(
        'title' 		=> __( 'Tax Status', 'slovakparcelservice' ),
        'type' 			=> 'select',
        'class'         => 'wc-enhanced-select',
        'default' 		=> 'taxable',
        'options'		=> array(
            'taxable' 	=> __( 'Taxable', 'slovakparcelservice' ),
            'none' 		=> __( 'None', 'slovakparcelservice' )
        )
    ),
    
    'costtype' => array (
        'title' 		=> __( 'Cost type', 'slovakparcelservice' ),
        'type' 			=> 'select',
        'class'         => 'wc-enhanced-select',
        'default' 		=> 'fixed',
        'options'		=> array(
            'fixed' 	=> __( 'Fixed', 'slovakparcelservice' ),
            'by_weight'=> __( 'By weight', 'slovakparcelservice' )
        )
        
    ),
    
    'cost' => array(
        'title' 		=> __( 'Cost fixed', 'slovakparcelservice' ),
        //'type' 			=> 'text',
        'type' 			=> 'number',
        'custom_attributes' => array( 'step' => 'any', 'min' => '0' ),
        'placeholder'	=> '',
        'description'   => __('Shipping cost without VAT','slovakparcelservice'),
        'default'		=> '0',
        'desc_tip'		=> true
    ),
    
    'costbyweight' => array(
        'title' 		=> __( 'Cost by weight', 'slovakparcelservice' ),
        'type' 			=> 'hidden',
        'description'   => __('Shipping cost without VAT','slovakparcelservice'),
        'desc_tip'		=> true
    ),
    
//     'codcost' => array(
//         'title' 		=> __( 'COD', 'slovakparcelservice' ),
//         'type' 			=> 'text',
//         'placeholder'	=> '',
//         'default'		=> '0',
//         'description'   => __('Shipping cod fee','slovakparcelservice'),
//         'desc_tip'		=> true
//     ),
    
    'free_vat' => array(
        'title' 		=> __( 'Free Shipping Limit is with VAT', 'slovakparcelservice' ),
        'type' => 'checkbox',
        'default' => 'no'
    ),
    
    'free' => array(
        'title' 		=> __( 'Free Shipping Limit', 'slovakparcelservice' ),
        //'type' 			=> 'text',
        'type' 			=> 'number',
        'custom_attributes' => array( 'step' => 'any', 'min' => '0' ),
        'placeholder'	=> '',
        'default'		=> '',
        'description' 	=> __( 'Enter limit for free shipping', 'slovakparcelservice' ),
        'desc_tip'		=> true
    ),
    
    'insurance_custom' => array(
        'title' 		=> __( 'Custom insurance', 'slovakparcelservice' ),
        'type' => 'checkbox',
        'default' => 'no',
        'description' 	=> __( 'Use custom insurance value. Default order value is used', 'slovakparcelservice' ),
    ),
    
    'insurance_value' => array(
        'title' 		=> __( 'Custom insurance value', 'slovakparcelservice' ),
        'type' 			=> 'number',
        'custom_attributes' => array( 'step' => 'any', 'min' => '0' ),
        'placeholder'	=> '',
        'default'		=> '',
        'description' 	=> __( 'Enter custom insurance value', 'slovakparcelservice' ),
        'desc_tip'		=> true
    )
    
);

$shipping_classes = WC()->shipping->get_shipping_classes();

if ( ! empty( $shipping_classes ) ) {
    $instance_settings[ 'class_costs' ] = array(
        'title'			 => __( 'Shipping classes costs', 'slovakparcelservice' ),
        'type'			 => 'title',
        'default'        => '',
        'description'    => __( 'Fill in if you need specific costs for specific', 'slovakparcelservice' ) .  ' <a href="'. admin_url( 'admin.php?page=wc-settings&tab=shipping&section=classes' ) . '">' . __('shipping classes', 'slovakparcelservice') . '</a>.'
    );
    foreach ( $shipping_classes as $shipping_class ) {
        if ( ! isset( $shipping_class->term_id ) ) {
            continue;
        }
        $instance_settings[ 'class_cost_' . $shipping_class->term_id ] = array(
            'title'       =>  __( 'Cost for', 'slovakparcelservice' ) . sprintf(" %s",  esc_html( $shipping_class->name ) ),
            'type'        => 'text',
            'placeholder' => '',
            'default'     => '',
        );
    }
    $instance_settings[ 'calctype' ] = array(
        'title' 		=> __( 'Final cost calculation type', 'slovakparcelservice' ),
        'type' 			=> 'select',
        'class'         => 'wc-enhanced-select',
        'default' 		=> 'order',
        'options' 		=> array(
            'order' 	=> __( 'On order : charge most expensive shiping class', 'slovakparcelservice' ),
            'class' 	=> __( 'On classes: count shipping class for every product', 'slovakparcelservice' ),
        ),
    );
}

return $instance_settings;

