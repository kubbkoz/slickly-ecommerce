import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import RatingStars from './RatingStars-CZsf46JE.mjs';
import __nuxt_component_3 from './ProductReviewsSection-CUcO23rK.mjs';
import { _ as _export_sfc, g as useState, b as useLocalePath, c as useRouter, d as useRoute, m as useI18n, e as useShopwareContext, I as __nuxt_component_0$1, i as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, toRef, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { Home } from 'lucide-vue-next';
import ProductGallery from './ProductGallery-DOHcpZW_.mjs';
import ProductInfo from './ProductInfo-DCaAXPz5.mjs';
import DownloadsTab from './DownloadsTab-CHj4wAVb.mjs';
import DistributorTab from './DistributorTab-CqvcHcqV.mjs';
import SpecsTab from './SpecsTab-Bl4q2Y0e.mjs';
import DescriptionTab from './DescriptionTab-D8HoIiln.mjs';
import SupportPanel from './SupportPanel-BZBZzaQ2.mjs';
import { u as useProductComparison } from './useProductComparison-BXlqQWLK.mjs';
import SizeChartModal from './SizeChartModal-Ca3Y4Pvt.mjs';
import ProductStickyBar from './ProductStickyBar-BB3YXDuq.mjs';
import { u as useProductReviews } from './useProductReviews-DauI5Xd2.mjs';
import { u as useProductBadges, b as badgeSizeClass } from './useProductBadges-BvF7DSTC.mjs';
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
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './AppModal-CMHCLJuP.mjs';
import './ProductReviewForm-DO_Xeltg.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './BaseButton-BJMOoNbK.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './AppHoneypot-DdH0YZXD.mjs';
import './format-tV37I8C6.mjs';
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
import './ManufacturerInfo-CWjTobFI.mjs';
import './sanitize-DKvwg8Vq.mjs';
import './media-BNPyNy3v.mjs';
import './usePrice-CDJKOx8c.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductDetail",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { splitPdpBadges } = useProductBadges();
    const pdpBadgesSplit = computed(() => splitPdpBadges(props.product));
    const mobilePdpBadges = computed(() => pdpBadgesSplit.value.topBadges);
    const imagePdpBadges = computed(() => pdpBadgesSplit.value.imageBadges);
    const quantity = ref(1);
    const selectedSize = ref("");
    const galleryImages = ref(
      Array.from(/* @__PURE__ */ new Set([props.product?.image, ...props.product?.images || []])).filter(Boolean)
    );
    const activeImage = ref(props.product?.image || "");
    const isSizeChartOpen = ref(false);
    const isStickyBarVisible = ref(false);
    const isWatchdogOpen = ref(false);
    const isPriceOfferOpen = ref(false);
    const isComparisonOpen = ref(false);
    const { addToComparison, isInComparison, removeFromComparison } = useProductComparison();
    const comparisonToast = useState("comparisonToast", () => ({ show: false, productName: "", action: "add" }));
    const handleAddToCompare = (_e, p) => {
      if (isInComparison(p.id)) {
        removeFromComparison(p.id);
        comparisonToast.value = { show: true, productName: p.name, action: "remove" };
        return;
      }
      const added = addToComparison({
        id: p.id,
        name: p.name,
        image: p.image || p.images?.[0] || "",
        price: p.price,
        oldPrice: p.oldPrice,
        productNumber: p._raw?.productNumber || "",
        categoryName: p.category || "",
        manufacturer: p.brand || p.manufacturer?.name || "",
        properties: (p.properties || p._raw?.properties || []).map((pr) => ({
          group: pr.group?.translated?.name || pr.group?.name || "",
          value: pr.translated?.name || pr.name || ""
        }))
      });
      if (added) {
        comparisonToast.value = { show: true, productName: p.name, action: "add" };
      }
      isComparisonOpen.value = true;
    };
    const { productReviews } = useProductReviews(toRef(props, "product"));
    const effectiveReviewCount = computed(() => {
      return Math.max(props.product.reviewsCount || 0, productReviews.value?.length || 0);
    });
    const effectiveRating = computed(() => {
      if (props.product.rating > 0) return props.product.rating;
      if (productReviews.value?.length > 0) {
        const sum = productReviews.value.reduce((acc, r) => acc + (r.points || 0), 0);
        return sum / productReviews.value.length;
      }
      return 0;
    });
    watch(() => props.product, (newP) => {
      activeImage.value = newP.image || "";
      galleryImages.value = Array.from(/* @__PURE__ */ new Set([newP.image, ...newP.images || []])).filter(Boolean);
      if (newP.variants?.length) {
        const first = newP.variants.find((v) => v.stockStatus === "in_stock") || newP.variants[0];
        selectedSize.value = first?.size ? String(first.size) : "";
      }
    }, { deep: true });
    const currentVariant = computed(() => props.product.variants?.find((v) => v.size === selectedSize.value));
    const availableSizes = computed(() => props.product.variants?.map((v) => v.size) || []);
    const localePath = useLocalePath();
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    const { apiClient } = useShopwareContext();
    const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, "") || "");
    const selectedVariant = ref(null);
    computed(() => ({
      ...props.product,
      id: selectedVariant.value?.id || props.product.id,
      availableStock: selectedVariant.value?.availableStock ?? props.product.availableStock ?? 0,
      isCloseout: selectedVariant.value?.isCloseout === true || props.product._raw?.isCloseout === true
    }));
    computed(() => {
      return selectedVariant.value?.calculatedPrice?.unitPrice ?? props.product.calculatedPrice?.unitPrice ?? props.product.price ?? 0;
    });
    computed(() => {
      return selectedVariant.value?.calculatedPrice?.listPrice?.price ?? props.product.calculatedPrice?.listPrice?.price ?? null;
    });
    const handleVariantSelected = async (payload) => {
      const optionId = typeof payload === "string" ? payload : payload.optionId;
      const groupId = payload.groupId;
      if (!optionId) return;
      try {
        let currentOptions = props.product?.optionIds ? [...props.product.optionIds] : [];
        if (groupId) {
          const settings = props.product?.configuratorSettings || [];
          const optionsInSameGroup = settings.filter((cs) => cs.option?.groupId === groupId || cs.option?.group?.id === groupId).map((cs) => cs.option?.id);
          currentOptions = currentOptions.filter((id) => !optionsInSameGroup.includes(id));
        }
        if (!currentOptions.includes(optionId)) {
          currentOptions.push(optionId);
        }
        const parentId = props.product.parentId || props.product.id;
        let foundVariantId = null;
        const targetLength = currentOptions.length;
        const children = props.product?.children || [];
        for (const child of children) {
          const childOpts = child.optionIds || (child.options?.map((o) => o.id) || []);
          if (childOpts.length === targetLength && currentOptions.every((id) => childOpts.includes(id))) {
            foundVariantId = child.id;
            break;
          }
        }
        if (!foundVariantId && props.product?.variants) {
          for (const v of props.product.variants) {
            const childOpts = v.optionIds || [];
            if (childOpts.length === targetLength && currentOptions.every((id) => childOpts.includes(id))) {
              foundVariantId = v.id || v._raw?.id;
              break;
            }
          }
        }
        if (!foundVariantId) {
          const response = await apiClient.invoke("readProductVariant post /product/{productId}/find-variant", {
            pathParams: { productId: parentId },
            body: { options: currentOptions }
          });
          foundVariantId = response?.variantId || response?.data?.variantId || response?.foundCombination?.variantId || response?.data?.foundCombination?.variantId;
        }
        if (foundVariantId) {
          router.push({ query: { ...route.query, variant: foundVariantId } });
        }
      } catch (error) {
      }
    };
    const scrollToTabContent = (elementId) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = (void 0).getElementById(elementId);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const scrollTop = (void 0).pageYOffset || (void 0).documentElement.scrollTop;
            const top = rect.top + scrollTop - 110;
            (void 0).scrollTo({ top, behavior: "smooth" });
          }, 100);
        });
      });
    };
    const handleOpenDescription = () => {
      scrollToTabContent("product-description-content");
    };
    const handleOpenReviews = () => {
      scrollToTabContent("pdp-reviews-section");
    };
    const breadcrumbsVisible = computed(() => {
      return props.product.breadcrumbs?.slice(1) || [];
    });
    const config = useRuntimeConfig();
    const CARD_INCLUDES = {
      product: [
        "id",
        "name",
        "description",
        "translated",
        "cover",
        "manufacturer",
        "options",
        "seoUrls",
        "calculatedPrice",
        "childCount",
        "available",
        "availableStock",
        "isCloseout",
        "children",
        "media",
        "ratingAverage",
        "productReviewsCount"
      ],
      product_media: ["media", "position"],
      media: ["url", "thumbnails", "fileName", "mimeType"],
      media_thumbnail: ["url", "width"],
      product_manufacturer: ["id", "name", "translated", "media"],
      property_group_option: ["id", "name", "translated", "group"],
      property_group: ["id", "name", "translated"],
      seo_url: ["seoPathInfo", "isCanonical"]
    };
    const CARD_ASSOC = {
      cover: { associations: { media: {} } },
      seoUrls: {},
      children: { associations: { options: { associations: { group: {} } } } }
    };
    ref(0);
    ref(0);
    ref(0);
    const similarProducts = ref([]);
    const isSimilarLoading = ref(false);
    ref(null);
    const fetchSimilarProducts = async (product) => {
      const catId = product.deepestCategoryId;
      const price = product.price || 0;
      if (!catId) return;
      isSimilarLoading.value = true;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            limit: 12,
            filter: [
              { type: "equals", field: "parentId", value: null },
              { type: "equalsAny", field: "categoryIds", value: [catId] },
              { type: "not", queries: [{ type: "equals", field: "id", value: product.id }] },
              ...price > 0 ? [{ type: "range", field: "price", parameters: { gte: price * 0.9, lte: price * 1.5 } }] : [],
              // Len dostupné: skladom alebo na objednávku (nie vypredané isCloseout+stock=0)
              { type: "multi", operator: "or", queries: [
                { type: "range", field: "availableStock", parameters: { gt: 0 } },
                { type: "equals", field: "isCloseout", value: false }
              ] }
            ],
            sort: [{ field: "ratingAverage", order: "DESC" }],
            includes: CARD_INCLUDES,
            associations: CARD_ASSOC
          }
        });
        similarProducts.value = (res?.data || res)?.elements || [];
      } catch (e) {
      } finally {
        isSimilarLoading.value = false;
      }
    };
    const frequentlyBought = ref([]);
    const isFrequentlyBoughtLoading = ref(false);
    ref(null);
    const fetchFrequentlyBought = async (productId) => {
      isFrequentlyBoughtLoading.value = true;
      const crossSellIds = /* @__PURE__ */ new Set();
      try {
        const res = await apiClient.invoke(`readProductCrossSelling get /product/${productId}/cross-selling`);
        const sections = res?.data || res;
        if (Array.isArray(sections)) {
          for (const section of sections) {
            for (const p of section.products || []) {
              if (p.id !== productId) crossSellIds.add(p.id);
            }
          }
        }
        if (crossSellIds.size > 0) {
          const detail = await apiClient.invoke("readProduct post /product", {
            body: {
              filter: [{ type: "equalsAny", field: "id", value: [...crossSellIds].slice(0, 12) }],
              includes: CARD_INCLUDES,
              associations: { ...CARD_ASSOC, manufacturer: { associations: { media: {} } } }
            }
          });
          const products = (detail?.data || detail)?.elements || [];
          if (products.length > 0) {
            frequentlyBought.value = products;
            return;
          }
        }
        const doplnkyCatId = config.public.shopware.ids?.categories?.doplnky;
        if (doplnkyCatId) {
          const fallback = await apiClient.invoke("readProduct post /product", {
            body: {
              limit: 12,
              filter: [
                { type: "equals", field: "parentId", value: null },
                { type: "equalsAny", field: "categoryIds", value: [doplnkyCatId] },
                { type: "not", queries: [{ type: "equals", field: "id", value: productId }] }
              ],
              sort: [{ field: "sales", order: "DESC" }],
              includes: CARD_INCLUDES,
              associations: CARD_ASSOC
            }
          });
          frequentlyBought.value = (fallback?.data || fallback)?.elements || [];
        }
      } catch (e) {
      } finally {
        isFrequentlyBoughtLoading.value = false;
      }
    };
    const recentlyViewed = ref([]);
    const isRecentlyViewedLoading = ref(false);
    ref(null);
    const recentlyViewedLoaded = ref(false);
    const loadRecentlyViewed = async (currentProductId) => {
      isRecentlyViewedLoading.value = true;
      recentlyViewedLoaded.value = false;
      try {
        const raw = localStorage.getItem("mtsport_recently_viewed");
        const ids = Array.isArray(JSON.parse(raw || "[]")) ? JSON.parse(raw || "[]") : [];
        const filtered = ids.filter((id) => id !== currentProductId).slice(0, 12);
        if (filtered.length === 0) {
          recentlyViewedLoaded.value = true;
          return;
        }
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [
              { type: "equalsAny", field: "id", value: filtered },
              { type: "equals", field: "parentId", value: null }
            ],
            includes: CARD_INCLUDES,
            associations: CARD_ASSOC
          }
        });
        const products = (res?.data || res)?.elements || [];
        recentlyViewed.value = filtered.map((id) => products.find((p) => p.id === id)).filter(Boolean);
      } catch (e) {
      } finally {
        isRecentlyViewedLoading.value = false;
        recentlyViewedLoaded.value = true;
      }
    };
    watch(() => props.product?.id, (id) => {
      if (id) {
        frequentlyBought.value = [];
        fetchFrequentlyBought(id);
        similarProducts.value = [];
        fetchSimilarProducts(props.product);
      }
    }, { immediate: true });
    watch(() => props.product?.id, (id, oldId) => {
      if (id && id !== oldId) loadRecentlyViewed(id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      const _component_RatingStars = RatingStars;
      const _component_ProductReviewsSection = __nuxt_component_3;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen font-sans pb-[72px] lg:pb-0" }, _attrs))} data-v-d41330ce>`);
      _push(ssrRenderComponent(ProductStickyBar, {
        product: __props.product,
        visible: isStickyBarVisible.value,
        selectedSize: selectedSize.value,
        quantity: quantity.value,
        "onUpdate:quantity": ($event) => quantity.value = $event
      }, null, _parent));
      _push(`<div class="max-w-[1536px] mx-auto flex flex-col lg:flex-row lg:items-start lg:px-8" data-v-d41330ce><div class="w-full lg:w-[58%] xl:w-[60%] lg:pt-8 flex flex-col" data-v-d41330ce><div class="lg:hidden w-full px-4 pt-4 pb-2 bg-white flex flex-col" data-v-d41330ce><nav aria-label="Breadcrumb" class="mb-4 w-full overflow-x-auto hide-scrollbar" data-v-d41330ce><ol class="flex items-center gap-1.5 flex-nowrap text-[11px] text-gray-400 font-sans whitespace-nowrap min-w-max" data-v-d41330ce><li data-v-d41330ce>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "hover:text-black transition-colors flex items-center flex-shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Home), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Home), { class: "w-3.5 h-3.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(breadcrumbsVisible.value, (bc, index) => {
        _push(`<!--[--><li class="text-gray-300 flex-shrink-0" data-v-d41330ce>›</li><li class="flex-shrink-0" data-v-d41330ce>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/" + bc.path,
          class: "hover:text-brand transition-colors focus:outline-none"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(bc.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(bc.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li><!--]-->`);
      });
      _push(`<!--]--><li class="text-gray-300 flex-shrink-0" data-v-d41330ce>›</li><li aria-current="page" class="flex-shrink-0" data-v-d41330ce><span class="text-black font-medium"${ssrRenderAttr("title", sanitizedProductName.value)} data-v-d41330ce>${ssrInterpolate(sanitizedProductName.value)}</span></li></ol></nav>`);
      if (mobilePdpBadges.value.length) {
        _push(`<div class="flex flex-row flex-wrap gap-1.5 mb-2" data-v-d41330ce><!--[-->`);
        ssrRenderList(mobilePdpBadges.value, (badge) => {
          _push(`<span class="${ssrRenderClass(["font-bold uppercase tracking-wider leading-none font-tech", unref(badgeSizeClass)(badge.size)])}" style="${ssrRenderStyle({ backgroundColor: badge.bgColor, color: badge.textColor })}" data-v-d41330ce>${ssrInterpolate(badge.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.product.manufacturer?.media?.url) {
        _push(`<div class="mb-1" data-v-d41330ce>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: __props.product.manufacturer.media.url,
          alt: `${__props.product.brand} logo`,
          class: "h-5 w-auto object-contain mix-blend-multiply"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="text-2xl font-black text-black leading-tight mt-1 mb-3 font-tech uppercase tracking-wide" data-v-d41330ce>${ssrInterpolate(sanitizedProductName.value)}</h1><div class="flex items-center gap-1 cursor-pointer group min-h-[44px]" data-v-d41330ce>`);
      _push(ssrRenderComponent(_component_RatingStars, { rating: effectiveRating.value }, null, _parent));
      _push(`<span class="text-gray-500 text-[11px] font-bold font-sans underline ml-1" data-v-d41330ce>${ssrInterpolate(effectiveReviewCount.value)} ${ssrInterpolate(_ctx.$t("pdp.reviews_count"))}</span></div></div><div class="w-full" data-v-d41330ce>`);
      _push(ssrRenderComponent(ProductGallery, {
        product: __props.product,
        activeImage: activeImage.value,
        "onUpdate:activeImage": ($event) => activeImage.value = $event,
        galleryImages: galleryImages.value,
        "onUpdate:galleryImages": ($event) => galleryImages.value = $event,
        "image-badges": imagePdpBadges.value
      }, null, _parent));
      _push(`</div></div><div class="w-full lg:w-[42%] xl:w-[40%] lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:h-[calc(100vh-var(--navbar-height-scrolled,88px))] lg:overflow-y-auto flex-shrink-0 hide-scrollbar bg-white" data-v-d41330ce><div class="w-full px-4 md:px-6 xl:px-10 py-6 lg:py-8 lg:pt-8 lg:pb-10 bg-white" data-v-d41330ce><nav aria-label="Breadcrumb" class="hidden lg:block bg-white mb-6 md:mb-10" data-v-d41330ce><ol class="flex items-center gap-2 flex-nowrap text-sm text-gray-400 font-sans whitespace-nowrap overflow-x-auto hide-scrollbar" data-v-d41330ce><li data-v-d41330ce>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "hover:text-black transition-colors flex items-center flex-shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Home), { class: "w-4 h-4 mb-0.5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Home), { class: "w-4 h-4 mb-0.5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(breadcrumbsVisible.value, (bc, index) => {
        _push(`<!--[--><li class="text-gray-300 flex-shrink-0" data-v-d41330ce>›</li><li class="flex-shrink-0" data-v-d41330ce>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/" + bc.path,
          class: "hover:text-brand transition-colors focus:outline-none"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(bc.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(bc.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li><!--]-->`);
      });
      _push(`<!--]--><li class="text-gray-300 flex-shrink-0" data-v-d41330ce>›</li><li aria-current="page" class="min-w-0 flex-1 overflow-hidden" data-v-d41330ce><span class="text-black font-medium truncate block"${ssrRenderAttr("title", sanitizedProductName.value)} data-v-d41330ce>${ssrInterpolate(sanitizedProductName.value)}</span></li></ol></nav>`);
      _push(ssrRenderComponent(ProductInfo, {
        product: __props.product,
        ratingAverage: effectiveRating.value,
        reviewCount: effectiveReviewCount.value,
        quantity: quantity.value,
        "onUpdate:quantity": ($event) => quantity.value = $event,
        selectedSize: selectedSize.value,
        "onUpdate:selectedSize": ($event) => selectedSize.value = $event,
        currentVariant: currentVariant.value,
        selectedVariant: selectedVariant.value,
        onVariantSelected: handleVariantSelected,
        onOpenSizeChart: ($event) => isSizeChartOpen.value = true,
        onOpenDescription: handleOpenDescription,
        onOpenReviews: handleOpenReviews,
        onAddToCompare: handleAddToCompare,
        onOpenWatchdog: ($event) => isWatchdogOpen.value = true,
        onOpenPriceOffer: ($event) => isPriceOfferOpen.value = true
      }, null, _parent));
      _push(`</div></div></div><div class="w-full border-t border-gray-100 bg-white" data-v-d41330ce><div class="max-w-[1536px] mx-auto lg:px-8 lg:flex lg:items-start lg:gap-8" data-v-d41330ce><div class="w-full lg:w-[58%] xl:w-[60%] px-4 lg:px-0 py-8 lg:py-12" data-v-d41330ce><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4" data-v-d41330ce>Popis produktu</h2><div class="section-decorator mb-8" data-v-d41330ce></div>`);
      _push(ssrRenderComponent(DescriptionTab, {
        product: __props.product,
        customFieldsMedia: __props.product.customFieldsMedia
      }, null, _parent));
      _push(`</div><div class="w-full lg:w-[42%] xl:w-[40%] px-4 lg:px-0 py-8 lg:py-12 lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:self-start" data-v-d41330ce><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4" data-v-d41330ce>Kompletná špecifikácia</h2><div class="section-decorator mb-8" data-v-d41330ce></div>`);
      _push(ssrRenderComponent(SpecsTab, {
        product: __props.product,
        availableSizes: availableSizes.value,
        singleColumn: true
      }, null, _parent));
      _push(`</div></div></div><section id="pdp-reviews-section" class="w-full bg-gray-50 border-t border-gray-100" data-v-d41330ce><div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-16" data-v-d41330ce><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4" data-v-d41330ce>Hodnotenia produktu</h2><div class="section-decorator mb-10" data-v-d41330ce></div>`);
      _push(ssrRenderComponent(_component_ProductReviewsSection, {
        product: __props.product,
        ratingAverage: effectiveRating.value,
        reviewCount: effectiveReviewCount.value
      }, null, _parent));
      _push(`</div></section><div class="w-full border-t border-gray-100 bg-white" data-v-d41330ce><div class="max-w-[1536px] mx-auto lg:px-8 lg:flex lg:items-start lg:gap-8" data-v-d41330ce><div class="w-full lg:w-[58%] xl:w-[60%] px-4 lg:px-0 py-8 lg:py-12" data-v-d41330ce><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4" data-v-d41330ce>Výrobca / distribútor</h2><div class="section-decorator mb-8" data-v-d41330ce></div>`);
      _push(ssrRenderComponent(DistributorTab, { product: __props.product }, null, _parent));
      _push(`</div><div class="w-full lg:w-[42%] xl:w-[40%] px-4 lg:px-0 py-8 lg:py-12" data-v-d41330ce><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4" data-v-d41330ce>Dokumenty a manuály</h2><div class="section-decorator mb-8" data-v-d41330ce></div>`);
      _push(ssrRenderComponent(DownloadsTab, { product: __props.product }, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(SupportPanel, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(SizeChartModal, {
        isOpen: isSizeChartOpen.value,
        onClose: ($event) => isSizeChartOpen.value = false,
        category: __props.product.category,
        availableSizes: availableSizes.value
      }, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductDetail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductDetail = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-d41330ce"]]), { __name: "ProductDetail" });

export { ProductDetail as default };
