import { computed } from 'vue';
import { g as useState } from './server.mjs';

const useCategoryFilters = () => {
  const selectedBrands = useState("cf-brands", () => []);
  const selectedSizes = useState("cf-sizes", () => []);
  const selectedGenders = useState("cf-genders", () => []);
  const selectedColors = useState("cf-colors", () => []);
  const selectedWheelSizes = useState("cf-wheels", () => []);
  const selectedGeneralProperties = useState("cf-gen-props", () => []);
  const priceRange = useState("cf-price", () => [0, 1e4]);
  const inStockOnly = useState("cf-instock", () => false);
  const onDemandOnly = useState("cf-ondemand", () => false);
  const isPromotion = useState("cf-promo", () => false);
  const isFeatured = useState("cf-featured", () => false);
  const searchQuery = useState("cf-search", () => "");
  const sortBy = useState("cf-sort", () => "name-asc");
  const riderHeight = useState("cf-rider-height", () => null);
  const selectedWheelsNorm = useState("cf-wheels-norm", () => []);
  const selectedForkNorm = useState("cf-fork-norm", () => []);
  const selectedBrakesNorm = useState("cf-brakes-norm", () => []);
  const selectedGearsNorm = useState("cf-gears-norm", () => []);
  const selectedMotorNorm = useState("cf-motor-norm", () => []);
  const selectedBatteryNorm = useState("cf-battery-norm", () => []);
  const selectedProperties = computed(() => [
    ...selectedSizes.value,
    ...selectedGenders.value,
    ...selectedWheelSizes.value,
    ...selectedGeneralProperties.value
  ]);
  const activeFilterCount = computed(() => {
    let count = 0;
    if (selectedBrands.value.length) count += selectedBrands.value.length;
    if (selectedSizes.value.length) count += selectedSizes.value.length;
    if (selectedGenders.value.length) count += selectedGenders.value.length;
    if (selectedColors.value.length) count += selectedColors.value.length;
    if (selectedWheelSizes.value.length) count += selectedWheelSizes.value.length;
    if (selectedGeneralProperties.value.length) count += selectedGeneralProperties.value.length;
    if (riderHeight.value) count++;
    if (selectedWheelsNorm.value.length) count += selectedWheelsNorm.value.length;
    if (selectedForkNorm.value.length) count += selectedForkNorm.value.length;
    if (selectedBrakesNorm.value.length) count += selectedBrakesNorm.value.length;
    if (selectedGearsNorm.value.length) count += selectedGearsNorm.value.length;
    if (selectedMotorNorm.value.length) count += selectedMotorNorm.value.length;
    if (selectedBatteryNorm.value.length) count += selectedBatteryNorm.value.length;
    if (priceRange.value[0] > 0 || priceRange.value[1] < 1e4) count++;
    if (inStockOnly.value) count++;
    if (onDemandOnly.value) count++;
    if (isPromotion.value) count++;
    if (isFeatured.value) count++;
    return count;
  });
  const clearAllFilters = () => {
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
    priceRange.value = [0, 1e4];
    inStockOnly.value = false;
    onDemandOnly.value = false;
    isPromotion.value = false;
    isFeatured.value = false;
    searchQuery.value = "";
  };
  const handleBrandToggle = (brandId) => {
    selectedBrands.value = selectedBrands.value.includes(brandId) ? selectedBrands.value.filter((b) => b !== brandId) : [...selectedBrands.value, brandId];
  };
  const handleSizeToggle = (size) => {
    selectedSizes.value = selectedSizes.value.includes(size) ? selectedSizes.value.filter((s) => s !== size) : [...selectedSizes.value, size];
  };
  const handleGenderToggle = (gender) => {
    selectedGenders.value = selectedGenders.value.includes(gender) ? selectedGenders.value.filter((g) => g !== gender) : [...selectedGenders.value, gender];
  };
  const handleColorToggle = (color) => {
    selectedColors.value = selectedColors.value.includes(color) ? selectedColors.value.filter((c) => c !== color) : [...selectedColors.value, color];
  };
  const handleWheelSizeToggle = (size) => {
    selectedWheelSizes.value = selectedWheelSizes.value.includes(size) ? selectedWheelSizes.value.filter((s) => s !== size) : [...selectedWheelSizes.value, size];
  };
  const handlePropertyToggle = (propertyUuid) => {
    selectedGeneralProperties.value = selectedGeneralProperties.value.includes(propertyUuid) ? selectedGeneralProperties.value.filter((p) => p !== propertyUuid) : [...selectedGeneralProperties.value, propertyUuid];
  };
  const handleArrayToggle = (arr, val) => {
    arr.value = arr.value.includes(val) ? arr.value.filter((v) => v !== val) : [...arr.value, val];
  };
  const toggleWheelsNorm = (val) => handleArrayToggle(selectedWheelsNorm, val);
  const toggleForkNorm = (val) => handleArrayToggle(selectedForkNorm, val);
  const toggleBrakesNorm = (val) => handleArrayToggle(selectedBrakesNorm, val);
  const toggleGearsNorm = (val) => handleArrayToggle(selectedGearsNorm, val);
  const toggleMotorNorm = (val) => handleArrayToggle(selectedMotorNorm, val);
  const toggleBatteryNorm = (val) => handleArrayToggle(selectedBatteryNorm, val);
  const toggleColorNorm = (val) => handleArrayToggle(selectedColors, val);
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
    toggleColorNorm
  };
};

export { useCategoryFilters as u };
