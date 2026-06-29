// woocommerce block JS helep

var SPSwidget = window.SPSwidget || {};

SPSwidget.wc_blocks = SPSwidget.wc_blocks || {};

SPSwidget.wc_blocks.regex =  /^slovakparcelservice_pickupplace:[1-9]+[0-9]*$/;

SPSwidget.wc_blocks.elem = null;  // SPS shipping radio 

SPSwidget.wc_blocks.started = false;


//get selected pp data if from session 
SPSwidget.wc_blocks.get_pp_data = function () {
    
    var data = {
            action: "slovakparcelservice_get_pp_data"
    };
    jQuery.ajax({
        url: SPSwoocommerceajax.url, // this will point to admin-ajax.php
               type: 'POST',
               data: data,
               async: false,
               success: function (data, response, xhr ) {
                
                    data_parsed = JSON.parse(data);
                    if ( data_parsed.name !== '') {
                        SPSwidget.config.pp = data_parsed.name;
                        document.getElementById("sps_pp_full_address2").value = SPSwidget.config.pp;
                        document.getElementById("sps_pp_full_address2").setAttribute("title",  data_parsed.info + ', ' +  data_parsed.address + ', ' + data_parsed.zip + ' ' + data_parsed.city + ', ' +  data_parsed.countryiso);
                    }
              }
    });
};

SPSwidget.wc_blocks.get_address = function () {
    
    var data = {
        action: "slovakparcelservice_get_address"
    };
    jQuery.ajax({
        url: SPSwoocommerceajax.url, // this will point to admin-ajax.php
        type: 'POST',
        data: data,
        async: false,
        success: function (data, response, xhr ) {
            
            console.log("get_address :: "  + JSON.stringify(data));
            
            data_parsed = JSON.parse(data);
            SPSwidget.config.type = data_parsed.type;
            if (  data_parsed.address !== '' ) {
                SPSwidget.config.address =  data_parsed.address;
            }else {
                SPSwidget.config.address = '';
            }
            SPSwidget.config.country = data_parsed.country;
        }
    });
};


SPSwidget.wc_blocks.show_map = function () {
    
           var pp = null ;
           if ( document.getElementById("sps_pp_full_address2") && document.getElementById("sps_pp_full_address2").value !== "" ) {
               pp = document.getElementById("sps_pp_full_address2").value;
           }
                
           SPSwidget.config.pp = pp;
           
           SPSwidget.wc_blocks.get_address();
           
           SPSwidget.showMap();
};

SPSwidget.wc_blocks.start = function () {
    
    if ( SPSwidget.wc_blocks.started) {
        return;
    }
    SPSwidget.wc_blocks.started = true;
    
    var shipping_elem = document.getElementById('shipping-option');
    
    if (shipping_elem === null ) {
        // no shipping - after order creation
        return;
    }
    
    //start observer  at begining 
    
    const obsConfig = { attributes: false, childList: true, subtree: true };
    const obsCallback = function(mutationsList, observer) { 
            
        for(const mutation of mutationsList) {
            if (mutation.type !== 'childList') {
                continue;
            }
            
            var ex =  SPSwidget.wc_blocks.find_sps(jQuery(mutation.target));
            if ( ex !== null ) {
                SPSwidget.wc_blocks.elem = ex;
                SPSwidget.wc_blocks.add_button();
                break;
            }
        }
    };
    const observer = new MutationObserver(obsCallback);
    //  after load event  
    observer.observe( shipping_elem, obsConfig);
    
    // check if already exists 
    var el = SPSwidget.wc_blocks.find_sps();
    if (el !== null ) {
        SPSwidget.wc_blocks.elem = el;
        SPSwidget.wc_blocks.add_button();
    }
};


SPSwidget.wc_blocks.toggle_info = function (el ) {
    
    if ( SPSwidget.wc_blocks.regex.test(el.value) ){
        jQuery('#sps-parcelshop-wrapper').show();
    } else {
        jQuery('#sps-parcelshop-wrapper').hide();
    }
};


// sps pickup place  radio button element 
SPSwidget.wc_blocks.add_button = function () {
    
    if ( document.getElementById("sps-parcelshop-wrapper") !== null) {
        return;
    }
    
    // get element get next sibling (div) 
    // add code  (div) as last child to div
    // add listner to button click 
    // add listen to radio to show/hide button
    
    // class wc-block-components-radio-control__label-group
    var txt = '<div id="sps-parcelshop-wrapper" class="shipping_method" style="display:none;">' + 
         '<button id="sps-parcelshop-wrapper-button"  type="button" >balikovo</button>' + 
         '<div id="sps_info2">  <label for="sps_pp_full_address2">balíkovo:</label>' +
         '<input type="text" id="sps_pp_full_address2"  title="" style="width:100%;"  readonly></div>' +
         
         '</div>';
     
     
         
    // call ajax to get  widget ps/pt configuration
    SPSwidget.config.type = null;
          
    // add element 
    jQuery(SPSwidget.wc_blocks.elem).next().append(txt);
    
    
    // ajax call for selected pp 
    SPSwidget.wc_blocks.get_pp_data();
    
    
    ///  listener to all radio buttons  
    document.querySelectorAll('input[name="' + jQuery(SPSwidget.wc_blocks.elem).attr('name') + '"]').forEach((elem) => {
        elem.addEventListener("change",  function (){ SPSwidget.wc_blocks.toggle_info(elem); }); 
    });
    
    

    // button listener done   on function  
    jQuery("#sps-parcelshop-wrapper-button" ).on("click", SPSwidget.wc_blocks.show_map );
    
    // check if already selected - show button 
    if ( jQuery(SPSwidget.wc_blocks.elem).is(':checked') ) {
        jQuery('#sps-parcelshop-wrapper').show(); 
    } 
    
};

// elem start point
// return null or elemnt 
SPSwidget.wc_blocks.find_sps = function (elem = null) {
    
    if ( elem === null ){
        elem = jQuery("#shipping-option");
    }
    
     var x =  elem.find('input[type="radio"]').filter (
        function(index, element) {
            return SPSwidget.wc_blocks.regex.test(element.value);
        }
    );
    if ( x.length ==  0 ) {
        return null;
    } else {
        return x[0];
    }
};


//var SPSelement = document.getElementById("shipping-option");

// MANUAL ->   id shipping-option always on checkout 
// get input  radio child sps_pickupplace 
//     - if exists    ( unless "Hide shipping costs until an address is entered" )
//           add html code with button  , all listener on button click 
 //      -- add listeren on select to show button 
 //    if already selected - enable button 
 
// 
   
window.addEventListener('load', function() { 
    
    SPSwidget.wc_blocks.start();
});
