import __nuxt_component_0 from './index-B5zMXW0d.mjs';
import __nuxt_component_1 from './CmsPage-FwkThjWd.mjs';
import { defineComponent, withAsyncContext, unref, computed, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { getCmsBreadcrumbs, isLandingPage, isProduct, getSmallestThumbnailUrl, getCategoryImageUrl, getTranslatedProperty } from '@shopware/helpers';
import { h as useAsyncData, Q as createError, e as useShopwareContext, u as useHead } from './server.mjs';
import { u as useBreadcrumbs } from './useBreadcrumbs-Dt7IBWvA.mjs';
import './Element-XVWuoBtA.mjs';
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
import './Divider-CMbfAKW7.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'pinia';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useListing-D9PeCG7-.mjs';
import './useCategory-DZrTDjvY.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './useNavigationContext-KcJT19yU.mjs';

const cmsAssociations = {
  associations: {
    media: {
      associations: {
        media: {}
      }
    },
    cmsPage: {
      associations: {
        sections: {
          associations: {
            blocks: {
              associations: {
                slots: {
                  associations: {
                    block: {
                      associations: {
                        slots: {
                          associations: {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
function useCmsMeta(entity) {
  const meta = computed(() => {
    const entries = [];
    const keywords = getTranslatedProperty(entity, "keywords");
    const description = getTranslatedProperty(entity, "metaDescription");
    const title = getTranslatedProperty(entity, "metaTitle");
    if (keywords) {
      entries.push({ name: "keywords", content: keywords });
    }
    if (description) {
      entries.push({ name: "description", content: description });
    }
    if (title) {
      entries.push({ name: "title", content: title });
    }
    return entries;
  });
  return {
    title: computed(() => getTranslatedProperty(entity, "name")),
    meta
  };
}
function useLandingSearch() {
  const { apiClient } = useShopwareContext();
  const search = async (navigationId, options) => {
    const associations = options?.withCmsAssociations ? cmsAssociations.associations : {};
    const result = await apiClient.invoke(
      "readLandingPage post /landing-page/{landingPageId}",
      {
        pathParams: {
          landingPageId: navigationId
        },
        body: {
          associations
        }
      }
    );
    return result.data;
  };
  return {
    search
  };
}
function useCmsHead(entity, options) {
  const { title: metaTitle, meta } = useCmsMeta(unref(entity));
  const title = computed(() => {
    const title2 = metaTitle.value;
    if (options?.mainShopTitle) {
      return `${title2} | ${options.mainShopTitle}`;
    }
    return title2;
  });
  const ogMetaAllowedKeys = ["title", "description"];
  const ogMeta = computed(
    () => meta.value.filter((meta2) => ogMetaAllowedKeys.includes(meta2.name)).map((meta2) => ({
      name: `og:${meta2.name}`,
      content: meta2.content
    }))
  );
  const ogImage = computed(() => {
    const currentEntity = unref(entity);
    if (!currentEntity) {
      return {};
    }
    if (isLandingPage(currentEntity)) {
      return {};
    }
    return {
      name: "og:image",
      content: isProduct(currentEntity) ? getSmallestThumbnailUrl(currentEntity.media) : getCategoryImageUrl(currentEntity)
    };
  });
  const enhancedMeta = computed(() => [
    ...meta.value,
    ...ogMeta.value,
    ogImage.value,
    {
      name: "og:type",
      content: "website"
    },
    {
      name: "og:site_name",
      content: title.value
    }
  ]);
  useHead({
    title,
    meta: enhancedMeta
  });
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FrontendLandingPage",
  __ssrInlineRender: true,
  props: {
    navigationId: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { search } = useLandingSearch();
    const { data: landingResponse, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `cmsLanding${props.navigationId}`,
      async () => {
        const landingPage2 = await search(props.navigationId, {
          withCmsAssociations: true
        });
        return landingPage2;
      }
    )), __temp = await __temp, __restore(), __temp);
    if (landingResponse.value) {
      const breadcrumbs = getCmsBreadcrumbs(landingResponse.value);
      useBreadcrumbs(breadcrumbs);
    }
    if (!landingResponse?.value) {
      throw createError({
        statusCode: 500,
        message: error.value?.message
      });
    }
    const landingPage = landingResponse;
    useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutBreadcrumbs = __nuxt_component_0;
      const _component_CmsPage = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_LayoutBreadcrumbs, null, null, _parent));
      if (unref(landingResponse)?.cmsPage) {
        _push(ssrRenderComponent(_component_CmsPage, {
          content: unref(landingResponse).cmsPage
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/FrontendLandingPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FrontendLandingPage = Object.assign(_sfc_main, { __name: "FrontendLandingPage" });

export { FrontendLandingPage as default };
