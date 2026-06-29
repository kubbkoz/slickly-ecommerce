import type { Ref, MaybeRef } from 'vue';

type BreadcrumbItem = { name: string; url: string };

interface CollectionOptions {
  description?: string;
  products?: { id: string; name: string; url: string; image?: string; price?: number }[];
}

/**
 * Volaj raz na úrovni setup() s reaktívnymi refs.
 * useI18n/useRuntimeConfig/useHead sa volajú tu (v setup kontexte), nie v callbacku.
 */
export function useCategoryBreadcrumbJsonLD(
  breadcrumbsRef: MaybeRef<BreadcrumbItem[]>,
  currentNameRef: MaybeRef<string>,
  currentUrlRef: MaybeRef<string>,
  collectionRef?: MaybeRef<CollectionOptions | undefined>,
): void {
  const { t } = useI18n();
  const config = useRuntimeConfig();
  const baseUrl = (config.public.siteUrl as string) || 'https://mtsport.store';

  const toAbsolute = (url: string) =>
    url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

  // useHead s computed — reaktívne, ale všetky composables sú v setup kontexte
  useHead(
    computed(() => {
      const breadcrumbs = unref(breadcrumbsRef);
      const currentName = unref(currentNameRef);
      const currentUrl = unref(currentUrlRef);
      const collection = unref(collectionRef);

      if (!currentName) return {};

      const absoluteCurrent = toAbsolute(currentUrl);

      const crumbs = [
        { name: t('home'), url: baseUrl },
        ...breadcrumbs.map((b) => ({ name: b.name, url: toAbsolute(b.url) })),
        { name: currentName, url: absoluteCurrent },
      ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };

      const schemas: object[] = [breadcrumbSchema];

      if (collection) {
        const collectionSchema: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: currentName,
          url: absoluteCurrent,
          ...(collection.description && { description: collection.description }),
        };

        if (collection.products?.length) {
          collectionSchema.mainEntity = {
            '@type': 'ItemList',
            numberOfItems: collection.products.length,
            itemListElement: collection.products.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: toAbsolute(p.url),
              ...(p.image && { image: p.image }),
              ...(p.price && {
                offers: { '@type': 'Offer', price: p.price, priceCurrency: 'EUR' },
              }),
            })),
          };
        }

        schemas.push(collectionSchema);
      }

      return {
        script: schemas.map((s) => ({
          type: 'application/ld+json',
          children: JSON.stringify(s),
        })),
      };
    })
  );
}
