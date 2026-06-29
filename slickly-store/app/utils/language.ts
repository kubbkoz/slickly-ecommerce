import { useRuntimeConfig } from '#imports';

export type LanguageMap = Record<string, string>;

/**
 * Returns the centralized Shopware language ID map from runtimeConfig.
 * Must be called within a Nuxt context (setup, plugin, middleware).
 */
export const getLanguageMap = (): LanguageMap => {
  try {
    const config = useRuntimeConfig();
    return (config.public.shopware.ids.languages as LanguageMap) || {};
  } catch (e) {
    // If context is missing, we return empty object. 
    // The calling functions handle the fallback to 'sk' which will then fail safely if not in env.
    return {};
  }
};

export const getLanguageIdFromPath = (path: string): string => {
  const map = getLanguageMap();
  const parts = path.split("/");
  const prefix = parts[1] || "sk";
  
  // Strict check: if the ID is missing in env mapping, we don't use a hardcoded fallback.
  return map[prefix] || map.sk || "";
};

export const getLocaleFromPath = (path: string): string => {
  const map = getLanguageMap();
  const parts = path.split("/");
  const prefix = parts[1] || "sk";
  return map[prefix] ? prefix : "sk";
};
