export default defineNuxtPlugin({
  name: 'mts-fix-locale',
  parallel: true,
  setup(nuxtApp) {
    // The shopware object is injected into the Vue app context
    // by the @shopware/nuxt-module plugin.
    const shopwareContext = nuxtApp.vueApp._context?.provides?.shopware;

    if (shopwareContext && shopwareContext.browserLocale) {
      try {
        // Test if the current environment supports the locale format
        new Intl.NumberFormat(shopwareContext.browserLocale);
      } catch (e) {
        console.warn(`[fix-locale] Invalid browserLocale detected: "${shopwareContext.browserLocale}". Falling back to en-US to prevent SSR crashes.`);
        shopwareContext.browserLocale = "en-US";
      }
    }
  }
});
