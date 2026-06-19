import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

export default defineNuxtPlugin(() => {
  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'bar',
        position: 'bottom',
        equalWeightButtons: false,
      },
      preferencesModal: {
        layout: 'box',
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: '_gid' },
          ],
        },
      },
      marketing: {
        autoClear: {
          cookies: [
            { name: /^_fb/ },
          ],
        },
      },
    },

    language: {
      default: 'sk',
      translations: {
        sk: {
          consentModal: {
            title: 'Používame cookies',
            description:
              'Táto stránka používa cookies na zabezpečenie základnej funkčnosti a na analýzu návštevnosti. Kliknutím na „Prijať všetky" súhlasíte s používaním všetkých cookies. Svoje preferencie môžete kedykoľvek zmeniť.',
            acceptAllBtn: 'Prijať všetky',
            acceptNecessaryBtn: 'Len nevyhnutné',
            showPreferencesBtn: 'Nastavenia cookies',
          },
          preferencesModal: {
            title: 'Nastavenia cookies',
            acceptAllBtn: 'Prijať všetky',
            acceptNecessaryBtn: 'Len nevyhnutné',
            savePreferencesBtn: 'Uložiť nastavenia',
            closeIconLabel: 'Zavrieť',
            sections: [
              {
                title: 'Používanie cookies',
                description:
                  'Cookies používame na zabezpečenie základných funkcií stránky a na zlepšenie vašej online skúsenosti. Pre každú kategóriu si môžete zvoliť, či chcete povoliť alebo zakázať ich používanie.',
              },
              {
                title: 'Nevyhnutné cookies',
                description:
                  'Tieto cookies sú nevyhnutné pre správne fungovanie webovej stránky. Bez nich by stránka nefungovala správne.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytické cookies',
                description:
                  'Tieto cookies nám pomáhajú porozumieť, ako návštevníci používajú našu stránku. Informácie sú zbierané anonymne.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Marketingové cookies',
                description:
                  'Tieto cookies sa používajú na sledovanie návštevníkov naprieč webovými stránkami za účelom zobrazovania relevantných reklám.',
                linkedCategory: 'marketing',
              },
            ],
          },
        },
      },
    },
  })

  return {
    provide: {
      cookieConsent: CookieConsent,
    },
  }
})
