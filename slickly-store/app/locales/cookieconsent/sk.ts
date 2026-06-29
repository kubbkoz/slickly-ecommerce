import type { Translation } from 'vanilla-cookieconsent';

const sk: Translation = {
  consentModal: {
    title: 'NASTAVENIA SÚKROMIA',
    description:
      'Aby sme vám vedeli lepšie poradiť s výberom bicykla a komponentov, používame cookies na analýzu návštevnosti a personalizáciu obsahu. Vaše súkromie je pre nás dôležité — vyberte si, čo nám povolíte spracovávať.',
    acceptAllBtn: 'Prijať všetky',
    acceptNecessaryBtn: 'Odmietnuť',
    showPreferencesBtn: 'Nastavenia',
    footer:
      '<a href="/ochrana-sukromia">Ochrana súkromia</a> · <a href="/vseobecne-obchodne-podmienky">Podmienky</a>',
  },
  preferencesModal: {
    title: 'NASTAVENIA COOKIES',
    acceptAllBtn: 'Prijať všetky',
    acceptNecessaryBtn: 'Odmietnuť všetky',
    savePreferencesBtn: 'Uložiť výber',
    closeIconLabel: 'Zavrieť',
    serviceCounterLabel: 'Služba|Služby',
    sections: [
      {
        title: 'Ako používame cookies',
        description:
          'Cookies sú malé textové súbory ukladané vo vašom prehliadači. Niektoré sú nevyhnutné pre chod e-shopu, iné nám pomáhajú vylepšovať zážitok z nákupu. Podrobnejšie informácie nájdete v <a href="/ochrana-sukromia">Ochrane súkromia</a>.',
      },
      {
        title: 'Nevyhnutné cookies',
        description:
          'Tieto cookies sú potrebné pre základnú funkčnosť webu — prihlásenie, nákupný košík a bezpečnosť. Bez nich by e-shop nefungoval správne. Nedajú sa vypnúť.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Názov', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Shopware session token — prihlásenie a košík',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Uloženie vašich preferencií cookies',
            },
          ],
        },
      },
      {
        title: 'Analytické cookies',
        description:
          'Google Analytics nám pomáha pochopiť, ako návštevníci používajú web, aby sme mohli zlepšovať obsah a navigáciu.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Názov', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — unikátny identifikátor návštevníka (2 roky)',
            },
            {
              name: '_ga_*',
              domain: 'mtsport.store',
              desc: 'Google Analytics 4 — identifikátor session (2 roky)',
            },
          ],
        },
      },
      {
        title: 'Marketingové cookies',
        description:
          'Meta Pixel nám umožňuje zobrazovať relevantnejšie reklamy na Facebooku a Instagrame a merať ich efektivitu.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Názov', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — identifikátor prehliadača (3 mesiace)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — sledovanie konverzií z reklám',
            },
          ],
        },
      },
    ],
  },
};

export default sk;
