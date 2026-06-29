//namespace 
var SPS = SPS||{};

// namespace global variable
SPS.slovakparcelservicePickupPlaceRangeMax = 10;
SPS.arrayRanges = [];
SPS.overWeightCost = null;
SPS.element = null;
SPS.limit = -1
SPS.shipping = null;

SPS.obsConfig = { attributes: false, childList: true, subtree: true };
SPS.obsCallback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
             if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var haveChange = 0;
                //iter over 
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if ( mutation.addedNodes[i].id === 'wc-backbone-modal-dialog' ) {
                        haveChange = 1;
                        break;
                    }
                 } 
                if ( !haveChange ) {
                    continue;
                }
                // check for input 
                if (document.getElementById('woocommerce_slovakparcelservice_pickupplace_costbyweight')) {
                    SPS.element = document.getElementById('woocommerce_slovakparcelservice_pickupplace_costbyweight');
                    SPS.shipping = "pickupplace";
                } 
                if ( document.getElementById('woocommerce_slovakparcelservice_address_costbyweight') ) {
                    SPS.element = document.getElementById('woocommerce_slovakparcelservice_address_costbyweight');
                    SPS.shipping = "address";
                } 
                if ( SPS.element) {
                    SPS.updateTable();
                }
            }
        }
    };
    
window.addEventListener("load", (event) => {
    console.log("SPS admin js load");
    
    // observer  existence id="wc-backbone-modal-dialog"
    // chec if hidden input exists   id="woocommerce_slovakparcelservice_pickupplace_costbyweight"  || id="woocommerce_slovakparcelservice_address_costbyweight"
    // generate table and buttons 
    // max weights for delivery 
    SPS.observer = new MutationObserver(SPS.obsCallback);
    SPS.observer.observe(document.body, SPS.obsConfig);
    
});

// add or refresh  table
SPS.updateTable = function () {

    // read to array 
    if ( SPS.element.value.length == 0 ) {
        SPS.element.value = "{}";
    } 
    
    // json
    var data = JSON.parse( SPS.element.value);
    
    // pickupplace always undef
    if ( typeof data.overweight === 'undefined') {
        SPS.overWeightCost = null;
    }else {
        SPS.overWeightCost = data.overweight;
    }
    
    if ( typeof data.ranges === 'undefined' ) {
        SPS.arrayRanges =  [];
    } else {
        SPS.arrayRanges = data.ranges;
    }
    
    // sort by  weight
    if ( Array.isArray(SPS.arrayRanges) ) {
        SPS.arrayRanges.sort((a,b) => a.weight - b.weight );
    }
    
  
    
    // remove table if exist 
    if ( document.getElementById('slovakparcelservice_costbyweight_table') ) {
        document.getElementById('slovakparcelservice_costbyweight_table').remove();
    }
    
     //table parent - fieldset 
     var table_parent = SPS.element.parentElement;
    
     var table = document.createElement('table');
     table.id = 'slovakparcelservice_costbyweight_table';
     table.setAttribute("border","1");
     table.setAttribute("style", "width: 50%;min-width:250px;border-collapse: collapse;border: 1px solid black;" );
     var tr = document.createElement('tr');
     var th = document.createElement('th');
     th.setAttribute("style", "border-collapse: collapse;border: 1px solid black;" );
     th.innerHTML = SPS.weight_text;
     tr.appendChild(th);
     th = document.createElement('th');
     th.setAttribute("style", "border-collapse: collapse;border: 1px solid black;" );
     th.innerHTML = SPS.cost_text;
     tr.appendChild(th);
     th = document.createElement('th');
     th.setAttribute("style", "border-collapse: collapse;border: 1px solid black;" );
     th.innerHTML = "";
     tr.appendChild(th);
     
     table.appendChild(tr);
     table_parent.appendChild(table);

    for ( var i = 0 ; i < SPS.arrayRanges.length ; i ++ ) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        td.innerHTML = SPS.arrayRanges[i]['weight'];
        tr.appendChild(td);
        var td = document.createElement('td');
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        td.innerHTML = SPS.arrayRanges[i]['cost'];
        tr.appendChild(td);
        var td = document.createElement('td');
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        var tdButton = document.createElement('button');
        tdButton.id = "slovakparcelservice_costbyweight_" + String(i);
        tdButton.setAttribute("type", "button");
        tdButton.innerHTML = SPS.del_range_text;
        tdButton.setAttribute("onclick", "SPS.delRange(this);");
        td.appendChild(tdButton);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    
    // add overweight for address
    if (SPS.shipping === 'address' ) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        td.innerHTML = SPS.weight_over_text;
        tr.appendChild(td);
        td = document.createElement('td');
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        var tdxIn =  document.createElement('input');
        tdxIn.setAttribute("id","slovakparcelservice_overweight");
        tdxIn.setAttribute("type","number");
        tdxIn.setAttribute("step","0.1");
        tdxIn.setAttribute("min","0");
        tdxIn.setAttribute("style", "width: 20%;min-width:80px;" );
        if ( SPS.overWeightCost !== null ) {
            tdxIn.value =  String( SPS.overWeightCost);
        }
        td.appendChild(tdxIn);
        tr.appendChild(td);
        td = document.createElement('td');  // emty cell
        td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
        tr.appendChild(td);
        table.appendChild(tr);
        
        // event handler
        tdxIn.addEventListener("change", (event) => {
            // check if number and 
            
            console.log("overweight change "  + event.target.value );
            
            var newOverWeight =  Number.parseFloat( event.target.value ) ;
            if (Number.isNaN(newOverWeight)) {
                //set prevous value to input 
                document.getElementById("slovakparcelservice_overweight").value = String(SPS.overWeightCost);
            } else {
                // round to to decimal places 
                newOverWeight =  Number.parseFloat(newOverWeight.toFixed(2));
                if ( newOverWeight < 0 ) {
                    newOverWeight = 0;
                }
            
                document.getElementById("slovakparcelservice_overweight").value = String(newOverWeight);
                SPS.overWeightCost = newOverWeight;
                SPS.element.value = JSON.stringify( { "ranges" : SPS.arrayRanges , "overweight" : SPS.overWeightCost } );
            }
        });
    }

    
    // new/set range  table row
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
    var tdIn =  document.createElement('input');
    tdIn.id = "slovakparcelservice_costbyweight_weight";
    tdIn.setAttribute("type","number");
    tdIn.setAttribute("step","0.1");
    tdIn.setAttribute("min","0.1");
    tdIn.setAttribute("style", "width: 20%;min-width:80px;" );
    td.appendChild(tdIn);
    tr.appendChild(td);
    td = document.createElement('td');
    td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
    tdIn = document.createElement('input');
    tdIn.id = "slovakparcelservice_costbyweight_cost";
    tdIn.setAttribute("type","number");
    tdIn.setAttribute("step","0.01");
    tdIn.setAttribute("min","0");
    tdIn.setAttribute("style", "width: 20%;min-width:80px;" );
    td.appendChild(tdIn);
    tr.appendChild(td);
    td = document.createElement('td');
    td.setAttribute("style","text-align: center;border-collapse: collapse;border: 1px solid black;");
    tdButton = document.createElement('button');
    tdButton.id = 'slovakparcelservice_costbyweight_button';
    tdButton.setAttribute("type","button");
    tdButton.setAttribute("onclick", "SPS.addRange(this,);");
    tdButton.innerHTML = SPS.add_range_text;
    td.appendChild(tdButton);
    tr.appendChild(td);
    table.appendChild(tr);
}


