import type { Translation } from 'vanilla-cookieconsent';

const pl: Translation = {
  consentModal: {
    title: 'USTAWIENIA PRYWATNOŚCI',
    description:
      'Aby lepiej pomóc Ci w wyborze roweru i komponentów, używamy plików cookie do analizy ruchu i personalizacji treści. Twoja prywatność jest dla nas ważna — wybierz, co nam wolno przetwarzać.',
    acceptAllBtn: 'Akceptuj wszystkie',
    acceptNecessaryBtn: 'Odrzuć',
    showPreferencesBtn: 'Ustawienia',
    footer:
      '<a href="/polityka-prywatnosci">Polityka prywatności</a> · <a href="/regulamin">Regulamin</a>',
  },
  preferencesModal: {
    title: 'USTAWIENIA PLIKÓW COOKIE',
    acceptAllBtn: 'Akceptuj wszystkie',
    acceptNecessaryBtn: 'Odrzuć wszystkie',
    savePreferencesBtn: 'Zapisz wybór',
    closeIconLabel: 'Zamknij',
    serviceCounterLabel: 'Usługa|Usługi',
    sections: [
      {
        title: 'Jak używamy plików cookie',
        description:
          'Pliki cookie to małe pliki tekstowe przechowywane w przeglądarce. Niektóre są niezbędne do działania sklepu, inne pomagają nam poprawić doświadczenie zakupowe. Więcej informacji znajdziesz w naszej <a href="/polityka-prywatnosci">Polityce prywatności</a>.',
      },
      {
        title: 'Niezbędne pliki cookie',
        description:
          'Te pliki cookie są wymagane do podstawowego funkcjonowania witryny — logowanie, koszyk i bezpieczeństwo. Nie można ich wyłączyć.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Nazwa', domain: 'Domena', desc: 'Opis' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Token sesji Shopware — logowanie i koszyk',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Przechowywanie Twoich preferencji cookie',
            },
          ],
        },
      },
      {
        title: 'Analityczne pliki cookie',
        description:
          'Google Analytics pomaga nam zrozumieć, jak odwiedzający korzystają z witryny, abyśmy mogli poprawić treści i nawigację.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Nazwa', domain: 'Domena', desc: 'Opis' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — unikalny identyfikator odwiedzającego (2 lata)',
            },
            {
              name: '_ga_*',
              domain: 'mtsport.store',
              desc: 'Google Analytics 4 — identyfikator sesji (2 lata)',
            },
          ],
        },
      },
      {
        title: 'Marketingowe pliki cookie',
        description:
          'Meta Pixel pozwala nam wyświetlać trafniejsze reklamy na Facebooku i Instagramie oraz mierzyć ich skuteczność.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Nazwa', domain: 'Domena', desc: 'Opis' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — identyfikator przeglądarki (3 miesiące)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — śledzenie konwersji z reklam',
            },
          ],
        },
      },
    ],
  },
};

export default pl;
