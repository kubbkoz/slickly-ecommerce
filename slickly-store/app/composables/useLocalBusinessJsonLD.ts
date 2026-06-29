/**
 * LocalBusiness + BikeStore schema
 * Kritické pre Google AI Overviews, Perplexity a Apple Maps — identifikuje
 * fyzickú predajňu a prepája online obchod s miestnym vyhľadávaním.
 */
export function useLocalBusinessJsonLD(): void {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const baseUrl = (config.public.siteUrl as string) || 'https://mtsport.store';
  const phone = appConfig.contact.phone;
  const email = appConfig.contact.email;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['BikeStore', 'LocalBusiness'],
    '@id': `${baseUrl}/#localbusiness`,
    name: 'SLICKLY',
    alternateName: 'SLICKLY',
    description:
      'Prémiový cyklistický e-shop a kamenná predajňa. Bicykle, elektrobicykle, doplnky a servis. Sídlime v Lokca, Orava od roku 2010.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.svg`,
      width: 200,
      height: 60,
    },
    image: `${baseUrl}/logo.svg`,
    telephone: phone.main,
    email: email.info,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hradská 141/22',
      addressLocality: 'Lokca',
      postalCode: '029 51',
      addressRegion: 'Žilinský kraj',
      addressCountry: 'SK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.401,
      longitude: 19.217,
    },
    hasMap: 'https://maps.google.com/maps?q=Hradsk%C3%A1%20141%2F22%2C%20029%2051%20Lokca',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '12:00',
      },
    ],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
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
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: phone.complaints,
        contactType: 'returns',
        availableLanguage: ['Slovak', 'Czech'],
      },
      {
        '@type': 'ContactPoint',
        telephone: phone.store,
        contactType: 'sales',
        contactOption: 'TollFree',
        areaServed: 'SK',
      },
    ],
    sameAs: [
      'https://www.google.com/maps?cid=5483608887452018941',
      'https://www.facebook.com/mtsport.store',
      'https://www.instagram.com/mtsport.store',
    ],
    foundingDate: '2010',
    knowsAbout: [
      'Mountain Bikes',
      'Electric Bikes',
      'Road Bikes',
      'Gravel Bikes',
      'Cycling Accessories',
      'Bike Service',
      'Bike Repair',
    ],
  };

  useHead({
    script: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  });
}
