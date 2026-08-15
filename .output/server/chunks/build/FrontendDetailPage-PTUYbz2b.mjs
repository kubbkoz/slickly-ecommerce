import { e as useShopwareContext, d as useRoute, g as useState, h as useAsyncData, i as useRuntimeConfig, m as useI18n, C as useSeoMeta, u as useHead, I as __nuxt_component_0$1, W as useRequestURL } from './server.mjs';
import { defineComponent, ref, computed, watch, shallowRef, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { getProductName } from '@shopware/helpers';
import ProductDetail from './ProductDetail-DK7Wd6yk.mjs';
import { u as useBreadcrumbs } from './useBreadcrumbs-Dt7IBWvA.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { u as useProduct } from './useProduct-a-4w44J3.mjs';
import '../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './nuxt-link-B7B0pxEe.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './RatingStars-CZsf46JE.mjs';
import './ProductReviewsSection-CUcO23rK.mjs';
import './AppModal-CMHCLJuP.mjs';
import './ProductReviewForm-DO_Xeltg.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './AppHoneypot-DdH0YZXD.mjs';
import './format-tV37I8C6.mjs';
import './useProductReviews-DauI5Xd2.mjs';
import './ProductGallery-DOHcpZW_.mjs';
import './useProductBadges-BvF7DSTC.mjs';
import './ProductInfo-DCaAXPz5.mjs';
import './AddToCartButton-B8hFUbWd.mjs';
import './useUiState-BTlUPkrr.mjs';
import './ShareProduct-vwcTFzOy.mjs';
import './VariantSelector-DUiZzl4P.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';
import './QuantitySelector-B6vBeA3f.mjs';
import './TrustBadges-BcdpP2yW.mjs';
import './useShippingMetadata-C7Eoqyz6.mjs';
import './useCountrySelector-Cujau6dz.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './DownloadsTab-CHj4wAVb.mjs';
import './DistributorTab-CqvcHcqV.mjs';
import './ManufacturerInfo-CWjTobFI.mjs';
import './sanitize-DKvwg8Vq.mjs';
import './SpecsTab-Bl4q2Y0e.mjs';
import './DescriptionTab-D8HoIiln.mjs';
import './SupportPanel-BZBZzaQ2.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './SizeChartModal-Ca3Y4Pvt.mjs';
import './ProductStickyBar-BB3YXDuq.mjs';
import './usePrice-CDJKOx8c.mjs';

function useProductJsonLD(product, breadcrumbs = []) {
  const { origin: baseUrl } = useRequestURL();
  const p = product;
  const name = p.translated?.name || p.name || "";
  const description = p.translated?.description ? p.translated.description.replace(/<[^>]*>/g, "").trim() : "";
  const sku = p.productNumber || "";
  const price = p.calculatedPrice?.unitPrice ?? p.price?.gross ?? 0;
  const coverUrl = p.cover?.media?.url || p.media?.[0]?.media?.url || "";
  const images = [
    coverUrl,
    ...(p.media || []).map((m) => m.media?.url).filter(Boolean)
  ].filter(Boolean);
  const inStock = (p.availableStock ?? p.stock ?? 0) > 0 || p.isCloseout === false;
  const seoPath = p.seoUrls?.[0]?.seoPathInfo || "";
  const productUrl = `${baseUrl}/${seoPath}`;
  const brand = p.manufacturer?.translated?.name || p.manufacturer?.name || "";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: price.toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "SLICKLY" }
    }
  };
  if (description) productSchema.description = description;
  if (images.length) productSchema.image = images.length === 1 ? images[0] : images;
  if (brand) productSchema.brand = { "@type": "Brand", name: brand };
  const rating = p.ratingAverage ?? p.rating ?? 0;
  const reviewCount = p.productReviewsCount ?? p.reviewsCount ?? 0;
  if (rating > 0 && reviewCount > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount,
      bestRating: "5",
      worstRating: "1"
    };
  }
  if (p.parentId) {
    productSchema.isVariantOf = {
      "@type": "ProductGroup",
      url: productUrl.replace(/\/[^/]+$/, "")
      // approximácia parent URL
    };
  }
  const scripts = [
    { type: "application/ld+json", children: JSON.stringify(productSchema) }
  ];
  if (breadcrumbs.length > 0) {
    const crumbs = [
      { name: "Domov", url: baseUrl },
      ...breadcrumbs.map((b) => ({
        name: b.name,
        url: `${baseUrl}/${b.path.replace(/^\//, "")}`
      })),
      { name, url: productUrl }
    ];
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.url
        }))
      })
    });
  }
  const faqItems = [];
  for (let i = 1; i <= 5; i++) {
    const q = p.customFields?.[`mts_faq_q${i}`];
    const a = p.customFields?.[`mts_faq_a${i}`];
    if (q && a) faqItems.push({ question: String(q), answer: String(a) });
  }
  if (faqItems.length === 0 && name) {
    faqItems.push({
      question: `Kde kúpiť ${name}?`,
      answer: `${name} je dostupný na SLICKLY e-shope. ${inStock ? "Produkt je aktuálne skladom." : "Produkt je dostupný na objednávku."} Aktuálna cena: ${price.toFixed(2)} €.`
    });
    if (brand) {
      faqItems.push({
        question: `Kto vyrába ${name}?`,
        answer: `${name} je produkt značky ${brand}, ktorú SLICKLY distribuuje na slovenskom trhu.`
      });
    }
    faqItems.push({
      question: `Aká je záruka na ${name}?`,
      answer: `Na produkty zakúpené v SLICKLY e-shope sa vzťahuje zákonná záruka 24 mesiacov. Viac informácií nájdete v sekcii Záručné podmienky.`
    });
  }
  if (faqItems.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      })
    });
  }
  useHead({ script: scripts });
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FrontendDetailPage",
  __ssrInlineRender: true,
  props: {
    navigationId: {}
  },
  setup(__props) {
    const props = __props;
    const { buildDynamicBreadcrumbs, pushBreadcrumb } = useBreadcrumbs();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const route = useRoute();
    const errors = ref([]);
    useState("isPageProduct", () => false);
    useState("productPageCount", () => 0);
    const productIdToFetch = computed(() => route.query.variant || props.navigationId);
    const { data, error, pending } = useAsyncData(
      // Language-aware cache key — prevents stale content across language switches
      `product-${productIdToFetch.value}-${currentLanguageId.value}`,
      async () => {
        const productRes = await apiClient.invoke("readProduct post /product", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            filter: [
              {
                type: "multi",
                operator: "or",
                queries: [
                  { type: "equals", field: "id", value: productIdToFetch.value },
                  { type: "equals", field: "productNumber", value: productIdToFetch.value }
                ]
              }
            ],
            associations: {
              properties: { associations: { group: {} } },
              children: {
                limit: 50,
                associations: {
                  options: { limit: 50, associations: { group: {} } },
                  deliveryTime: {},
                  media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
                  cover: { associations: { media: {} } }
                }
              },
              configuratorSettings: {
                associations: { option: { associations: { group: {} } } }
              },
              media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
              cover: { associations: { media: {} } },
              manufacturer: { associations: { media: {} } },
              // OPTIMALIZÁCIA: Stiahneme len najzákladnejšie dáta kategórie s "path"
              categories: {
                includes: { category: ["id", "name", "translated", "path", "seoUrls"] },
                associations: { seoUrls: {} }
              },
              seoUrls: {}
            }
          }
        }).catch((err) => {
          errors.value.push(err.message || "Product fetch failed");
          return null;
        });
        const productData = productRes?.data?.elements?.[0];
        if (!productData) {
          return { productResponse: null, breadcrumbs: null };
        }
        if (productData.parentId) {
          try {
            const parentRes = await apiClient.invoke("readProduct post /product", {
              headers: { "sw-language-id": currentLanguageId.value },
              body: {
                filter: [{ type: "equals", field: "id", value: productData.parentId }],
                associations: {
                  properties: { associations: { group: {} } },
                  children: {
                    limit: 50,
                    associations: {
                      options: { limit: 50, associations: { group: {} } },
                      deliveryTime: {},
                      media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
                      cover: { associations: { media: {} } }
                    }
                  },
                  configuratorSettings: {
                    associations: { option: { associations: { group: {} } } }
                  },
                  media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
                  cover: { associations: { media: {} } },
                  manufacturer: { associations: { media: {} } },
                  seoUrls: {}
                }
              }
            });
            const parentProduct = parentRes?.data?.elements?.[0];
            if (parentProduct) {
              if (!productData.media?.length && parentProduct.media?.length) {
                productData.media = parentProduct.media;
              }
              if (!productData.cover?.media?.url && parentProduct.cover?.media?.url) {
                productData.cover = parentProduct.cover;
              }
              if (parentProduct.configuratorSettings) {
                productData.configuratorSettings = parentProduct.configuratorSettings;
              }
              if (parentProduct.children) {
                productData.children = parentProduct.children.elements || parentProduct.children;
                productData.childCount = parentProduct.childCount;
              }
              const parentCF = { ...parentProduct.customFields || {}, ...parentProduct.translated?.customFields || {} };
              if (Object.keys(parentCF).length) {
                productData.customFields = { ...parentCF, ...productData.customFields || {} };
              }
            }
          } catch (parentErr) {
          }
        }
        const customFieldMediaIds = [
          productData.customFields?.mts_feat_img,
          productData.customFields?.mts_grid1_img,
          productData.customFields?.mts_grid2_img,
          productData.customFields?.mts_grid3_img,
          productData.customFields?.mts_grid4_img,
          productData.customFields?.mts_video_file
        ].filter(Boolean);
        const customFieldsMediaMap = {};
        if (customFieldMediaIds.length > 0) {
          try {
            const resolved = await $fetch("/api/resolve-media", {
              method: "POST",
              body: { ids: customFieldMediaIds }
            });
            for (const [id, url] of Object.entries(resolved)) {
              customFieldsMediaMap[id] = proxyMediaUrl(url);
            }
          } catch {
          }
        }
        let dynamicBreadcrumbs = [];
        let targetCategory = productData.seoCategory;
        if (!targetCategory && productData.categories && productData.categories.length > 0) {
          targetCategory = productData.categories.reduce((prev, current) => {
            const prevDepth = (prev.path || "").split("|").length;
            const currDepth = (current.path || "").split("|").length;
            return currDepth > prevDepth ? current : prev;
          });
        }
        if (targetCategory && targetCategory.path) {
          const pathIds = targetCategory.path.split("|").filter(Boolean);
          pathIds.push(targetCategory.id);
          try {
            const categoriesRes = await apiClient.invoke("readCategory post /category", {
              headers: { "sw-language-id": currentLanguageId.value },
              body: {
                filter: [{ type: "equalsAny", field: "id", value: pathIds }],
                // Optimalizácia: Sťahujeme iba to, čo vizuálne potrebujeme pre Breadcrumb
                includes: { category: ["id", "name", "translated", "seoUrls"] },
                associations: { seoUrls: {} }
              }
            });
            const categories = categoriesRes?.data?.elements || [];
            dynamicBreadcrumbs = pathIds.map((id) => {
              const cat = categories.find((c) => c.id === id);
              if (!cat || cat.name === "Catalogue" || cat.name === "Root") return null;
              return {
                name: cat.translated?.name || cat.name,
                path: cat.seoUrls?.[0]?.seoPathInfo || `navigation/${cat.id}`
              };
            }).filter(Boolean);
          } catch (err) {
          }
        }
        return {
          productResponse: { product: productData, configurator: productData.configuratorSettings },
          breadcrumbs: dynamicBreadcrumbs,
          customFieldsMediaMap,
          deepestCategoryId: targetCategory?.id || null
        };
      },
      {
        watch: [currentLanguageId, () => route.query.variant]
      }
    );
    watch(data, (newData) => {
      if (!newData) return;
      if (newData.breadcrumbs && newData.breadcrumbs.length > 0) {
        buildDynamicBreadcrumbs(newData.breadcrumbs);
      }
      const productResponse = newData.productResponse;
      if (productResponse && productResponse.product) {
        useProductJsonLD(productResponse.product, newData.breadcrumbs ?? []);
        pushBreadcrumb({
          name: getProductName({ product: productResponse.product }) ?? "",
          path: `/${productResponse.product.seoUrls?.[0]?.seoPathInfo || ""}`
        });
        const p = productResponse.product;
        if (p.cover?.media) p.cover.media.thumbnails = [];
        if (p.media) p.media.forEach((m) => {
          if (m.media) m.media.thumbnails = [];
        });
      }
    }, { immediate: true });
    const productSource = computed(() => data.value?.productResponse?.product || {});
    const configuratorSource = computed(() => data.value?.productResponse?.configurator || []);
    useProduct(productSource, configuratorSource);
    const adaptedProduct = computed(() => {
      if (!data.value?.productResponse?.product) return null;
      const rawProduct = data.value.productResponse.product;
      const mediaSource = rawProduct.media || [];
      const coverUrl = rawProduct.cover?.media?.url || "";
      const galleryImages = Array.from(
        /* @__PURE__ */ new Set(
          [
            coverUrl,
            ...mediaSource.map((m) => m.media?.url).filter(Boolean)
          ]
        )
      ).filter(Boolean);
      return {
        // Identity
        id: rawProduct.id,
        parentId: rawProduct.parentId,
        name: rawProduct.translated?.name || rawProduct.name || "",
        description: rawProduct.translated?.description || rawProduct.description || "",
        category: rawProduct.categories?.[0]?.translated?.name || rawProduct.categories?.[0]?.name || "",
        // Najhlbšia kategória — rovnaká logika ako breadcrumb (seoCategory → path depth)
        deepestCategoryId: data.value?.deepestCategoryId || null,
        breadcrumbs: data.value?.breadcrumbs || [],
        brand: rawProduct.manufacturer?.translated?.name || rawProduct.manufacturer?.name || "",
        // Pricing
        price: rawProduct.calculatedPrice?.unitPrice ?? 0,
        oldPrice: rawProduct.calculatedPrice?.listPrice?.price ?? null,
        calculatedPrice: rawProduct.calculatedPrice,
        // Images
        image: coverUrl || galleryImages[0] || "",
        images: galleryImages,
        media: rawProduct.media || [],
        childCount: rawProduct.childCount,
        children: rawProduct.children,
        isCloseout: rawProduct.isCloseout === true,
        // Whether this is a parent 
        isParentProduct: (rawProduct.childCount ?? 0) > 0 && !rawProduct.parentId,
        // Configurator settings
        configuratorSettings: rawProduct.configuratorSettings || [],
        // Variants loop for legacy size selector
        // NOTE: rawProduct.children was already merged from parent in SSR logic above (lines 127-131)
        variants: (rawProduct.children || []).map((child) => {
          const optionLabel = child.options?.map((o) => (o.translated?.name || o.name || "").split("(")[0].trim()).filter(Boolean).join(" / ") || "";
          const isCloseout = (child.isCloseout ?? rawProduct.isCloseout) === true;
          const stock = child.availableStock ?? child.stock ?? 0;
          return {
            id: child.id,
            size: optionLabel || child.productNumber || child.id,
            sku: child.productNumber,
            ean: child.ean || "",
            name: child.translated?.name || child.name || "",
            isCloseout,
            stockStatus: stock > 0 ? "in_stock" : isCloseout ? "unavailable" : "on_order",
            stockCount: stock,
            optionIds: child.optionIds || (child.options?.map((o) => o.id) || [])
          };
        }),
        categoryIds: rawProduct.categories?.map((c) => c.id) || [],
        customFieldsMedia: data.value?.customFieldsMediaMap || {},
        reviewsCount: rawProduct.productReviewsCount || 0,
        rating: rawProduct.ratingAverage || 0,
        _raw: rawProduct,
        // customFields je prekladateľné — reálne hodnoty (MOC/PMOC) sú v translated.customFields;
        // top-level customFields býva {}. Zlúč oboje, translated má prioritu.
        customFields: { ...rawProduct.customFields || {}, ...rawProduct.translated?.customFields || {} },
        manufacturer: rawProduct.manufacturer,
        manufacturerId: rawProduct.manufacturerId ?? rawProduct.manufacturer?.id ?? null,
        createdAt: rawProduct.createdAt,
        tagIds: rawProduct.tagIds ?? [],
        categoryTree: rawProduct.categoryTree ?? [],
        options: rawProduct.options,
        optionIds: rawProduct.optionIds,
        properties: rawProduct.properties || [],
        seoUrls: rawProduct.seoUrls
      };
    });
    const stableAdaptedProduct = shallowRef(null);
    watch(adaptedProduct, (newP) => {
      if (newP) stableAdaptedProduct.value = newP;
    }, { immediate: true });
    watch(() => props.navigationId, () => {
      stableAdaptedProduct.value = null;
    });
    const _rawProduct = computed(() => data.value?.productResponse?.product);
    const _seoUrl = computed(() => _rawProduct.value?.seoUrls?.[0]?.seoPathInfo || "");
    const _seoName = computed(() => _rawProduct.value?.translated?.name || _rawProduct.value?.name || "");
    const _seoDesc = computed(() => (_rawProduct.value?.translated?.metaDescription || "").replace(/<[^>]*>/g, "").substring(0, 160));
    const _seoImage = computed(() => _rawProduct.value?.cover?.media?.url || "");
    const _siteUrl = useRuntimeConfig().public.siteUrl || "https://slickly.sk";
    const _canonical = computed(() => _seoUrl.value ? `${_siteUrl}/${_seoUrl.value}` : "");
    const { locale: _locale } = useI18n();
    const _ogLocaleMap = {
      sk: "sk_SK",
      cz: "cs_CZ",
      de: "de_DE",
      hu: "hu_HU",
      en: "en_GB",
      pl: "pl_PL"
    };
    useSeoMeta({
      title: () => _seoName.value ? `${_seoName.value} | SLICKLY` : "SLICKLY",
      ogTitle: () => _seoName.value || "SLICKLY",
      description: () => _seoDesc.value,
      ogDescription: () => _seoDesc.value,
      ogImage: () => _seoImage.value,
      ogType: "product",
      ogLocale: () => _ogLocaleMap[_locale.value] || "sk_SK",
      ogUrl: () => _canonical.value,
      twitterCard: "summary_large_image",
      twitterTitle: () => _seoName.value || "SLICKLY",
      twitterDescription: () => _seoDesc.value,
      twitterImage: () => _seoImage.value
    });
    useHead({
      link: [{ rel: "canonical", href: () => _canonical.value }]
    });
    watch(stableAdaptedProduct, (p) => {
      if (!p?.id || true) return;
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<!--[--><div id="SLICKLY-CUSTOM-PDP-MARKER" class="sr-only" aria-hidden="true"></div><div class="relative">`);
      if (unref(stableAdaptedProduct)) {
        _push(ssrRenderComponent(ProductDetail, { product: unref(stableAdaptedProduct) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FrontendDetailPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FrontendDetailPage = Object.assign(_sfc_main, { __name: "FrontendDetailPage" });

export { FrontendDetailPage as default };
