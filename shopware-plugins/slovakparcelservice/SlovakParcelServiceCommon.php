<?php

declare(strict_types=1);

namespace SlovakParcelService;

class SlovakParcelServiceCommon {
    
    const MAX_WEIGHT_ADDR = 50;
    const MAX_WEIGHT_PP = 10;
    
    
    // convert weight to kg , ret null when unknown  unit
    public static function convert_weight($val, $unit ){
        $unit_arr = ['kg','g','lbs','oz'];
        
        if (! in_array( $unit, $unit_arr )) {
            return null;
        }
        if ($unit === 'kg' ) {
            return $val;
        }else if ($unit === 'g' ) {
            return $val / 1000;
        }else if ($unit === 'lbs' ) {
            return $val * 0.45359237;
        }else if ($unit === 'oz' ) {
            return $val * 0.028349523125;
        }
    }
}

?>