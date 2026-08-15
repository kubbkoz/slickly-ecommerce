function useCmsElementConfig(element) {
  const getConfigValue = (key) => {
    if (!element?.config) {
      return void 0;
    }
    return element.config[key]?.source !== "mapped" && element.config[key]?.value;
  };
  return {
    getConfigValue
  };
}

export { useCmsElementConfig as u };
