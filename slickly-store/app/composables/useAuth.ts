import { useCookie, useRuntimeConfig } from '#app';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RegisterPayload {
  salutationId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billingAddress: {
    street: string;
    zipcode: string;
    city: string;
    countryId: string;
    salutationId?: string;
  };
}

// ---------------------------------------------------------------------------
// Shopware error message map (SK)
// ---------------------------------------------------------------------------
export const SW_ERROR_MAP: Record<string, string> = {
  'CHECKOUT__CUSTOMER_AUTH_THROTTLED': 'Príliš veľa neúspešných pokusov. Skúste to prosím neskôr.',
  'CHECKOUT__CUSTOMER_NOT_FOUND': 'Zákazník s týmto emailom nebol nájdený.',
  'CHECKOUT__CUSTOMER_WRONG_PASSWORD': 'Nesprávny email alebo heslo.',
  'CHECKOUT__CUSTOMER_IS_INACTIVE': 'Váš účet je neaktívny. Kontaktujte nás.',
  'VIOLATION::INVALID_EMAIL_FORMAT': 'Neplatný formát emailovej adresy.',
  'VIOLATION::EMAIL_ALREADY_EXISTS': 'Tento email je už zaregistrovaný.',
  'VIOLATION::PASSWORD_POLICIES_VIOLATED': 'Heslo nespĺňa bezpečnostné požiadavky (min. 8 znakov).',
};

export function mapSwError(err: any): string {
  const errors: any[] = err?.details?.errors ?? err?.errors ?? [];
  if (errors.length > 0) {
    const code = errors[0]?.code ?? errors[0]?.messageKey ?? '';
    if (SW_ERROR_MAP[code]) return SW_ERROR_MAP[code];
    const detail = errors[0]?.detail ?? errors[0]?.message ?? '';
    if (detail) return detail;
  }
  const msg = err?.data?.errors?.[0]?.detail ?? err?.message ?? '';
  return SW_ERROR_MAP[msg] ?? 'Nastala chyba. Skúste to prosím znova.';
}

// ---------------------------------------------------------------------------
// Composable — only provides cookie + password recovery via $fetch
// login/logout/register are handled directly in components via useUser()
// ---------------------------------------------------------------------------
export function useAuth() {
  const config = useRuntimeConfig();
  const shopwareEndpoint: string =
    (config.public?.shopware as any)?.endpoint ?? `${(config.public.siteUrl as string) || 'https://mtsport.store'}/store-api/`;
  const accessToken: string =
    (config.public?.shopware as any)?.accessToken ?? '';

  const { isLoading } = storeToRefs(useAuthStore());

  // sw-context-token cookie — read/write by auth-token.ts plugin
  const tokenCookie = useCookie<string | null>('sw-context-token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
  });

  // ------------------------------------------------------------------
  // sendPasswordRecovery — direct $fetch (no composable needed)
  // POST /store-api/account/recovery-password
  // ------------------------------------------------------------------
  async function sendPasswordRecovery(email: string): Promise<void> {
    isLoading.value = true;
    try {
      const base = shopwareEndpoint.replace(/\/$/, '');
      await $fetch(`${base}/account/recovery-password`, {
        method: 'POST',
        headers: {
          'sw-access-key': accessToken,
          'Content-Type': 'application/json',
          ...(tokenCookie.value ? { 'sw-context-token': tokenCookie.value } : {}),
        },
        body: {
          email,
          storefrontUrl: typeof window !== 'undefined' ? window.location.origin : (config.public.siteUrl as string || 'https://mtsport.store'),
        },
      });
    } catch (err: any) {
      const status = err?.response?.status ?? err?.statusCode ?? 0;
      // Shopware returns 200 for unknown emails (security by design) — only throw on real errors
      if (status >= 400) throw new Error(mapSwError(err?.data ?? err));
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    tokenCookie,
    sendPasswordRecovery,
    mapSwError,
  };
}
