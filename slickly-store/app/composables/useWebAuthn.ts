// useWebAuthn — centralizovaná logika pre passkey operácie.
// Komponenty (BiometricLogin, BiometricSetup, device manager) volajú tieto funkcie
// namiesto duplikovania $fetch volaní na /api/webauthn/*.

import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';

export interface PasskeyCredential {
  id: string;
  deviceName: string;
  createdAt: number;
  transports: string[];
}

export const useWebAuthn = () => {
  // ─── Capability detection ─────────────────────────────────────────────
  // Skontroluje, či browser podporuje platform authenticator (Face ID / Touch ID / Windows Hello).
  // Volá sa onMounted v UI komponentoch (vždy klient-side).
  const isSupported = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    if (!window.PublicKeyCredential) return false;
    if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
      return false;
    }
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  };

  // ─── Device name detection ────────────────────────────────────────────
  // Vráti čitateľný názov platform authenticator-a podľa user agentu.
  const detectDeviceName = (): string => {
    if (typeof navigator === 'undefined') return 'Zariadenie';
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'Face ID / Touch ID';
    if (/Mac/.test(ua)) return 'Touch ID';
    if (/Windows/.test(ua)) return 'Windows Hello';
    if (/Android/.test(ua)) return 'Android Biometric';
    return 'Zariadenie';
  };

  // ─── REGISTRATION (Setup) ──────────────────────────────────────────────
  // Vytvorí nový passkey pre prihláseného customera.
  // 1) get registration options + challenge → 2) prompt biometria → 3) odoslať na server
  const registerPasskey = async (email: string, deviceName?: string): Promise<void> => {
    const { startRegistration } = await import('@simplewebauthn/browser');

    const options = await $fetch<PublicKeyCredentialCreationOptionsJSON>(
      '/api/webauthn/register-options',
      { method: 'POST', body: { email } }
    );

    const credential = await startRegistration({ optionsJSON: options });

    await $fetch('/api/webauthn/register', {
      method: 'POST',
      body: {
        email,
        deviceName: deviceName || detectDeviceName(),
        credential,
      },
    });
  };

  // ─── LOGIN (Authenticate) ──────────────────────────────────────────────
  // Discoverable credential flow — zariadenie samo zvolí passkey pre doménu.
  // Po úspechu server nastaví sw-context-token cookie.
  const loginWithPasskey = async (): Promise<void> => {
    const { startAuthentication } = await import('@simplewebauthn/browser');

    const options = await $fetch<PublicKeyCredentialRequestOptionsJSON>(
      '/api/webauthn/login-options',
      { method: 'POST' }
    );

    const credential = await startAuthentication({ optionsJSON: options });

    await $fetch('/api/webauthn/login', {
      method: 'POST',
      body: {
        credential: { ...credential, challenge: options.challenge },
      },
    });
  };

  // ─── DEVICE MANAGEMENT ─────────────────────────────────────────────────
  const listPasskeys = async (): Promise<PasskeyCredential[]> => {
    const res = await $fetch<{ credentials: PasskeyCredential[] }>('/api/webauthn/credentials');
    return res.credentials || [];
  };

  const deletePasskey = async (credentialId: string): Promise<void> => {
    await $fetch('/api/webauthn/credentials', {
      method: 'DELETE',
      body: { credentialId },
    });
  };

  return {
    isSupported,
    detectDeviceName,
    registerPasskey,
    loginWithPasskey,
    listPasskeys,
    deletePasskey,
  };
};
