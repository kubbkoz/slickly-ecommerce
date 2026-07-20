import type { Ref } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as any;
  const locale = i18n.locale as Ref<string>;

  // Maps i18n locale codes → CC translation keys (cz → cs-CZ but we use 'cz' for consistency)
  const getCcLang = (loc: string) => loc;

  // PERF: the vanilla-cookieconsent library + its modal-building `run()` call used
  // to load and execute SYNCHRONOUSLY at client init, competing with app hydration
  // and inflating Total Blocking Time (PageSpeed flagged this plugin's boot work).
  // It's now dynamic-imported and deferred to onNuxtReady (after hydration, on
  // browser idle), and CC is held in this ref so the provided $cc.* helpers still
  // work once it's loaded. This is safe: nothing non-essential fires before consent
  // anyway — gtag consent defaults to 'denied' (see nuxt.config head script) — so the
  // banner appearing a beat after first paint changes nothing about tracking behaviour.
  let CC: typeof import('vanilla-cookieconsent') | null = null;

  const updateGcm = () => {
    const win = window as any;
    if (!CC || typeof win.gtag !== 'function') return;
    const accepted = CC.getUserPreferences().acceptedCategories;
    win.gtag('consent', 'update', {
      analytics_storage:       accepted.includes('analytics') ? 'granted' : 'denied',
      ad_storage:              accepted.includes('marketing') ? 'granted' : 'denied',
      ad_user_data:            accepted.includes('marketing') ? 'granted' : 'denied',
      ad_personalization:      accepted.includes('marketing') ? 'granted' : 'denied',
      functionality_storage:   'granted',
      personalization_storage: accepted.includes('marketing') ? 'granted' : 'denied',
    });
  };

  onNuxtReady(async () => {
    CC = await import('vanilla-cookieconsent');

    CC.run({
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
  });

  // Sync CC language when user switches app locale (set up synchronously in the
  // plugin scope; no-ops until CC has finished loading in onNuxtReady above).
  watch(locale, (newLocale) => {
    CC?.setLanguage(getCcLang(newLocale), true);
  });

  return {
    provide: {
      cc: {
        show:            () => CC?.show(true),
        showPreferences: () => CC?.showPreferences(),
        hide:            () => CC?.hide(),
        accepted:        (cat: 'necessary' | 'analytics' | 'marketing') =>
                           CC?.acceptedCategory(cat) ?? false,
        validConsent:    () => CC?.validConsent() ?? false,
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
