import type { Translation } from 'vanilla-cookieconsent';

const hu: Translation = {
  consentModal: {
    title: 'ADATVÉDELMI BEÁLLÍTÁSOK',
    description:
      'Azért, hogy jobban segíthessünk a kerékpár és alkatrész kiválasztásában, cookie-kat használunk a forgalom elemzésére és a tartalom személyre szabására. Az Ön adatvédelme fontos számunkra — válassza ki, mit engedélyez számunkra.',
    acceptAllBtn: 'Mindent elfogad',
    acceptNecessaryBtn: 'Elutasít',
    showPreferencesBtn: 'Beállítások',
    footer:
      '<a href="/adatvedelmi-iranyelvek">Adatvédelem</a> · <a href="/altalanos-szerzodesi-feltetelek">ÁSZF</a>',
  },
  preferencesModal: {
    title: 'COOKIE BEÁLLÍTÁSOK',
    acceptAllBtn: 'Mindent elfogad',
    acceptNecessaryBtn: 'Mindent elutasít',
    savePreferencesBtn: 'Mentés',
    closeIconLabel: 'Bezárás',
    serviceCounterLabel: 'Szolgáltatás|Szolgáltatások',
    sections: [
      {
        title: 'Hogyan használjuk a cookie-kat',
        description:
          'A cookie-k kis szövegfájlok, amelyeket a böngészője tárol. Néhányuk szükséges a webáruház működéséhez, mások segítenek javítani a vásárlási élményt. Részletes információk az <a href="/adatvedelmi-iranyelvek">Adatvédelmi irányelvekben</a> találhatók.',
      },
      {
        title: 'Szükséges cookie-k',
        description:
          'Ezek a cookie-k szükségesek a weboldal alapvető működéséhez — bejelentkezés, bevásárlókosár és biztonság. Nem kapcsolhatók ki.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Név', domain: 'Domain', desc: 'Leírás' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Shopware session token — bejelentkezés és kosár',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Cookie beállítások tárolása',
            },
          ],
        },
      },
      {
        title: 'Analitikai cookie-k',
        description:
          'A Google Analytics segít megérteni, hogyan használják a látogatók a weboldalt, hogy javíthassuk a tartalmat és a navigációt.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Név', domain: 'Domain', desc: 'Leírás' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — egyedi látogató azonosító (2 év)',
            },
            {
              name: '_ga_*',
              domain: 'mtsport.store',
              desc: 'Google Analytics 4 — session azonosító (2 év)',
            },
          ],
        },
      },
      {
        title: 'Marketing cookie-k',
        description:
          'A Meta Pixel lehetővé teszi számunkra, hogy relevánsabb hirdetéseket jelenítsünk meg a Facebookon és az Instagramon.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Név', domain: 'Domain', desc: 'Leírás' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — böngésző azonosító (3 hónap)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — hirdetés konverzió követés',
            },
          ],
        },
      },
    ],
  },
};

export default hu;
