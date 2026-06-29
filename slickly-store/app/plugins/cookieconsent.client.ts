import * as CookieConsent from 'vanilla-cookieconsent';
import type { Ref } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as any;
  const locale = i18n.locale as Ref<string>;

  // Maps i18n locale codes → CC translation keys (cz → cs-CZ but we use 'cz' for consistency)
  const getCcLang = (loc: string) => loc;

  const updateGcm = () => {
    const win = window as any;
    if (typeof win.gtag !== 'function') return;
    const accepted = CookieConsent.getUserPreferences().acceptedCategories;
    win.gtag('consent', 'update', {
      analytics_storage:       accepted.includes('analytics') ? 'granted' : 'denied',
      ad_storage:              accepted.includes('marketing') ? 'granted' : 'denied',
      ad_user_data:            accepted.includes('marketing') ? 'granted' : 'denied',
      ad_personalization:      accepted.includes('marketing') ? 'granted' : 'denied',
      functionality_storage:   'granted',
      personalization_storage: accepted.includes('marketing') ? 'granted' : 'denied',
    });
  };

  CookieConsent.run({
    // Cookie name matching the existing Klaro name so returning visitors aren't re-prompted
    cookie: {
      name: 'mtsport-cc',
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }],
        },
      },
      marketing: {
        autoClear: {
          cookies: [
            { name: '_fbp', domain: '.mtsport.store' },
            { name: '_fbc', domain: '.mtsport.store' },
          ],
        },
      },
    },

    language: {
      default: getCcLang(locale.value),
      translations: {
        sk: () => import('~/locales/cookieconsent/sk').then((m) => m.default),
        cz: () => import('~/locales/cookieconsent/cz').then((m) => m.default),
        de: () => import('~/locales/cookieconsent/de').then((m) => m.default),
        hu: () => import('~/locales/cookieconsent/hu').then((m) => m.default),
        en: () => import('~/locales/cookieconsent/en').then((m) => m.default),
        pl: () => import('~/locales/cookieconsent/pl').then((m) => m.default),
      },
    },

    onFirstConsent: updateGcm,
    onConsent: updateGcm,
    onChange: updateGcm,

    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom left',
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
  });

  // Sync CC language when user switches app locale
  watch(locale, (newLocale) => {
    CookieConsent.setLanguage(getCcLang(newLocale), true);
  });

  return {
    provide: {
      cc: {
        show:            () => CookieConsent.show(true),
        showPreferences: () => CookieConsent.showPreferences(),
        hide:            () => CookieConsent.hide(),
        accepted:        (cat: 'necessary' | 'analytics' | 'marketing') =>
                           CookieConsent.acceptedCategory(cat),
        validConsent:    () => CookieConsent.validConsent(),
      },
    },
  };
});

declare module '#app' {
  interface NuxtApp {
    $cc: {
      show: () => void;
      showPreferences: () => void;
      hide: () => void;
      accepted: (cat: 'necessary' | 'analytics' | 'marketing') => boolean;
      validConsent: () => boolean;
    };
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $cc: {
      show: () => void;
      showPreferences: () => void;
      hide: () => void;
      accepted: (cat: 'necessary' | 'analytics' | 'marketing') => boolean;
      validConsent: () => boolean;
    };
  }
}
