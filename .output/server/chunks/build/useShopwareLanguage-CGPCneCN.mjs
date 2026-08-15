import { computed } from 'vue';
import { d as useRoute, i as useRuntimeConfig } from './server.mjs';

const getLocaleFromPath = (path, localesMap) => {
  const m = path.match(/^\/([a-z]{2})(\/|$)/);
  const prefix = m?.[1];
  if (prefix && localesMap[prefix]) return prefix;
  return "sk";
};
const useShopwareLanguage = () => {
  const config = useRuntimeConfig();
  const localesMap = config.public.shopware.ids.languages || {
    sk: "019b07fc0d2f7a23b565cd7e42b0e5bc",
    cz: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
    pl: "019b0806d86c71069f1c0d097c5b3638",
    en: "019b07f7c6b072c991abcabf79bb5a6b",
    de: "019b07f468e470c38d4e84718ebb0ef8",
    hu: "019bd9ff114d72f7aef7d0a1581809b8"
  };
  const getLanguageIdForLocale = (localeCode) => {
    return localesMap[localeCode] || localesMap.sk;
  };
  const getLocaleForLanguageId = (languageId) => {
    const found = Object.entries(localesMap).find(([_, id]) => id === languageId);
    return found ? found[0] : "sk";
  };
  const currentLanguageId = computed(() => {
    let path = "/";
    try {
      const route = useRoute();
      path = route?.path || "/";
    } catch (e) {
    }
    const routeLocale = getLocaleFromPath(path, localesMap);
    return getLanguageIdForLocale(routeLocale);
  });
  return {
    currentLanguageId,
    getLanguageIdForLocale,
    getLocaleForLanguageId,
    LOCALE_TO_SHOPWARE_ID: localesMap
  };
};

export { useShopwareLanguage as u };
