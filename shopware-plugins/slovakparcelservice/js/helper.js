
var SPSwidget = window.SPSwidget || {};

SPSwidget.config = SPSwidget.config || {};

SPSwidget.config.widget_url = 'https://balikomat.sps-sro.sk';

SPSwidget.config.button = "sps-parcelshop-wrapper-button";   // embeded in php 

SPSwidget.config.custom_button_click = true;
SPSwidget.config.nodisplay_on_init = true;
SPSwidget.config.clean_on_close = true;


//SPSwidget.config.pp_elem = "sps_pp_name"; // id of field containg selected pp id 

SPSwidget.config.callback = "SPSwoocommerce.FillBoxMachine";


// SPS woocommerce config 
var SPSwoocommerce = window.SPSwoocommerce || {};

SPSwoocommerce.FillBoxMachine = function (place) {
    
    // show info
    document.getElementById("sps_pp_full_address2").value  =  place.id;
    document.getElementById("sps_pp_full_address2").setAttribute("title",  place.description + ', ' +  place.address + ', ' + place.zip + ' ' + place.city + ', ' +  place.countryISO);
    document.getElementById("sps_info2").style.display = "block";
    

    // send data to serverside  session - req admin url so not here ( data required for sps_pp_full_address2 recreation)
    SPSwoocommerce.pp = {}; 
    // cod
    if ( typeof place.cod  === 'undefined' ) {
        SPSwoocommerce.pp.cod = true;
    }else {
        SPSwoocommerce.pp.cod = place.cod;
    }
    
    SPSwoocommerce.pp.name = place.id;
    SPSwoocommerce.pp.info = place.description;
    SPSwoocommerce.pp.address = place.address;
    SPSwoocommerce.pp.zip = place.zip;
    SPSwoocommerce.pp.city = place.city;     
    SPSwoocommerce.pp.countryISO = place.countryISO;
    SPSwoocommerce.pp.type = place.type;
    
    
    if ( SPSwoocommerce.pp.name ) {
        var data = {
            action: "slovakparcelservice_update_pp",
            sps_pp_name: SPSwoocommerce.pp.name,
            sps_pp_cod: SPSwoocommerce.pp.cod,
            sps_pp_info: SPSwoocommerce.pp.info,
            sps_pp_address: SPSwoocommerce.pp.address,
            sps_pp_zip: SPSwoocommerce.pp.zip,
            sps_pp_city: SPSwoocommerce.pp.city,
            sps_pp_countryiso: SPSwoocommerce.pp.countryISO,
            sps_pp_type: SPSwoocommerce.pp.type
            
        };
        jQuery.ajax({
            url: SPSwoocommerceajax.url, // this will point to admin-ajax.php
            type: 'POST',
            data: data,
            success: function (data, response, xhr ) {
                jQuery('body').trigger('update_checkout');
            }
        });
    }
}



function updateShippingCity($city) {
    
    if (! $city) {
        return;
    }
    
    var checkbox =  document.getElementById("ship-to-different-address-checkbox");
    
    if ( ! checkbox.checked ) {
       document.getElementById("billing_city").value = $city ;
    } else {
       document.getElementById("shipping_city").value = $city ;  
    }
}










