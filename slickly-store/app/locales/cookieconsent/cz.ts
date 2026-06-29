import type { Translation } from 'vanilla-cookieconsent';

const cz: Translation = {
  consentModal: {
    title: 'NASTAVENÍ SOUKROMÍ',
    description:
      'Abychom vám mohli lépe poradit s výběrem kola a komponentů, používáme cookies k analýze návštěvnosti a personalizaci obsahu. Vaše soukromí je pro nás důležité — vyberte, co nám povolíte zpracovávat.',
    acceptAllBtn: 'Přijmout vše',
    acceptNecessaryBtn: 'Odmítnout',
    showPreferencesBtn: 'Nastavení',
    footer:
      '<a href="/ochrana-soukromi">Ochrana soukromí</a> · <a href="/obchodni-podminky">Podmínky</a>',
  },
  preferencesModal: {
    title: 'NASTAVENÍ COOKIES',
    acceptAllBtn: 'Přijmout vše',
    acceptNecessaryBtn: 'Odmítnout vše',
    savePreferencesBtn: 'Uložit výběr',
    closeIconLabel: 'Zavřít',
    serviceCounterLabel: 'Služba|Služby',
    sections: [
      {
        title: 'Jak používáme cookies',
        description:
          'Cookies jsou malé textové soubory ukládané ve vašem prohlížeči. Některé jsou nezbytné pro provoz e-shopu, jiné nám pomáhají zlepšovat zážitek z nákupu. Více informací naleznete v <a href="/ochrana-soukromi">Ochraně soukromí</a>.',
      },
      {
        title: 'Nezbytné cookies',
        description:
          'Tyto cookies jsou potřebné pro základní funkčnost webu — přihlášení, nákupní košík a bezpečnost. Nelze je vypnout.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Název', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Shopware session token — přihlášení a košík',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Uložení vašich preferencí cookies',
            },
          ],
        },
      },
      {
        title: 'Analytické cookies',
        description:
          'Google Analytics nám pomáhá pochopit, jak návštěvníci web používají, abychom mohli zlepšovat obsah a navigaci.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Název', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — unikátní identifikátor návštěvníka (2 roky)',
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
          'Meta Pixel nám umožňuje zobrazovat relevantnější reklamy na Facebooku a Instagramu a měřit jejich efektivitu.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Název', domain: 'Doména', desc: 'Popis' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — identifikátor prohlížeče (3 měsíce)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — sledování konverzí z reklam',
            },
          ],
        },
      },
    ],
  },
};

export default cz;
