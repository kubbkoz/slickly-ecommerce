import { computed } from 'vue';
import { useState } from '#imports';

/**
 * Manages all filter state for the category page globally using Nuxt useState singleton.
 * Shared natively across Page, StickyToolbar, and OffcanvasFilter without props.
 */
export const useCategoryFilters = () => {
    // Unique keys for Nuxt global payload sync
    const selectedBrands = useState<string[]>('cf-brands', () => []);
    const selectedSizes = useState<string[]>('cf-sizes', () => []);
    const selectedGenders = useState<string[]>('cf-genders', () => []);
    const selectedColors = useState<string[]>('cf-colors', () => []);
    const selectedWheelSizes = useState<string[]>('cf-wheels', () => []);
    const selectedGeneralProperties = useState<string[]>('cf-gen-props', () => []);
    const priceRange = useState<[number, number]>('cf-price', () => [0, 10000]);
    const inStockOnly = useState<boolean>('cf-instock', () => false);
    const onDemandOnly = useState<boolean>('cf-ondemand', () => false);
    const isPromotion = useState<boolean>('cf-promo', () => false);
    const isFeatured = useState<boolean>('cf-featured', () => false);
    const searchQuery = useState<string>('cf-search', () => '');
    const sortBy = useState<string>('cf-sort', () => 'name-asc');
    
    // --- Custom Fields States ---
    const riderHeight = useState<number | null>('cf-rider-height', () => null);
    const selectedWheelsNorm = useState<string[]>('cf-wheels-norm', () => []);
    const selectedForkNorm = useState<string[]>('cf-fork-norm', () => []);
    const selectedBrakesNorm = useState<string[]>('cf-brakes-norm', () => []);
    const selectedGearsNorm = useState<string[]>('cf-gears-norm', () => []);
    const selectedMotorNorm = useState<string[]>('cf-motor-norm', () => []);
    const selectedBatteryNorm = useState<string[]>('cf-battery-norm', () => []);

    // Dynamically computed to prevent multiple watcher instantiations if composable is called in multiple components
    const selectedProperties = computed(() => [
        ...selectedSizes.value,
        ...selectedGenders.value,
        ...selectedWheelSizes.value,
        ...selectedGeneralProperties.value,
    ]);

    const activeFilterCount = computed(() => {
        let count = 0;
        if (selectedBrands.value.length) count += selectedBrands.value.length;
        if (selectedSizes.value.length) count += selectedSizes.value.length;
        if (selectedGenders.value.length) count += selectedGenders.value.length;
        if (selectedColors.value.length) count += selectedColors.value.length;
        if (selectedWheelSizes.value.length) count += selectedWheelSizes.value.length;
        if (selectedGeneralProperties.value.length) count += selectedGeneralProperties.value.length;
        
        // Custom Fields counts
        if (riderHeight.value) count++;
        if (selectedWheelsNorm.value.length) count += selectedWheelsNorm.value.length;
        if (selectedForkNorm.value.length) count += selectedForkNorm.value.length;
        if (selectedBrakesNorm.value.length) count += selectedBrakesNorm.value.length;
        if (selectedGearsNorm.value.length) count += selectedGearsNorm.value.length;
        if (selectedMotorNorm.value.length) count += selectedMotorNorm.value.length;
        if (selectedBatteryNorm.value.length) count += selectedBatteryNorm.value.length;

        if (priceRange.value[0] > 0 || priceRange.value[1] < 10000) count++;
        if (inStockOnly.value) count++;
        if (onDemandOnly.value) count++;
        if (isPromotion.value) count++;
        if (isFeatured.value) count++;
        return count;
    });

    const clearAllFilters = () => {
        // Splice ensures the proxy is correctly mutated without breaking reference, 
        // useful for complex watchers deep-watching arrays.
        selectedBrands.value.splice(0, selectedBrands.value.length);
        selectedSizes.value.splice(0, selectedSizes.value.length);
        selectedGenders.value.splice(0, selectedGenders.value.length);
        selectedColors.value.splice(0, selectedColors.value.length);
        selectedWheelSizes.value.splice(0, selectedWheelSizes.value.length);
        selectedGeneralProperties.value.splice(0, selectedGeneralProperties.value.length);
        
        selectedWheelsNorm.value.splice(0, selectedWheelsNorm.value.length);
        selectedForkNorm.value.splice(0, selectedForkNorm.value.length);
        selectedBrakesNorm.value.splice(0, selectedBrakesNorm.value.length);
        selectedGearsNorm.value.splice(0, selectedGearsNorm.value.length);
        selectedMotorNorm.value.splice(0, selectedMotorNorm.value.length);
        selectedBatteryNorm.value.splice(0, selectedBatteryNorm.value.length);
        
        riderHeight.value = null;
        priceRange.value = [0, 10000];
        inStockOnly.value = false;
        onDemandOnly.value = false;
        isPromotion.value = false;
        isFeatured.value = false;
        searchQuery.value = '';
    };

    const handleBrandToggle = (brandId: string) => {
        selectedBrands.value = selectedBrands.value.includes(brandId)
            ? selectedBrands.value.filter(b => b !== brandId)
            : [...selectedBrands.value, brandId];
    };

    const handleSizeToggle = (size: string) => {
        selectedSizes.value = selectedSizes.value.includes(size)
            ? selectedSizes.value.filter(s => s !== size)
            : [...selectedSizes.value, size];
    };

    const handleGenderToggle = (gender: string) => {
        selectedGenders.value = selectedGenders.value.includes(gender)
            ? selectedGenders.value.filter(g => g !== gender)
            : [...selectedGenders.value, gender];
    };

    const handleColorToggle = (color: string) => {
        selectedColors.value = selectedColors.value.includes(color)
            ? selectedColors.value.filter(c => c !== color)
            : [...selectedColors.value, color];
    };

    const handleWheelSizeToggle = (size: string) => {
        selectedWheelSizes.value = selectedWheelSizes.value.includes(size)
            ? selectedWheelSizes.value.filter(s => s !== size)
            : [...selectedWheelSizes.value, size];
    };

    const handlePropertyToggle = (propertyUuid: string) => {
        selectedGeneralProperties.value = selectedGeneralProperties.value.includes(propertyUuid)
            ? selectedGeneralProperties.value.filter(p => p !== propertyUuid)
            : [...selectedGeneralProperties.value, propertyUuid];
    };

    // Generic toggle for strings in Custom Fields
    const handleArrayToggle = (arr: import('vue').Ref<string[]>, val: string) => {
        arr.value = arr.value.includes(val) ? arr.value.filter(v => v !== val) : [...arr.value, val];
    };

    const toggleWheelsNorm = (val: string) => handleArrayToggle(selectedWheelsNorm, val);
    const toggleForkNorm = (val: string) => handleArrayToggle(selectedForkNorm, val);
    const toggleBrakesNorm = (val: string) => handleArrayToggle(selectedBrakesNorm, val);
    const toggleGearsNorm = (val: string) => handleArrayToggle(selectedGearsNorm, val);
    const toggleMotorNorm = (val: string) => handleArrayToggle(selectedMotorNorm, val);
    const toggleBatteryNorm = (val: string) => handleArrayToggle(selectedBatteryNorm, val);
    const toggleColorNorm = (val: string) => handleArrayToggle(selectedColors, val);

    return {
        selectedBrands,
        selectedProperties, 
        selectedSizes,
        selectedGenders,
        selectedColors,
        selectedWheelSizes,
        selectedGeneralProperties,
        priceRange,
        inStockOnly,
        onDemandOnly,
        isPromotion,
        isFeatured,
        searchQuery,
        sortBy,
        riderHeight,
        selectedWheelsNorm,
        selectedForkNorm,
        selectedBrakesNorm,
        selectedGearsNorm,
        selectedMotorNorm,
        selectedBatteryNorm,
        activeFilterCount,
        clearAllFilters,
        handleBrandToggle,
        handleSizeToggle,
        handleGenderToggle,
        handleColorToggle,
        handleWheelSizeToggle,
        handlePropertyToggle,
        handleArrayToggle,
        toggleWheelsNorm,
        toggleForkNorm,
        toggleBrakesNorm,
        toggleGearsNorm,
        toggleMotorNorm,
        toggleBatteryNorm,
        toggleColorNorm,
    };
};
