import __nuxt_component_1 from './SwProductCard-BA76azQz.mjs';
import __nuxt_component_1$1 from './ProductCardSkeleton-BXswqGML.mjs';
import __nuxt_component_2 from './SwProductListingPagination-toQenkp-.mjs';
import { defineComponent, useTemplateRef, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import { useRoute, useRouter } from 'vue-router';
import { u as useCategoryListing } from './useCategoryListing-BIkms3Qx.mjs';
import './SwProductCardImage-DdEndLgG.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './server.mjs';
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
import './index-B6MI764M.mjs';
import './useImagePlaceholder-30hLRW4O.mjs';
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
import 'node:url';
import '@iconify/utils';
import 'consola';
import './SwProductCardDetails-BWTz-xFm.mjs';
import './SwProductRating-CCZ84wsh.mjs';
import './StarIcon-DB6h1IBB.mjs';
import './SwListingProductPrice-uLKvwDX7.mjs';
import './SwSharedPrice-DrqxF5OW.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useProductPrice--vjxv0K3.mjs';
import './BaseButton-D0eElC8N.mjs';
import './useCartErrorParamsResolver-QJw2wqGf.mjs';
import './useProductWishlist-oSDJlicI.mjs';
import './useUrlResolver-CibZ14y1.mjs';
import './useCartNotification-Bl0gSIu9.mjs';
import './SwPagination-f5VMphAR.mjs';
import './ChevronIcon-Aj1t6zS4.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';

const defaultLimit = 15;
const defaultPage = 1;
const defaultOrder = "name-asc";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementProductListing",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const productListElement = useTemplateRef("productListElement");
    let translations = {
      listing: {
        noProducts: "No products found 😔",
        perPage: "Per Page:",
        product: "Product",
        products: "Products"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const {
      changeCurrentPage,
      getCurrentPage,
      getElements,
      getTotalPagesCount,
      loading,
      setInitialListing
    } = useCategoryListing();
    const route = useRoute();
    const router = useRouter();
    const limit = ref(
      route.query.limit ? Number(route.query.limit) : props.content?.data?.listing?.limit ? Number(props.content?.data?.listing?.limit) : defaultLimit
    );
    const initalRoute = defu(route);
    watch(
      () => route,
      (newRoute) => {
        if (initalRoute.path !== newRoute.path) {
          return;
        }
        if (Object.keys(newRoute.query).length > 0) {
          return;
        }
        changeCurrentPage(defaultPage, {
          limit: defaultLimit,
          p: defaultPage,
          order: defaultOrder
        });
      },
      { deep: true }
    );
    const changePage = async (page) => {
      await router.push({
        query: {
          ...route.query,
          p: page,
          limit: limit.value
        }
      });
      await changeCurrentPage(
        page,
        route.query
      );
      productListElement.value?.scrollIntoView({ behavior: "smooth" });
    };
    const changeLimit = async (newLimit) => {
      await router.push({
        query: {
          ...route.query,
          limit: newLimit,
          p: defaultPage
        }
      });
      await changeCurrentPage(
        defaultPage,
        route.query
      );
      productListElement.value?.scrollIntoView({ behavior: "smooth" });
    };
    const isProductListing = computed(
      () => props.content?.type === "product-listing"
    );
    const compareRouteQueryWithInitialListing = async () => {
      const limitListing = props?.content?.data?.listing.limit ?? defaultLimit;
      const pageListing = props?.content?.data?.listing.page ?? defaultPage;
      const orderListing = props?.content?.data?.listing.sorting ?? defaultOrder;
      const isChangePageNeeded = route.query.limit && limit.value !== limitListing || route.query.p && Number(route.query.p) !== pageListing || route.query.order && route.query.order !== orderListing;
      if (isChangePageNeeded) {
        const limitQuery = route.query.limit ? Number(route.query.limit) : defaultLimit;
        const pageQuery = route.query.p ? Number(route.query.p) : defaultPage;
        const orderQuery = route.query.order ? route.query.order : defaultOrder;
        const newQuery = {
          limit: limitQuery,
          p: pageQuery,
          order: orderQuery
        };
        limit.value = limitQuery;
        await changeCurrentPage(
          pageQuery,
          newQuery
        );
      }
    };
    setInitialListing(
      props?.content?.data?.listing
    );
    compareRouteQueryWithInitialListing();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwProductCard = __nuxt_component_1;
      const _component_ProductCardSkeleton = __nuxt_component_1$1;
      const _component_SwProductListingPagination = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto lg:max-w-full" }, _attrs))}>`);
      if (!unref(loading) && unref(getElements).length < 1) {
        _push(`<div class="text-center text-xl py-16 text-surface-on-surface-variant">${ssrInterpolate(unref(translations).listing.noProducts)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"><!--[-->`);
        ssrRenderList(unref(getElements), (product) => {
          _push(ssrRenderComponent(_component_SwProductCard, {
            key: product.id,
            product,
            "is-product-listing": isProductListing.value,
            "layout-type": unref(getConfigValue)("boxLayout"),
            class: "w-full"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div data-testid="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16"><!--[-->`);
        ssrRenderList(limit.value, (index) => {
          _push(ssrRenderComponent(_component_ProductCardSkeleton, {
            key: index,
            class: "w-full"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(ssrRenderComponent(_component_SwProductListingPagination, {
          limit: limit.value,
          "onUpdate:limit": ($event) => limit.value = $event,
          total: unref(getTotalPagesCount),
          current: Number(unref(getCurrentPage)),
          translations: unref(translations),
          onChangePage: changePage,
          onChangeLimit: changeLimit
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementProductListing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementProductListing = Object.assign(_sfc_main, { __name: "CmsElementProductListing" });

export { CmsElementProductListing as default };
