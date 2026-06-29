import type { Translation } from 'vanilla-cookieconsent';

const en: Translation = {
  consentModal: {
    title: 'PRIVACY SETTINGS',
    description:
      'To better help you choose the right bike and components, we use cookies to analyse traffic and personalise content. Your privacy matters to us — choose what you allow us to process.',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Reject',
    showPreferencesBtn: 'Manage preferences',
    footer:
      '<a href="/privacy-policy">Privacy Policy</a> · <a href="/terms-and-conditions">Terms</a>',
  },
  preferencesModal: {
    title: 'COOKIE PREFERENCES',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Reject all',
    savePreferencesBtn: 'Save preferences',
    closeIconLabel: 'Close',
    serviceCounterLabel: 'Service|Services',
    sections: [
      {
        title: 'How we use cookies',
        description:
          'Cookies are small text files stored in your browser. Some are essential for the shop to work, others help us improve your shopping experience. For more details see our <a href="/privacy-policy">Privacy Policy</a>.',
      },
      {
        title: 'Strictly necessary cookies',
        description:
          'These cookies are required for the basic functionality of the website — login, shopping cart and security. They cannot be disabled.',
        linkedCategory: 'necessary',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Description' },
          body: [
            {
              name: 'sw-context-token',
              domain: 'mtsport.store',
              desc: 'Shopware session token — login and cart',
            },
            {
              name: 'mtsport-cc',
              domain: 'mtsport.store',
              desc: 'Stores your cookie consent preferences',
            },
          ],
        },
      },
      {
        title: 'Analytics cookies',
        description:
          'Google Analytics helps us understand how visitors use the site so we can improve content and navigation.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Description' },
          body: [
            {
              name: '_ga',
              domain: 'mtsport.store',
              desc: 'Google Analytics — unique visitor identifier (2 years)',
            },
            {
              name: '_ga_*',
              domain: 'mtsport.store',
              desc: 'Google Analytics 4 — session identifier (2 years)',
            },
          ],
        },
      },
      {
        title: 'Marketing cookies',
        description:
          'Meta Pixel allows us to show more relevant ads on Facebook and Instagram and measure their effectiveness.',
        linkedCategory: 'marketing',
        cookieTable: {
          headers: { name: 'Name', domain: 'Domain', desc: 'Description' },
          body: [
            {
              name: '_fbp',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — browser identifier (3 months)',
            },
            {
              name: '_fbc',
              domain: 'mtsport.store',
              desc: 'Meta Pixel — ad conversion tracking',
            },
          ],
        },
      },
    ],
  },
};

export default en;
