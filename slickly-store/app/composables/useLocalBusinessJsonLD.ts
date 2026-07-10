/**
 * OnlineStore / Organization schema
 * SLICKLY je výhradne ONLINE obchod — žiadna fyzická predajňa.
 * Bez address/geo/hasMap/openingHours, aby SEO neindikovalo kamennú predajňu.
 */
export function useLocalBusinessJsonLD(): void {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const baseUrl = (config.public.siteUrl as string) || 'https://slickly.sk';
  const phone = appConfig.contact.phone;
  const email = appConfig.contact.email;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['OnlineStore', 'Organization'],
    '@id': `${baseUrl}/#organization`,
    name: 'SLICKLY',
    alternateName: 'SLICKLY',
    description:
      'SLICKLY je výhradne online obchod — autokozmetika, detailing produkty a príslušenstvo pre starostlivosť o auto s doručením po celom Slovensku a do okolitých krajín.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.svg`,
      width: 200,
      height: 60,
    },
    image: `${baseUrl}/favicon.svg`,
    telephone: phone.main,
    email: email.info,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Credit Card, Bank Transfer',
    areaServed: [
      { '@type': 'Country', name: 'Slovakia' },
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Country', name: 'Hungary' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Austria' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: phone.main,
        contactType: 'customer service',
        availableLanguage: ['Slovak', 'Czech', 'English'],
      },
    ],
    // foundingDate zámerne vynechaný — pôvodná hodnota '2010' bola zdedená z
    // MTSPORT branding a nedá sa overiť ako reálny SLICKLY dátum založenia.
  };

  useHead({
    script: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  });
}
