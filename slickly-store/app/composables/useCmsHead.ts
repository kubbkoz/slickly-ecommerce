import {
  getCategoryImageUrl,
  getSmallestThumbnailUrl,
  isLandingPage,
  isProduct,
} from "@shopware/helpers";
import type { Schemas } from "#shopware";

export type UseCmsHeadReturn = ReturnType<typeof useCmsHead>;

type CmsPageEntity =
  | Schemas["Category"]
  | Schemas["LandingPage"]
  | Schemas["Product"];

type MetaEntry = {
  name: string;
  content: string;
};

/**
 * FIX: Null-safe override of vue-starter-template's useCmsHead.
 *
 * The original composable does `const unrefEntity = unref(entity)` once at
 * call-time. When `entity` is a Ref that starts as `undefined` (async data
 * not yet loaded), all downstream computed refs crash with:
 *   TypeError: Cannot read properties of undefined (reading 'apiAlias')
 *
 * This version guards every access with an early-return when the entity
 * is still undefined, preventing the crash on category navigation.
 */
export function useCmsHead(
  entity: Ref<CmsPageEntity> | ComputedRef<CmsPageEntity>,
  options?: {
    mainShopTitle?: string;
  },
): void {
  // get title and meta tags available in the Shopware instance
  // FIX: Use computed to reactively track entity changes instead of one-shot unref
  const { title: metaTitle, meta } = useCmsMeta(unref(entity));

  const title = computed(() => {
    const title = metaTitle.value;
    if (options?.mainShopTitle) {
      return `${title} | ${options.mainShopTitle}`;
    }
    return title;
  });

  // Add metadata according to Open Graph protocol: https://ogp.me
  const ogMetaAllowedKeys = ["title", "description"];
  const ogMeta = computed(() =>
    meta.value
      .filter((meta: MetaEntry) => ogMetaAllowedKeys.includes(meta.name))
      .map((meta: MetaEntry) => ({
        name: `og:${meta.name}`,
        content: meta.content,
      })),
  );

  // FIX: Access entity reactively inside computed and guard against undefined
  const ogImage = computed(() => {
    const currentEntity = unref(entity);
    // Guard: entity not yet loaded (async data pending)
    if (!currentEntity) {
      return {};
    }

    if (isLandingPage(currentEntity)) {
      return {};
    }

    return {
      name: "og:image",
      content: isProduct(currentEntity)
        ? getSmallestThumbnailUrl(currentEntity.media)
        : getCategoryImageUrl(currentEntity as Schemas["Category"]),
    };
  });

  const enhancedMeta = computed(() => [
    ...meta.value,
    ...ogMeta.value,
    ogImage.value,
    {
      name: "og:type",
      content: "website",
    },
    {
      name: "og:site_name",
      content: title.value,
    },
  ]);

  // set head internally
  useHead({
    title,
    meta: enhancedMeta,
  });
}
