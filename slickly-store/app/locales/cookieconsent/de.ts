import type { Translation } from 'vanilla-cookieconsent';

const de: Translation = {
  consentModal: {
    title: 'DATENSCHUTZEINSTELLUNGEN',
    description:
      'Um Ihnen bei der Auswahl von Fahrrädern und Komponenten besser helfen zu können, verwenden wir Cookies zur Analyse des Datenverkehrs und zur Personalisierung von Inhalten. Ihre Privatsphäre ist uns wichtig — wählen Sie, was wir verarbeiten dürfen.',
    acceptAllBtn: 'Alle akzeptieren',
    acceptNecessaryBtn: 'Ablehnen',
    showPreferencesBtn: 'Einstellungen',
    footer:
      '<a href="/datenschutz">Datenschutz</a> · <a href="/agb">AGB</a>',
  },
  preferencesModal: {
    title: 'COOKIE-EINSTELLUNGEN',
    acceptAllBtn: 'Alle akzeptieren',
    acceptNecessaryBtn: 'Alle ablehnen',
    savePreferencesBtn: 'Auswahl speichern',
    closeIconLabel: 'Schließen',
    serviceCounterLabel: 'Dienst|Dienste',
    sections: [
      {
        title: 'Wie wir Cookies verwenden',
        description:
          'Cookies sind kleine Textdateien, die in Ihrem Browser gespeichert werden. Einige sind für den Betrieb des Online-Shops notwendig, andere helfen uns, das Einkaufserlebnis zu verbessern. Weitere Informationen finden Sie in unserem <a href="/datenschutz">Datenschutz</a>.',
      },
      {
        title: 'Notwendige Cookies',
        description:
          'Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich — Anmeldung, Warenkorb und Sicherheit. Sie können nicht deaktiviert werden.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Shopware Session-Token — Anmeldung und Warenkorb',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Speicherung Ihrer Cookie-Einstellungen',
            },
          ],
        },
      },
      {
        title: 'Analytische Cookies',
        description:
          'Google Analytics hilft uns zu verstehen, wie Besucher die Website nutzen, damit wir Inhalte und Navigation verbessern können.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — eindeutiger Besucher-Identifikator (2 Jahre)',
            },
            {
              name: '_ga_*',
              domain: 'mtsport.store',
              desc: 'Google Analytics 4 — Session-Identifikator (2 Jahre)',
            },
          ],
        },
      },
      {
        title: 'Marketing-Cookies',
        description:
          'Meta Pixel ermöglicht es uns, relevantere Werbung auf Facebook und Instagram zu schalten und deren Effektivität zu messen.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Beschreibung' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — Browser-Identifikator (3 Monate)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — Conversion-Tracking aus Werbeanzeigen',
            },
          ],
        },
      },
    ],
  },
};

export default de;