SPS.delRange = function(event) {
    
    // get index in ArrayRange from event.id (button)
    var sepIdx = event.id.lastIndexOf("_");
       // var id = event.id.slice(0, sepIdx + 1);
       // var strNum =  event.id.slice(sepIdx + 1);  // event.id.substring('sps_row_button_button_'.length);
    var idx = parseInt(event.id.slice(sepIdx + 1));
       
    //  button->td->tr ; remove row from table 
    //event.parentElement.parentElement.remove();
    SPS.arrayRanges.splice(idx,1);
    SPS.element.value = JSON.stringify( { "ranges" : SPS.arrayRanges, "overweight": SPS.overWeightCost });
    // refresh table to fix idx in tbale vs arrayrnage
    SPS.updateTable();
}


SPS.addRange = function (event) {
    
    // check input , chek  dupl range, check for overlimit 
     var newWeight =  Number.parseFloat( document.getElementById("slovakparcelservice_costbyweight_weight").value ) ;
     if (Number.isNaN(newWeight)) {
        newWeight = 0.0;
    }
    // to 1 decimal number tostr -> to float
    newWeight = Number.parseFloat( newWeight.toFixed(1) );
    if ( newWeight <= 0 ) {
            console.log( "ERROR INVALID WEIGHT");
            document.getElementById("slovakparcelservice_costbyweight_weight").value = '';
            return;
    }  
    // set max range for pickupplace delivery
    if (SPS.shipping == "pickupplace" && newWeight > SPS.slovakparcelservicePickupPlaceRangeMax ) {
         newWeight = SPS.slovakparcelservicePickupPlaceRangeMax;
         console.log( "WARNING WEIGHT change to maxvalue");
    }
    
    //cost 
    var newCost = Number.parseFloat(document.getElementById("slovakparcelservice_costbyweight_cost").value);
    if (Number.isNaN(newCost)) {
        newCost = 0;
    }
    // round to to decimal places 
    newCost =  Number.parseFloat(newCost.toFixed(2));
    if ( newCost < 0 ) {
        newCost = 0;
    }
     
    //dupl range
    var dupl = 0;
    for ( var i = 0 ; i < SPS.arrayRanges.length ; i++ ) {
        if ( SPS.arrayRanges[i]['weight'] == newWeight ) {
            SPS.arrayRanges[i]['cost'] = newCost;
            dupl = 1 ;
            break;
        }
    }
    document.getElementById("slovakparcelservice_costbyweight_weight").value = '';
    document.getElementById("slovakparcelservice_costbyweight_cost").value = '';
    
    if ( ! dupl ) { 
        SPS.arrayRanges.splice( SPS.arrayRanges.length,0,  { "weight" : newWeight , "cost" : newCost});
        SPS.arrayRanges.sort((a,b) => a.weight - b.weight );
    }
    SPS.element.value = JSON.stringify( { "ranges" : SPS.arrayRanges , "overweight" : SPS.overWeightCost } );
    // refresh table to fix idx in table vs arrayrnage
    SPS.updateTable();
    
}



