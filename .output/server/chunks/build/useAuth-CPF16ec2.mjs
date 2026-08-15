import { p as useCookie, i as useRuntimeConfig } from './server.mjs';
import { ref } from 'vue';
import { storeToRefs, defineStore } from 'pinia';

const useAuthStore = defineStore("auth", () => {
  const isLoading = ref(false);
  return { isLoading };
});
const SW_ERROR_MAP = {
  "CHECKOUT__CUSTOMER_AUTH_THROTTLED": "Príliš veľa neúspešných pokusov. Skúste to prosím neskôr.",
  "CHECKOUT__CUSTOMER_NOT_FOUND": "Zákazník s týmto emailom nebol nájdený.",
  "CHECKOUT__CUSTOMER_WRONG_PASSWORD": "Nesprávny email alebo heslo.",
  "CHECKOUT__CUSTOMER_IS_INACTIVE": "Váš účet je neaktívny. Kontaktujte nás.",
  "VIOLATION::INVALID_EMAIL_FORMAT": "Neplatný formát emailovej adresy.",
  "VIOLATION::EMAIL_ALREADY_EXISTS": "Tento email je už zaregistrovaný.",
  "VIOLATION::PASSWORD_POLICIES_VIOLATED": "Heslo nespĺňa bezpečnostné požiadavky (min. 8 znakov)."
};
function mapSwError(err) {
  const errors = err?.details?.errors ?? err?.errors ?? [];
  if (errors.length > 0) {
    const code = errors[0]?.code ?? errors[0]?.messageKey ?? "";
    if (SW_ERROR_MAP[code]) return SW_ERROR_MAP[code];
    const detail = errors[0]?.detail ?? errors[0]?.message ?? "";
    if (detail) return detail;
  }
  const msg = err?.data?.errors?.[0]?.detail ?? err?.message ?? "";
  return SW_ERROR_MAP[msg] ?? "Nastala chyba. Skúste to prosím znova.";
}
function useAuth() {
  const config = useRuntimeConfig();
  const shopwareEndpoint = config.public?.shopware?.endpoint ?? `${config.public.siteUrl || "https://mtsport.store"}/store-api/`;
  const accessToken = config.public?.shopware?.accessToken ?? "";
  const { isLoading } = storeToRefs(useAuthStore());
  const tokenCookie = useCookie("sw-context-token", {
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    secure: "production" === "production"
  });
  async function sendPasswordRecovery(email) {
    isLoading.value = true;
    try {
      const base = shopwareEndpoint.replace(/\/$/, "");
      await $fetch(`${base}/account/recovery-password`, {
        method: "POST",
        headers: {
          "sw-access-key": accessToken,
          "Content-Type": "application/json",
          ...tokenCookie.value ? { "sw-context-token": tokenCookie.value } : {}
        },
        body: {
          email,
          storefrontUrl: false ? (void 0).location.origin : config.public.siteUrl || "https://mtsport.store"
        }
      });
    } catch (err) {
      const status = err?.response?.status ?? err?.statusCode ?? 0;
      if (status >= 400) throw new Error(mapSwError(err?.data ?? err));
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    tokenCookie,
    sendPasswordRecovery,
    mapSwError
  };
}

export { useAuth as u };
