import { defineComponent, toRef, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
  __name: "ReviewsTab",
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
      } catch (e) {
      }
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("sk-SK", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    const getInitials = (authorName) => {
      return authorName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in font-sans" }, _attrs))}><div class="flex flex-col items-center text-center mb-16"><div class="text-6xl font-black font-tech text-black mb-2">${ssrInterpolate(unref(formatRating)(__props.ratingAverage ?? __props.product.ratingAverage))}</div><div class="mb-4 scale-125">`);
      _push(ssrRenderComponent(RatingStars, {
        rating: __props.ratingAverage ?? __props.product.ratingAverage ?? 0,
        "size-class": "w-5 h-5"
      }, null, _parent));
      _push(`</div><p class="text-gray-500 font-medium mb-8">Založené na ${ssrInterpolate(__props.reviewCount ?? __props.product.productReviewsCount ?? 0)} ${ssrInterpolate(unref(formatReviewLabel)(__props.reviewCount ?? __props.product.productReviewsCount ?? 0, true))}</p>`);
      _push(ssrRenderComponent(BaseButton, {
        variant: "primary",
        size: "lg",
        class: "uppercase font-bold tracking-wider",
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
      _push(`</div>`);
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
      if (unref(productReviews)?.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8"><!--[-->`);
        ssrRenderList(unref(productReviews), (review) => {
          _push(`<div class="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"><div class="flex justify-between items-start mb-4"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 font-tech text-lg">${ssrInterpolate(getInitials(review.externalUser || "Zákazník"))}</div><div class="text-left"><span class="block font-bold text-sm uppercase tracking-wide">${ssrInterpolate(review.externalUser || "Zákazník")}</span><span class="text-xs text-gray-400">Overený zákazník</span></div></div><span class="text-xs text-gray-400 font-medium">${ssrInterpolate(formatDate(review.createdAt))}</span></div><div class="flex text-yellow-400 mb-4 text-xs"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(ssrRenderComponent(unref(Star), {
              key: i,
              class: ["w-3 h-3", i <= (review.points || 0) ? "fill-current" : "text-gray-200"]
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
          if (review.title) {
            _push(`<h4 class="font-bold text-sm mb-2 text-black">${ssrInterpolate(review.title)}</h4>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-gray-600 italic leading-relaxed text-sm"> &quot;${ssrInterpolate(review.content)}&quot; </p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12 border border-dashed border-gray-200 rounded-lg">`);
        _push(ssrRenderComponent(unref(MessageSquare), { class: "w-12 h-12 text-gray-200 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-medium italic">Tento produkt zatiaľ nebol ohodnotený. Buďte prvý, kto napíše recenziu!</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/tabs/ReviewsTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReviewsTab = Object.assign(_sfc_main, { __name: "ReviewsTab" });

export { ReviewsTab as default };
