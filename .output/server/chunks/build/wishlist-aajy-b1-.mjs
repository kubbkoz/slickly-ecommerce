import __nuxt_component_0 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_1 from './ProductTileSkeleton-COLf4zLk.mjs';
import __nuxt_component_2 from './ProductTile-CWCGbndB.mjs';
import __nuxt_component_3 from './ElementsNavigation-BjU8UuVp.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { d as useRoute, c as useRouter, b as useLocalePath, M as useInternationalization, f as useUser, T as useWishlist } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import './WishlistIcon-QPEOmafG.mjs';
import './IconButton-C-Xi6SDN.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './Price-D7PucwgC.mjs';
import './usePrice-CDJKOx8c.mjs';
import './BaseButton-CtNN_2CK.mjs';
import './useProductWishlist-oSDJlicI.mjs';
import './Pagination-Cue1vOZm.mjs';
import './ChevronIcon-Aj1t6zS4.mjs';
import './SizeSelector-DQWtP7Lz.mjs';
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';

const defaultLimit = 15;
const defaultPage = 1;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "wishlist",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const router = useRouter();
    const { handleApiError } = useApiErrorsResolver("wishlist");
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const loading = ref(false);
    const { isLoggedIn } = useUser();
    const {
      getWishlistProducts,
      currentPage,
      totalPagesCount,
      products,
      limit,
      items
    } = useWishlist();
    const initialPage = route.query.p ? Number(route.query.p) : defaultPage;
    const initialLimit = route.query.limit ? Number(route.query.limit) : defaultLimit;
    async function handleChangePage(page) {
      await router.push({
        query: {
          ...route.query,
          p: page,
          limit: limit.value
        }
      });
      getWishlistProductsProxy({ page });
    }
    async function handleChangeSize(size) {
      await router.push({
        query: {
          ...route.query,
          p: defaultPage,
          limit: size
        }
      });
      await getWishlistProductsProxy({ limit: size });
    }
    async function getWishlistProductsProxy(options) {
      loading.value = true;
      try {
        await getWishlistProducts({
          page: options?.page ?? initialPage,
          limit: options?.limit ?? initialLimit
        });
        if (items.value.length === 0 && currentPage.value > 1) {
          await router.push(route.path);
          await (void 0).location.reload();
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        loading.value = false;
      }
    }
    loading.value = true;
    [__temp, __restore] = withAsyncContext(() => getWishlistProductsProxy({ page: initialPage, limit: initialLimit })), await __temp, __restore();
    loading.value = false;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountPageHeader = __nuxt_component_0;
      const _component_WishlistProductTileSkeleton = __nuxt_component_1;
      const _component_WishlistProductTile = __nuxt_component_2;
      const _component_SharedElementsNavigation = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto mb-10 px-6 sm:px-0" }, _attrs))}>`);
      if (unref(isLoggedIn)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_AccountPageHeader, {
          class: "mb-14",
          title: _ctx.$t("wishlist.header"),
          subtitle: _ctx.$t("wishlist.subHeader")
        }, null, _parent));
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">`);
        if (unref(loading)) {
          _push(`<!--[-->`);
          ssrRenderList(unref(limit) || 15, (n) => {
            _push(ssrRenderComponent(_component_WishlistProductTileSkeleton, { key: n }, null, _parent));
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(ssrRenderComponent(_component_WishlistProductTile, {
              key: product.id,
              product
            }, null, _parent));
          });
          _push(`<!--]-->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(_component_SharedElementsNavigation, {
          class: "block",
          "show-page-size-selector": true,
          pages: unref(totalPagesCount),
          "current-page": unref(currentPage),
          "page-size": unref(limit),
          onChangePage: handleChangePage,
          onChangeSize: handleChangeSize
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<div class="flex flex-col items-center justify-center py-20 px-6 text-center">`);
        _push(ssrRenderComponent(_component_AccountPageHeader, {
          class: "mb-6",
          title: _ctx.$t("wishlist.notLoggedIn.title"),
          subtitle: _ctx.$t("wishlist.notLoggedIn.description")
        }, null, _parent));
        _push(`<div class="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/login"),
          class: "px-4 py-3 rounded bg-brand-primary text-brand-on-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-primary-hover transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("wishlist.notLoggedIn.login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("wishlist.notLoggedIn.login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/register"),
          class: "px-4 py-3 rounded bg-brand-secondary text-brand-on-secondary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-secondary-hover transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("wishlist.notLoggedIn.register"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("wishlist.notLoggedIn.register")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="text-surface-on-surface">or</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/"),
          class: "px-4 py-3 rounded bg-transparent border-1 border-brand-primary text-brand-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-surface-surface-container transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("wishlist.notLoggedIn.continueShopping"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("wishlist.notLoggedIn.continueShopping")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/wishlist.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
