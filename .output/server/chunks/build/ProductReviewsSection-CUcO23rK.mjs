import { defineComponent, toRef, ref, computed, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Star, MessageSquare } from 'lucide-vue-next';
import RatingStars from './RatingStars-CZsf46JE.mjs';
import __nuxt_component_2 from './AppModal-CMHCLJuP.mjs';
import ProductReviewForm from './ProductReviewForm-DO_Xeltg.mjs';
import { f as formatRating, a as formatReviewLabel } from './format-tV37I8C6.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { u as useProductReviews } from './useProductReviews-DauI5Xd2.mjs';
import './server.mjs';
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
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useShopwareLanguage-CGPCneCN.mjs';
import './AppHoneypot-DdH0YZXD.mjs';
import './nuxt-link-B7B0pxEe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductReviewsSection",
  __ssrInlineRender: true,
  props: {
    product: {},
    ratingAverage: {},
    reviewCount: {}
  },
  setup(__props) {
    const props = __props;
    const { productReviews, loadProductReviews } = useProductReviews(toRef(props, "product"));
    const isReviewModalOpen = ref(false);
    const handleReviewSuccess = async () => {
      isReviewModalOpen.value = false;
      try {
        await loadProductReviews();
      } catch {
      }
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("sk-SK", { year: "numeric", month: "long", day: "numeric" });
    };
    const getInitials = (name) => {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    };
    const reviewTotal = computed(() => props.reviewCount ?? props.product.productReviewsCount ?? 0);
    const rating = computed(() => props.ratingAverage ?? props.product.ratingAverage ?? 0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="flex flex-col lg:flex-row gap-10 lg:gap-16"><div class="flex-shrink-0 lg:w-64"><div class="text-6xl font-black font-tech text-black mb-2">${ssrInterpolate(unref(formatRating)(unref(rating)))}</div><div class="mb-3">`);
      _push(ssrRenderComponent(RatingStars, {
        rating: unref(rating),
        "size-class": "w-5 h-5"
      }, null, _parent));
      _push(`</div><p class="text-sm text-gray-500 font-sans mb-6">${ssrInterpolate(unref(reviewTotal))} ${ssrInterpolate(unref(formatReviewLabel)(unref(reviewTotal), true))}</p>`);
      _push(ssrRenderComponent(BaseButton, {
        variant: "primary",
        class: "uppercase font-bold tracking-wider text-sm",
        onClick: ($event) => isReviewModalOpen.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Napísať recenziu `);
          } else {
            return [
              createTextVNode(" Napísať recenziu ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex-1 min-w-0">`);
      if (unref(productReviews)?.length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(productReviews), (review) => {
          _push(`<div class="bg-white p-5 border border-gray-100 flex flex-col"><div class="flex items-center gap-3 mb-3"><div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 font-tech text-sm flex-shrink-0">${ssrInterpolate(getInitials(review.externalUser || "Zákazník"))}</div><div class="min-w-0 flex-1"><span class="block font-bold text-xs uppercase tracking-wide truncate">${ssrInterpolate(review.externalUser || "Zákazník")}</span><span class="text-[10px] text-gray-400">${ssrInterpolate(formatDate(review.createdAt))}</span></div></div><div class="flex text-amber-400 mb-3"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(ssrRenderComponent(unref(Star), {
              key: i,
              class: ["w-3 h-3", i <= (review.points || 0) ? "fill-current" : "text-gray-200"]
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
          if (review.title) {
            _push(`<h4 class="font-bold text-sm mb-1.5 text-black uppercase">${ssrInterpolate(review.title)}</h4>`);
          } else {
            _push(`<!---->`);
          }
          if (review.content) {
            _push(`<p class="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1"> &quot;${ssrInterpolate(review.content)}&quot; </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="flex items-center gap-4 py-8">`);
        _push(ssrRenderComponent(unref(MessageSquare), { class: "w-8 h-8 text-gray-300 flex-shrink-0" }, null, _parent));
        _push(`<p class="text-gray-400 font-sans text-sm">Tento produkt zatiaľ nebol ohodnotený. Buďte prvý!</p></div>`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(__nuxt_component_2, {
        "is-open": isReviewModalOpen.value,
        title: "Napísať recenziu k produktu",
        onClose: ($event) => isReviewModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(ProductReviewForm, {
              "product-id": __props.product.id,
              onSuccess: handleReviewSuccess,
              onCancel: ($event) => isReviewModalOpen.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(ProductReviewForm, {
                "product-id": __props.product.id,
                onSuccess: handleReviewSuccess,
                onCancel: ($event) => isReviewModalOpen.value = false
              }, null, 8, ["product-id", "onCancel"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductReviewsSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "ProductReviewsSection" });

export { __nuxt_component_3 as default };
