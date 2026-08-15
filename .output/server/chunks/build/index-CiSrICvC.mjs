import { c as createLazyVisibleComponent } from './lazy-hydrated-component-DCe3AAtJ.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import CategoryHeroSlider from './CategoryHeroSlider-DqnrEm0d.mjs';
import Features from './Features-EjtG7tVH.mjs';
import { m as useI18n, C as useSeoMeta, u as useHead, g as useState, i as useRuntimeConfig, D as useAppConfig } from './server.mjs';
import './HeroSlider-Dyb6ghVk.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import 'lucide-vue-next';
import './constants-Dm0Yhftm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './media-BNPyNy3v.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './useScrollReveal-hir-7v74.mjs';
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

function useOrganizationJsonLD() {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const baseUrl = config.public.siteUrl || "https://slickly.sk";
  const phone = appConfig.contact.phone;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SLICKLY",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone.main,
        contactType: "customer service",
        areaServed: ["SK", "CZ", "PL", "HU", "DE", "AT"],
        availableLanguage: ["Slovak", "Czech"]
      },
      {
        "@type": "ContactPoint",
        telephone: phone.complaints,
        contactType: "returns",
        areaServed: "SK"
      }
    ]
    // sameAs zámerne vynechaný — pôvodné hodnoty odkazovali na staré mtsport.store
    // sociálne siete. Doplniť, až keď budú existovať reálne SLICKLY profily.
  };
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SLICKLY",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  useHead({
    script: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema) },
      { type: "application/ld+json", children: JSON.stringify(webSiteSchema) }
    ]
  });
}
function useLocalBusinessJsonLD() {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const baseUrl = config.public.siteUrl || "https://slickly.sk";
  const phone = appConfig.contact.phone;
  const email = appConfig.contact.email;
  const schema = {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "Organization"],
    "@id": `${baseUrl}/#organization`,
    name: "SLICKLY",
    alternateName: "SLICKLY",
    description: "SLICKLY je výhradne online obchod — autokozmetika, detailing produkty a príslušenstvo pre starostlivosť o auto s doručením po celom Slovensku a do okolitých krajín.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/favicon.svg`,
      width: 200,
      height: 60
    },
    image: `${baseUrl}/favicon.svg`,
    telephone: phone.main,
    email: email.info,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, Bank Transfer",
    areaServed: [
      { "@type": "Country", name: "Slovakia" },
      { "@type": "Country", name: "Czech Republic" },
      { "@type": "Country", name: "Poland" },
      { "@type": "Country", name: "Hungary" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" }
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone.main,
        contactType: "customer service",
        availableLanguage: ["Slovak", "Czech", "English"]
      }
    ]
    // foundingDate zámerne vynechaný — pôvodná hodnota '2010' bola zdedená z
    // MTSPORT branding a nedá sa overiť ako reálny SLICKLY dátum založenia.
  };
  useHead({
    script: [{ type: "application/ld+json", children: JSON.stringify(schema) }]
  });
}
const __nuxt_component_0_lazy_visible = createLazyVisibleComponent("components/home/AkciaCarousel.vue", () => import('./AkciaCarousel-BGDS1zSZ.mjs').then((c) => c.default || c));
const __nuxt_component_1_lazy_visible = createLazyVisibleComponent("components/home/Znacky.vue", () => import('./Znacky-CeEZ_qab.mjs').then((c) => c.default || c));
const __nuxt_component_2_lazy_visible = createLazyVisibleComponent("components/home/CategoryGrid.vue", () => import('./CategoryGrid-CJD-FAMG.mjs').then((c) => c.default || c));
const __nuxt_component_3_lazy_visible = createLazyVisibleComponent("components/home/FeaturedCollection.vue", () => import('./FeaturedCollection-Bqmmw40S.mjs').then((c) => c.default || c));
const __nuxt_component_4_lazy_visible = createLazyVisibleComponent("components/home/NewProducts.vue", () => import('./NewProducts-D7LqAcv3.mjs').then((c) => c.default || c));
const __nuxt_component_5_lazy_visible = createLazyVisibleComponent("components/home/HomeBlogSection.vue", () => import('./HomeBlogSection-CulcAOvY.mjs').then((c) => c.default || c));
const __nuxt_component_6_lazy_visible = createLazyVisibleComponent("components/home/BlogGrid.vue", () => import('./BlogGrid-_ZVyodcq.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const config = useRuntimeConfig();
    const CATEGORY_HOME_SLIDER = config.public.shopware.ids.categories.homeSlider;
    useOrganizationJsonLD();
    useLocalBusinessJsonLD();
    const { locale } = useI18n();
    const _ogLocaleMap = {
      sk: "sk_SK",
      cz: "cs_CZ",
      de: "de_DE",
      hu: "hu_HU",
      en: "en_GB",
      pl: "pl_PL"
    };
    useSeoMeta({
      description: () => t("home_seo.description"),
      keywords: () => t("home_seo.keywords"),
      ogTitle: () => t("home_seo.title"),
      ogDescription: () => t("home_seo.description"),
      ogType: "website",
      ogLocale: () => _ogLocaleMap[locale.value] || "sk_SK",
      ogUrl: "https://slickly.sk/"
    });
    useHead({
      title: () => t("home_seo.title"),
      titleTemplate: (title) => `SLICKLY | ${title}`
    });
    useState("isPageHome", () => false);
    useState("homePageCount", () => 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LazyVisibleAkciaCarousel = __nuxt_component_0_lazy_visible;
      const _component_LazyVisibleZnacky = __nuxt_component_1_lazy_visible;
      const _component_LazyVisibleCategoryGrid = __nuxt_component_2_lazy_visible;
      const _component_LazyVisibleFeaturedCollection = __nuxt_component_3_lazy_visible;
      const _component_LazyVisibleNewProducts = __nuxt_component_4_lazy_visible;
      const _component_LazyVisibleHomeBlogSection = __nuxt_component_5_lazy_visible;
      const _component_LazyVisibleBlogGrid = __nuxt_component_6_lazy_visible;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased relative" }, _attrs))}><h1 class="sr-only">${ssrInterpolate(unref(t)("home_seo.title"))}</h1>`);
      _push(ssrRenderComponent(CategoryHeroSlider, { categoryId: unref(CATEGORY_HOME_SLIDER) }, null, _parent));
      _push(ssrRenderComponent(Features, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleAkciaCarousel, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleZnacky, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleCategoryGrid, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleFeaturedCollection, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleNewProducts, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleHomeBlogSection, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleBlogGrid, { "hydrate-on-visible": "" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
