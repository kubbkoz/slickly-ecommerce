import { defineNuxtRouteMiddleware } from "#app";
import { useShopwareContext, useShopwareLanguage, useSessionContext } from "#imports";
import { getLanguageIdFromPath, getLocaleFromPath } from "~/utils/language";

export default defineNuxtRouteMiddleware(async (to) => {
  const { apiClient } = useShopwareContext();
  const { currentLanguageId } = useShopwareLanguage();
  // FIX: refreshSessionContext must be called after context update so the session
  // is fully rehydrated before any page fetch begins — prevents Ghost Prefix 404s.
  const { refreshSessionContext } = useSessionContext();

  const targetLangId = getLanguageIdFromPath(to.path);
  const targetLocale = getLocaleFromPath(to.path);

  // Vynútenie synchronizácie kontextu, ak sa ID nezhodujú
  if (currentLanguageId.value !== targetLangId) {
    try {
      await apiClient.invoke("updateContext patch /context", {
        body: { languageId: targetLangId },
      });
      // FIX: Await session refresh so composables get fresh language context
      // before the next route's useAsyncData calls fire.
      await refreshSessionContext();
      console.log(`[LanguageSync] Context & session switched to: ${targetLocale} (${targetLangId})`);
    } catch (e) {
      console.error("[LanguageSync] Failed to sync context:", e);
    }
  }
});
