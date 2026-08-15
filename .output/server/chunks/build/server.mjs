import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import * as Vue from 'vue';
import { computed, ref, watch, nextTick, getCurrentInstance as getCurrentInstance$1, getCurrentScope, hasInjectionContext, inject, onScopeDispose, shallowRef, shallowReadonly, unref, toRef, isRef, toValue, onServerPrefetch, defineComponent, provide, cloneVNode, h, createElementBlock, defineAsyncComponent, Suspense, mergeProps, shallowReactive, Fragment, useSSRContext, createApp, createVNode, Text, withAsyncContext, withCtx, openBlock, createBlock, createCommentVNode, toDisplayString as toDisplayString$1, createTextVNode, onErrorCaptured, resolveDynamicComponent, reactive, effectScope, isReadonly, toRaw, isShallow, isReactive, markRaw } from 'vue';
import { a7 as parse$2, c as createError$1, a8 as getRequestURL, a9 as klona, aa as withQuery, ab as hasProtocol, ac as isScriptProtocol, ad as joinURL, ae as getRequestHeader, a2 as destr, af as isEqual, ag as defuFn, ah as sanitizeStatusCode, N as setCookie, P as getCookie$1, Q as deleteCookie, ai as getContext, aj as parsePath, ak as parseQuery, al as $fetch$1, am as baseURL, an as createHooks, ao as executeAsync, ap as getRequestHeaders, aq as createDefu$1, ar as withoutTrailingSlash, as as isEqual$1 } from '../nitro/nitro.mjs';
import { setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { _api, addAPIProvider, setCustomIconsLoader } from '@iconify/vue';
import { createAPIClient } from '@shopware/api-client';
import { urlIsAbsolute, isMaintenanceMode } from '@shopware/helpers';
import Cookies from 'js-cookie';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { HomeIcon } from 'lucide-vue-next';
import { u as useSeoMeta$1, a as useHead$1, h as headSymbol } from '../routes/renderer.mjs';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

function parseCookies(event) {
  return parse$2(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}

typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;

function isPlainObject$1(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject$1(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject$1(value) && isPlainObject$1(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance$1()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = /* @__PURE__ */ useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await useRouter().replace(options.redirect);
  }
  error.value = void 0;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function useSeoMeta(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useSeoMeta$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_PtamfB47yqQY_Rh4zjrimgYJkXOrkZ_s7Rhm1JWaAcQ = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray$3(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$6 = { layout: "cart" };
const __nuxt_page_meta$5 = {};
const __nuxt_page_meta$4 = { layout: "default" };
const __nuxt_page_meta$3 = {
  layout: "checkout"
};
const __nuxt_page_meta$2 = { layout: "checkout" };
const __nuxt_page_meta$1 = { layout: "default" };
const __nuxt_page_meta = { layout: "checkout" };
const _routes = [
  {
    name: "cart___sk",
    path: "/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___cz",
    path: "/cz/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___de",
    path: "/de/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___hu",
    path: "/hu/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___en",
    path: "/en/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___pl",
    path: "/pl/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___en-GB",
    path: "/en-GB/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___pl-PL",
    path: "/pl-PL/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "cart___de-DE",
    path: "/de-DE/cart",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./cart-SLtC5l-3.mjs')
  },
  {
    name: "index___sk",
    path: "/",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___cz",
    path: "/cz",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___de",
    path: "/de",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___hu",
    path: "/hu",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___en",
    path: "/en",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___pl",
    path: "/pl",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___en-GB",
    path: "/en-GB",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___pl-PL",
    path: "/pl-PL",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "index___de-DE",
    path: "/de-DE",
    component: () => import('./index-CiSrICvC.mjs')
  },
  {
    name: "search___sk",
    path: "/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___cz",
    path: "/cz/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___de",
    path: "/de/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___hu",
    path: "/hu/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___en",
    path: "/en/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___pl",
    path: "/pl/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___en-GB",
    path: "/en-GB/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___pl-PL",
    path: "/pl-PL/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "search___de-DE",
    path: "/de-DE/search",
    component: () => import('./search-DjAXeiP2.mjs')
  },
  {
    name: "znacky___sk",
    path: "/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___cz",
    path: "/cz/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___de",
    path: "/de/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___hu",
    path: "/hu/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___en",
    path: "/en/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___pl",
    path: "/pl/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___en-GB",
    path: "/en-GB/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___pl-PL",
    path: "/pl-PL/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: "znacky___de-DE",
    path: "/de-DE/znacky",
    component: () => import('./znacky-nLQePHST.mjs')
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___sk",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___sk",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___sk",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___sk",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___sk",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___sk",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___sk",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___sk",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___sk",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/cz/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___cz",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___cz",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___cz",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___cz",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___cz",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___cz",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___cz",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___cz",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___cz",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/de/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___de",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___de",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___de",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___de",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___de",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___de",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___de",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___de",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___de",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/hu/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___hu",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___hu",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___hu",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___hu",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___hu",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___hu",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___hu",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___hu",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___hu",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/en/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___en",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___en",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___en",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___en",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___en",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___en",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___en",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___en",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___en",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/pl/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___pl",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___pl",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___pl",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___pl",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___pl",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___pl",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___pl",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___pl",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___pl",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/en-GB/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___en-GB",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___en-GB",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___en-GB",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___en-GB",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___en-GB",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___en-GB",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___en-GB",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___en-GB",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___en-GB",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/pl-PL/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___pl-PL",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___pl-PL",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___pl-PL",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___pl-PL",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___pl-PL",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___pl-PL",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___pl-PL",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___pl-PL",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___pl-PL",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$5?.name,
    path: "/de-DE/account",
    meta: { "middleware": "auth" },
    component: () => import('./account-Bp8qtiUB.mjs'),
    children: [
      {
        name: "account___de-DE",
        path: "",
        component: () => import('./index-CsGVlVWL.mjs')
      },
      {
        name: "account-address-new___de-DE",
        path: "address/new",
        component: () => import('./new-CvaOyiBY.mjs')
      },
      {
        name: "account-order___de-DE",
        path: "order",
        component: () => import('./index-L_gI1dO9.mjs')
      },
      {
        name: "account-address___de-DE",
        path: "address",
        component: () => import('./index-CzRJzVn0.mjs')
      },
      {
        name: "account-profile___de-DE",
        path: "profile",
        component: () => import('./index-CA08Jhso.mjs')
      },
      {
        name: "account-address-edit-id___de-DE",
        path: "address/edit/:id()",
        component: () => import('./_id_-Cg4C3CLW.mjs')
      },
      {
        name: "account-order-details-id___de-DE",
        path: "order/details/:id()",
        component: () => import('./_id_-B0fLIv0l.mjs')
      },
      {
        name: "account-profile-change-email___de-DE",
        path: "profile/change-email",
        component: () => import('./change-email-DmYcXKmy.mjs')
      },
      {
        name: "account-profile-change-password___de-DE",
        path: "profile/change-password",
        component: () => import('./change-password-DKhCHcZ-.mjs')
      }
    ]
  },
  {
    name: "all___sk",
    path: "/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___cz",
    path: "/cz/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___de",
    path: "/de/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___hu",
    path: "/hu/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___en",
    path: "/en/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___pl",
    path: "/pl/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___en-GB",
    path: "/en-GB/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___pl-PL",
    path: "/pl-PL/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "all___de-DE",
    path: "/de-DE/:all(.*)*",
    component: () => import('./_...all_-CD-fjMV-.mjs')
  },
  {
    name: "p-slug___sk",
    path: "/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___cz",
    path: "/cz/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___de",
    path: "/de/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___hu",
    path: "/hu/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___en",
    path: "/en/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___pl",
    path: "/pl/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___en-GB",
    path: "/en-GB/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___pl-PL",
    path: "/pl-PL/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "p-slug___de-DE",
    path: "/de-DE/p/:slug()",
    component: () => import('./_slug_-DW-UnNvJ.mjs')
  },
  {
    name: "register___sk",
    path: "/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___cz",
    path: "/cz/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___de",
    path: "/de/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___hu",
    path: "/hu/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___en",
    path: "/en/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___pl",
    path: "/pl/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___en-GB",
    path: "/en-GB/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___pl-PL",
    path: "/pl-PL/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "register___de-DE",
    path: "/de-DE/register",
    component: () => import('./register-C1fpAj2r.mjs')
  },
  {
    name: "wishlist___sk",
    path: "/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___cz",
    path: "/cz/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___de",
    path: "/de/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___hu",
    path: "/hu/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___en",
    path: "/en/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___pl",
    path: "/pl/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___en-GB",
    path: "/en-GB/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___pl-PL",
    path: "/pl-PL/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "wishlist___de-DE",
    path: "/de-DE/wishlist",
    component: () => import('./wishlist-aajy-b1-.mjs')
  },
  {
    name: "blog___sk",
    path: "/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___cz",
    path: "/cz/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___de",
    path: "/de/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___hu",
    path: "/hu/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___en",
    path: "/en/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___pl",
    path: "/pl/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___en-GB",
    path: "/en-GB/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___pl-PL",
    path: "/pl-PL/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog___de-DE",
    path: "/de-DE/blog",
    component: () => import('./index-Bl5WexTu.mjs')
  },
  {
    name: "blog-slug___sk",
    path: "/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___cz",
    path: "/cz/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___de",
    path: "/de/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___hu",
    path: "/hu/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___en",
    path: "/en/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___pl",
    path: "/pl/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___en-GB",
    path: "/en-GB/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___pl-PL",
    path: "/pl-PL/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "blog-slug___de-DE",
    path: "/de-DE/blog/:slug()",
    component: () => import('./_slug_-qV8BVBNr.mjs')
  },
  {
    name: "konfigurator___sk",
    path: "/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___cz",
    path: "/cz/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___de",
    path: "/de/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___hu",
    path: "/hu/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___en",
    path: "/en/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___pl",
    path: "/pl/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___en-GB",
    path: "/en-GB/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___pl-PL",
    path: "/pl-PL/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "konfigurator___de-DE",
    path: "/de-DE/konfigurator",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./konfigurator-IUY1WdZq.mjs')
  },
  {
    name: "checkout-cart___sk",
    path: "/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___cz",
    path: "/cz/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___de",
    path: "/de/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___hu",
    path: "/hu/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___en",
    path: "/en/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___pl",
    path: "/pl/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___en-GB",
    path: "/en-GB/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___pl-PL",
    path: "/pl-PL/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "checkout-cart___de-DE",
    path: "/de-DE/checkout/cart",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./cart-CBboHS-L.mjs')
  },
  {
    name: "znacka-slug___sk",
    path: "/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___cz",
    path: "/cz/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___de",
    path: "/de/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___hu",
    path: "/hu/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___en",
    path: "/en/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___pl",
    path: "/pl/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___en-GB",
    path: "/en-GB/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___pl-PL",
    path: "/pl-PL/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "znacka-slug___de-DE",
    path: "/de-DE/znacka/:slug()",
    component: () => import('./_slug_-Dwk6EQxX.mjs')
  },
  {
    name: "checkout___sk",
    path: "/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___cz",
    path: "/cz/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___de",
    path: "/de/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___hu",
    path: "/hu/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___en",
    path: "/en/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___pl",
    path: "/pl/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___en-GB",
    path: "/en-GB/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___pl-PL",
    path: "/pl-PL/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "checkout___de-DE",
    path: "/de-DE/checkout",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CT0okUJS.mjs')
  },
  {
    name: "porovnanie-hash___sk",
    path: "/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___cz",
    path: "/cz/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___de",
    path: "/de/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___hu",
    path: "/hu/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___en",
    path: "/en/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___pl",
    path: "/pl/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___en-GB",
    path: "/en-GB/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___pl-PL",
    path: "/pl-PL/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "porovnanie-hash___de-DE",
    path: "/de-DE/porovnanie/:hash()",
    component: () => import('./_hash_-B2h5PbYm.mjs')
  },
  {
    name: "blog-autor-author___sk",
    path: "/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___cz",
    path: "/cz/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___de",
    path: "/de/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___hu",
    path: "/hu/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___en",
    path: "/en/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___pl",
    path: "/pl/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___en-GB",
    path: "/en-GB/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___pl-PL",
    path: "/pl-PL/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "blog-autor-author___de-DE",
    path: "/de-DE/blog/autor/:author()",
    component: () => import('./_author_-1tXqCRZn.mjs')
  },
  {
    name: "newsletter-subscribe___sk",
    path: "/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___cz",
    path: "/cz/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___de",
    path: "/de/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___hu",
    path: "/hu/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___en",
    path: "/en/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___pl",
    path: "/pl/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___en-GB",
    path: "/en-GB/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___pl-PL",
    path: "/pl-PL/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "newsletter-subscribe___de-DE",
    path: "/de-DE/newsletter-subscribe",
    component: () => import('./newsletter-subscribe-3DyMJ2qT.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___sk",
    path: "/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___cz",
    path: "/cz/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___de",
    path: "/de/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___hu",
    path: "/hu/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___en",
    path: "/en/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___pl",
    path: "/pl/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___en-GB",
    path: "/en-GB/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___pl-PL",
    path: "/pl-PL/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "odstupenie-od-zmluvy___de-DE",
    path: "/de-DE/odstupenie-od-zmluvy",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./odstupenie-od-zmluvy-BAQK9Du-.mjs')
  },
  {
    name: "registration-confirm___sk",
    path: "/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___cz",
    path: "/cz/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___de",
    path: "/de/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___hu",
    path: "/hu/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___en",
    path: "/en/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___pl",
    path: "/pl/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___en-GB",
    path: "/en-GB/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___pl-PL",
    path: "/pl-PL/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "registration-confirm___de-DE",
    path: "/de-DE/registration/confirm",
    component: () => import('./confirm-_5YzY_c1.mjs')
  },
  {
    name: "checkout-success-id-paid___sk",
    path: "/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___cz",
    path: "/cz/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___de",
    path: "/de/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___hu",
    path: "/hu/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___en",
    path: "/en/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___pl",
    path: "/pl/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___en-GB",
    path: "/en-GB/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___pl-PL",
    path: "/pl-PL/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id-paid___de-DE",
    path: "/de-DE/checkout/success/:id()/paid",
    component: () => import('./paid-Bxovxvl4.mjs')
  },
  {
    name: "checkout-success-id___sk",
    path: "/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___cz",
    path: "/cz/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___de",
    path: "/de/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___hu",
    path: "/hu/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___en",
    path: "/en/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___pl",
    path: "/pl/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___en-GB",
    path: "/en-GB/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___pl-PL",
    path: "/pl-PL/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id___de-DE",
    path: "/de-DE/checkout/success/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-aOHZPc46.mjs')
  },
  {
    name: "checkout-success-id-unpaid___sk",
    path: "/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___cz",
    path: "/cz/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___de",
    path: "/de/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___hu",
    path: "/hu/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___en",
    path: "/en/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___pl",
    path: "/pl/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___en-GB",
    path: "/en-GB/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___pl-PL",
    path: "/pl-PL/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  },
  {
    name: "checkout-success-id-unpaid___de-DE",
    path: "/de-DE/checkout/success/:id()/unpaid",
    component: () => import('./unpaid-sGA1KRyu.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const routerOptions1 = {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80
      };
    }
    if (to.path === from.path) return false;
    return { top: 0, left: 0 };
  }
};
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const hashMode = routerOptions1.hashMode ?? false;
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0,
  ...routerOptions1
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {
  auth: () => import('./auth-6f25BZv6.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$3(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_Ws8SUMTo68XWM_TEhuJIQbORo_qC7bnyjJcGdGVwAYw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const __nuxt_component_0$2 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_0$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance$1();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance$1()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry2 = nuxtApp._asyncData[key.value];
      if (entry2?._abortController) {
        try {
          entry2._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry2._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] && nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestHeaders(include) {
  const event = useRequestEvent();
  const _headers = event ? getRequestHeaders(event) : {};
  {
    return _headers;
  }
}
function prerenderRoutes(path) {
  {
    return;
  }
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie$1(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
function useRequestURL(opts) {
  {
    return getRequestURL(useRequestEvent(), opts);
  }
}
const cfg0 = defineAppConfig({
  imagePlaceholder: {
    color: "#000000"
  },
  // Central contact info — update here, propagates everywhere
  contact: {
    phone: {
      main: "+421918564238",
      mainDisplay: "+421 918 564 238",
      mainHref: "tel:+421918564238",
      complaints: "+421918564238",
      complaintsDisplay: "+421 918 564 238"
    },
    email: {
      info: "info@slickly.sk",
      infoHref: "mailto:info@slickly.sk"
    }
  }
});
const cfg1 = defineAppConfig({
  // Default cache lifetime (in milliseconds) for CSR (Client-Side Rendering) data (24 hours)
  defaultCSRCacheLifetime: 864e5,
  // Image placeholder configuration (cms-base-layer uses this setting)
  imagePlaceholder: {
    color: "#543B95"
    // brand-primary - can be overridden in child layers
  }
});
const cfg2 = defineAppConfig({
  imagePlaceholder: {
    color: "#543B95"
  },
  unocssRuntime: true
});
const inlineConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codex",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "cuida",
      "dashicons",
      "devicon",
      "devicon-plain",
      "dinkie-icons",
      "duo-icons",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fa7-brands",
      "fa7-regular",
      "fa7-solid",
      "fad",
      "famicons",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-color",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "garden",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "ix",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "lineicons",
      "logos",
      "ls",
      "lsicon",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-icon-theme",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "meteor-icons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "nrk",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "picon",
      "pixel",
      "pixelarticons",
      "prime",
      "proicons",
      "ps",
      "qlementine-icons",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "roentgen",
      "si",
      "si-glyph",
      "sidekickicons",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "stash",
      "streamline",
      "streamline-block",
      "streamline-color",
      "streamline-cyber",
      "streamline-cyber-color",
      "streamline-emojis",
      "streamline-flex",
      "streamline-flex-color",
      "streamline-freehand",
      "streamline-freehand-color",
      "streamline-kameleon-color",
      "streamline-logos",
      "streamline-pixel",
      "streamline-plump",
      "streamline-plump-color",
      "streamline-sharp",
      "streamline-sharp-color",
      "streamline-stickies-color",
      "streamline-ultimate",
      "streamline-ultimate-color",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "temaki",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons",
      "shopware"
    ],
    "fetchTimeout": 1500,
    "customCollections": [
      "shopware"
    ]
  }
};
const __appConfig = /* @__PURE__ */ defuFn(cfg0, cfg1, cfg2, inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(__appConfig);
  return nuxtApp._appConfig;
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia;
    }
    return {
      provide: {
        pinia
      }
    };
  },
  hooks: {
    "app:rendered"() {
      const nuxtApp = useNuxtApp();
      nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
      setActivePinia(void 0);
    }
  }
});
const LazyFrontendDetailPage = defineAsyncComponent(() => import('./FrontendDetailPage-PTUYbz2b.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabAdresy = defineAsyncComponent(() => import('./AccountTabAdresy-Cyn2MrOg.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabObjednavky = defineAsyncComponent(() => import('./AccountTabObjednavky-DV_1WI0n.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabOblubene = defineAsyncComponent(() => import('./AccountTabOblubene-PcnNkvc_.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabPorovnania = defineAsyncComponent(() => import('./AccountTabPorovnania-B9G3M8wv.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabPrehled = defineAsyncComponent(() => import('./AccountTabPrehled-ZpQYvJ2i.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabProfil = defineAsyncComponent(() => import('./AccountTabProfil-DrSA__No.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabReklamacie = defineAsyncComponent(() => import('./AccountTabReklamacie-BC0CdKua.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabSledovanie = defineAsyncComponent(() => import('./AccountTabSledovanie-ID8uO4ve.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabUlozenKosik = defineAsyncComponent(() => import('./AccountTabUlozenKosik-B6CRIf_9.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountTabVernostne = defineAsyncComponent(() => import('./AccountTabVernostne-CYj3XxAu.mjs').then((n) => n.A).then((r) => r["default"] || r.default || r));
const LazyBiometricLogin = defineAsyncComponent(() => import('./BiometricLogin-ZvMRd56E.mjs').then((r) => r["default"] || r.default || r));
const LazyBiometricSetup = defineAsyncComponent(() => import('./BiometricSetup-vzMaLpkx.mjs').then((r) => r["default"] || r.default || r));
const LazyForgotPasswordForm = defineAsyncComponent(() => import('./ForgotPasswordForm-CTFrh_Xj.mjs').then((r) => r["default"] || r.default || r));
const LazyLoginForm = defineAsyncComponent(() => import('./LoginForm-B-UFijii.mjs').then((r) => r["default"] || r.default || r));
const LazyPasskeyManager = defineAsyncComponent(() => import('./PasskeyManager-Dc4pAXty.mjs').then((r) => r["default"] || r.default || r));
const LazyRegisterForm = defineAsyncComponent(() => import('./RegisterForm-xy4C6HGo.mjs').then((r) => r["default"] || r.default || r));
const LazySocialLoginButtons = defineAsyncComponent(() => import('./SocialLoginButtons-DBcyBy6L.mjs').then((r) => r["default"] || r.default || r));
const LazyCartAdvisor = defineAsyncComponent(() => import('./CartAdvisor-BXn9Juax.mjs').then((r) => r["default"] || r.default || r));
const LazyCartCrossSellPanel = defineAsyncComponent(() => import('./CartCrossSellPanel-Mdkp8Ko-.mjs').then((r) => r["default"] || r.default || r));
const LazyCartEmptyState = defineAsyncComponent(() => import('./CartEmptyState-BvK2BhPx.mjs').then((r) => r["default"] || r.default || r));
const LazyCartFooter = defineAsyncComponent(() => import('./CartFooter-B49wk9wz.mjs').then((r) => r["default"] || r.default || r));
const LazyCartHeader = defineAsyncComponent(() => import('./CartHeader-DVeKpaGw.mjs').then((r) => r["default"] || r.default || r));
const LazyCartItem = defineAsyncComponent(() => import('./CartItem-D792LrjW.mjs').then((r) => r["default"] || r.default || r));
const LazyCartShippingBar = defineAsyncComponent(() => import('./CartShippingBar-C9uHFeOa.mjs').then((r) => r["default"] || r.default || r));
const LazyCartSidebar = defineAsyncComponent(() => import('./CartSidebar-01RKWpmQ.mjs').then((r) => r["default"] || r.default || r));
const LazySaveCart = defineAsyncComponent(() => import('./SaveCart-mMaBwBjs.mjs').then((r) => r["default"] || r.default || r));
const LazyShareCart = defineAsyncComponent(() => import('./ShareCart-Du09d8kF.mjs').then((r) => r["default"] || r.default || r));
const LazyCartReviewStep = defineAsyncComponent(() => import('./CartReviewStep-BOyjiFD6.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutSteps = defineAsyncComponent(() => import('./CheckoutSteps-fIRCoRAa.mjs').then((r) => r["default"] || r.default || r));
const LazyDeliveryStep = defineAsyncComponent(() => import('./DeliveryStep-Ba2Hg65S.mjs').then((n) => n.D).then((r) => r["default"] || r.default || r));
const LazyOrderSummary = defineAsyncComponent(() => import('./OrderSummary-TDFgl67k.mjs').then((r) => r["default"] || r.default || r));
const LazyPaymentStep = defineAsyncComponent(() => import('./PaymentStep-8sr8refq.mjs').then((r) => r["default"] || r.default || r));
const LazyPersonalInfoStep = defineAsyncComponent(() => import('./PersonalInfoStep-B9F3iG2b.mjs').then((r) => r["default"] || r.default || r));
const LazyShippingPaymentStep = defineAsyncComponent(() => import('./ShippingPaymentStep-BlhevJVJ.mjs').then((r) => r["default"] || r.default || r));
const LazySpsPickupPointPicker = defineAsyncComponent(() => import('./SpsPickupPointPicker-BbRa_Lhl.mjs').then((r) => r["default"] || r.default || r));
const LazySuccessStep = defineAsyncComponent(() => import('./SuccessStep-DRxsUXBU.mjs').then((r) => r["default"] || r.default || r));
const LazyOffcanvasFilter = defineAsyncComponent(() => import('./OffcanvasFilter-w0NP4PVv.mjs').then((r) => r["default"] || r.default || r));
const LazyProductFilters = defineAsyncComponent(() => import('./ProductFilters-CjCB-Ex6.mjs').then((r) => r["default"] || r.default || r));
const LazyStickyToolbar = defineAsyncComponent(() => import('./StickyToolbar-B4NF0glf.mjs').then((r) => r["default"] || r.default || r));
const LazyChatBot = defineAsyncComponent(() => import('./ChatBot-CUtV2x2V.mjs').then((r) => r["default"] || r.default || r));
const LazyChatProductCard = defineAsyncComponent(() => import('./ChatProductCard-CtgfhJIO.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsHeroSlider = defineAsyncComponent(() => import('./CmsHeroSlider-BKZOKvcN.mjs').then((r) => r["default"] || r.default || r));
const LazyStaticPage = defineAsyncComponent(() => import('./StaticPage-BI_n2ZKH.mjs').then((r) => r["default"] || r.default || r));
const LazyFrontendNavigationPage = defineAsyncComponent(() => import('./FrontendNavigationPage-svISTSmx.mjs').then((r) => r["default"] || r.default || r));
const LazyProductCard = defineAsyncComponent(() => import('./ProductCard-F91lCt7x.mjs').then((r) => r["default"] || r.default || r));
const LazyAkciaCarousel = defineAsyncComponent(() => import('./AkciaCarousel-BGDS1zSZ.mjs').then((r) => r["default"] || r.default || r));
const LazyBlogGrid = defineAsyncComponent(() => import('./BlogGrid-_ZVyodcq.mjs').then((r) => r["default"] || r.default || r));
const LazyCategoryGrid = defineAsyncComponent(() => import('./CategoryGrid-CJD-FAMG.mjs').then((r) => r["default"] || r.default || r));
const LazyCategoryHeroSlider = defineAsyncComponent(() => import('./CategoryHeroSlider-DqnrEm0d.mjs').then((r) => r["default"] || r.default || r));
const LazyFeaturedCollection = defineAsyncComponent(() => import('./FeaturedCollection-Bqmmw40S.mjs').then((r) => r["default"] || r.default || r));
const LazyFeatures = defineAsyncComponent(() => import('./Features-EjtG7tVH.mjs').then((r) => r["default"] || r.default || r));
const LazyHeroSlider = defineAsyncComponent(() => import('./HeroSlider-Dyb6ghVk.mjs').then((r) => r["default"] || r.default || r));
const LazyHomeBlogSection = defineAsyncComponent(() => import('./HomeBlogSection-CulcAOvY.mjs').then((r) => r["default"] || r.default || r));
const LazyNewProducts = defineAsyncComponent(() => import('./NewProducts-D7LqAcv3.mjs').then((r) => r["default"] || r.default || r));
const LazyNewsletter = defineAsyncComponent(() => import('./Newsletter-TXMf0tNh.mjs').then((r) => r["default"] || r.default || r));
const LazyRecommendedProducts = defineAsyncComponent(() => import('./RecommendedProducts-Drc3b6WA.mjs').then((r) => r["default"] || r.default || r));
const LazyReviewsWall = defineAsyncComponent(() => import('./ReviewsWall-BJ8CHQ-9.mjs').then((r) => r["default"] || r.default || r));
const LazyRideStyles = defineAsyncComponent(() => import('./RideStyles-bNZcWD4w.mjs').then((r) => r["default"] || r.default || r));
const LazyZnacky = defineAsyncComponent(() => import('./Znacky-CeEZ_qab.mjs').then((r) => r["default"] || r.default || r));
const LazyFooter = defineAsyncComponent(() => import('./Footer-BLTUTaDb.mjs').then((r) => r["default"] || r.default || r));
const LazyMobileBottomNav = defineAsyncComponent(() => import('./MobileBottomNav-D9MIPtq3.mjs').then((r) => r["default"] || r.default || r));
const LazyNavbar = defineAsyncComponent(() => import('./Navbar-KxpvpSGD.mjs').then((r) => r["default"] || r.default || r));
const LazyCountrySwitcher = defineAsyncComponent(() => import('./CountrySwitcher-C4x3_VgU.mjs').then((r) => r["default"] || r.default || r));
const LazyDesktopNav = defineAsyncComponent(() => import('./DesktopNav-vXzySe49.mjs').then((r) => r["default"] || r.default || r));
const LazyLogo = defineAsyncComponent(() => import('./Logo-DVDlVLTg.mjs').then((r) => r["default"] || r.default || r));
const LazyMegaMenu = defineAsyncComponent(() => import('./MegaMenu-DDO8AaUH.mjs').then((r) => r["default"] || r.default || r));
const LazyMobileMenu = defineAsyncComponent(() => import('./MobileMenu-zBFe8I2X.mjs').then((r) => r["default"] || r.default || r));
const LazyMobileSearchOverlay = defineAsyncComponent(() => import('./MobileSearchOverlay-DcyoyHsN.mjs').then((r) => r["default"] || r.default || r));
const LazyNavIcons = defineAsyncComponent(() => import('./NavIcons-B-wFQe5J.mjs').then((r) => r["default"] || r.default || r));
const LazySearchBar = defineAsyncComponent(() => import('./SearchBar-DdxL9B3w.mjs').then((r) => r["default"] || r.default || r));
const LazyTopBar = defineAsyncComponent(() => import('./TopBar-6KU_rIcN.mjs').then((r) => r["default"] || r.default || r));
const LazySearchDropdown = defineAsyncComponent(() => import('./SearchDropdown-DiilS_pq.mjs').then((r) => r["default"] || r.default || r));
const LazySearchDropdownEmpty = defineAsyncComponent(() => import('./SearchDropdownEmpty-Drtrfsti.mjs').then((r) => r["default"] || r.default || r));
const LazySearchDropdownResults = defineAsyncComponent(() => import('./SearchDropdownResults-Bqt5Ih8X.mjs').then((r) => r["default"] || r.default || r));
const LazySearchInput = defineAsyncComponent(() => import('./SearchInput-DJSnmuNk.mjs').then((r) => r["default"] || r.default || r));
const LazyComparisonModal = defineAsyncComponent(() => import('./ComparisonModal-UTVsyEk7.mjs').then((r) => r["default"] || r.default || r));
const LazyManufacturerInfo = defineAsyncComponent(() => import('./ManufacturerInfo-CWjTobFI.mjs').then((r) => r["default"] || r.default || r));
const LazyPriceOfferModal = defineAsyncComponent(() => import('./PriceOfferModal-DKDCku-7.mjs').then((r) => r["default"] || r.default || r));
const LazyProductCardMini = defineAsyncComponent(() => import('./ProductCardMini-C5JVac9Q.mjs').then((r) => r["default"] || r.default || r));
const LazyProductDetail = defineAsyncComponent(() => import('./ProductDetail-DK7Wd6yk.mjs').then((r) => r["default"] || r.default || r));
const LazyProductDetailSkeleton = defineAsyncComponent(() => Promise.resolve().then(() => ProductDetailSkeleton$1).then((r) => r["default"] || r.default || r));
const LazyProductGallery = defineAsyncComponent(() => import('./ProductGallery-DOHcpZW_.mjs').then((r) => r["default"] || r.default || r));
const LazyProductInfo = defineAsyncComponent(() => import('./ProductInfo-DCaAXPz5.mjs').then((r) => r["default"] || r.default || r));
const LazyProductQA = defineAsyncComponent(() => import('./ProductQA-ChEw2ODZ.mjs').then((r) => r["default"] || r.default || r));
const LazyProductReviewForm = defineAsyncComponent(() => import('./ProductReviewForm-DO_Xeltg.mjs').then((r) => r["default"] || r.default || r));
const LazyProductReviewsSection = defineAsyncComponent(() => import('./ProductReviewsSection-CUcO23rK.mjs').then((r) => r["default"] || r.default || r));
const LazyProductStickyBar = defineAsyncComponent(() => import('./ProductStickyBar-BB3YXDuq.mjs').then((r) => r["default"] || r.default || r));
const LazyProductTabs = defineAsyncComponent(() => import('./ProductTabs-BZR-aOHd.mjs').then((r) => r["default"] || r.default || r));
const LazyShareProduct = defineAsyncComponent(() => import('./ShareProduct-vwcTFzOy.mjs').then((r) => r["default"] || r.default || r));
const LazySupportPanel = defineAsyncComponent(() => import('./SupportPanel-BZBZzaQ2.mjs').then((r) => r["default"] || r.default || r));
const LazyTrustBadges = defineAsyncComponent(() => import('./TrustBadges-BcdpP2yW.mjs').then((r) => r["default"] || r.default || r));
const LazyVariantSelector = defineAsyncComponent(() => import('./VariantSelector-DUiZzl4P.mjs').then((r) => r["default"] || r.default || r));
const LazyWatchdogModal = defineAsyncComponent(() => import('./WatchdogModal-Db6cQNcM.mjs').then((r) => r["default"] || r.default || r));
const LazyDescriptionTab = defineAsyncComponent(() => import('./DescriptionTab-D8HoIiln.mjs').then((r) => r["default"] || r.default || r));
const LazyDistributorTab = defineAsyncComponent(() => import('./DistributorTab-CqvcHcqV.mjs').then((r) => r["default"] || r.default || r));
const LazyDownloadsTab = defineAsyncComponent(() => import('./DownloadsTab-CHj4wAVb.mjs').then((r) => r["default"] || r.default || r));
const LazyReviewsTab = defineAsyncComponent(() => import('./ReviewsTab-BNH7kirM.mjs').then((r) => r["default"] || r.default || r));
const LazySpecsTab = defineAsyncComponent(() => import('./SpecsTab-Bl4q2Y0e.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementCenterText = defineAsyncComponent(() => import('./CmsElementCenterText-DFyMaOWf.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementProductDescriptionReviews = defineAsyncComponent(() => import('./CmsElementProductDescriptionReviews-C5yxPiEi.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementTextHero = defineAsyncComponent(() => import('./CmsElementTextHero-q0vy2031.mjs').then((r) => r["default"] || r.default || r));
const LazyReturnFormModal = defineAsyncComponent(() => import('./ReturnFormModal-DM7PpMMO.mjs').then((r) => r["default"] || r.default || r));
const LazyReturnFormStep1 = defineAsyncComponent(() => import('./ReturnFormStep1-J6OeDrR0.mjs').then((r) => r["default"] || r.default || r));
const LazyReturnFormStep2 = defineAsyncComponent(() => import('./ReturnFormStep2-DMCLLvW8.mjs').then((r) => r["default"] || r.default || r));
const LazyReturnFormStep3 = defineAsyncComponent(() => import('./ReturnFormStep3-BmRowXns.mjs').then((r) => r["default"] || r.default || r));
const LazyReturnFormSuccess = defineAsyncComponent(() => import('./ReturnFormSuccess-CYofRI6H.mjs').then((r) => r["default"] || r.default || r));
const LazyAddToCartButton = defineAsyncComponent(() => import('./AddToCartButton-B8hFUbWd.mjs').then((r) => r["default"] || r.default || r));
const LazyAppHoneypot = defineAsyncComponent(() => import('./AppHoneypot-DdH0YZXD.mjs').then((r) => r["default"] || r.default || r));
const LazyAppModal = defineAsyncComponent(() => import('./AppModal-CMHCLJuP.mjs').then((r) => r["default"] || r.default || r));
const LazyBackendErrorState = defineAsyncComponent(() => import('./BackendErrorState-P5VtA7Me.mjs').then((r) => r["default"] || r.default || r));
const LazyBaseButton = defineAsyncComponent(() => import('./BaseButton-BJMOoNbK.mjs').then((r) => r["default"] || r.default || r));
const LazyBaseLink = defineAsyncComponent(() => import('./BaseLink-CtWKrAdk.mjs').then((r) => r["default"] || r.default || r));
const LazyBaseStockStatus = defineAsyncComponent(() => import('./BaseStockStatus-3mdrKsuH.mjs').then((r) => r["default"] || r.default || r));
const LazyComparisonToast = defineAsyncComponent(() => import('./ComparisonToast--eclLEUD.mjs').then((r) => r["default"] || r.default || r));
const LazyQuantitySelector = defineAsyncComponent(() => import('./QuantitySelector-B6vBeA3f.mjs').then((r) => r["default"] || r.default || r));
const LazyQuickViewModal = defineAsyncComponent(() => import('./QuickViewModal-Bss3Rog_.mjs').then((r) => r["default"] || r.default || r));
const LazyRatingStars = defineAsyncComponent(() => import('./RatingStars-CZsf46JE.mjs').then((r) => r["default"] || r.default || r));
const LazyScrollToTop = defineAsyncComponent(() => import('./ScrollToTop-CiRdL0VO.mjs').then((r) => r["default"] || r.default || r));
const LazySizeChartModal = defineAsyncComponent(() => import('./SizeChartModal-Ca3Y4Pvt.mjs').then((r) => r["default"] || r.default || r));
const LazyWishlistToast = defineAsyncComponent(() => import('./WishlistToast-Ch5f5l0b.mjs').then((r) => r["default"] || r.default || r));
const LazyFrontendAccountCustomerGroupRegistrationPage = defineAsyncComponent(() => import('./FrontendAccountCustomerGroupRegistrationPage-D2yz9M79.mjs').then((r) => r["default"] || r.default || r));
const LazyFrontendLandingPage = defineAsyncComponent(() => import('./FrontendLandingPage-DfhGBaZb.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountActionLink = defineAsyncComponent(() => import('./ActionLink-DifUUHPS.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountLoginForm = defineAsyncComponent(() => import('./LoginForm-ChqACs17.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountNewsletterSection = defineAsyncComponent(() => import('./NewsletterSection-DnpbAbFL.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountPageHeader = defineAsyncComponent(() => import('./PageHeader-CHrO2U4n.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountRegistrationForm = defineAsyncComponent(() => import('./RegistrationForm-BglGlhsC.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountSectionHeader = defineAsyncComponent(() => import('./SectionHeader-DyYH6NEM.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountAddressDataSection = defineAsyncComponent(() => import('./DataSection-C2-LUM1W.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountAddressDeleteButton = defineAsyncComponent(() => import('./DeleteButton-C2mhQTWj.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountAddressEditButton = defineAsyncComponent(() => import('./EditButton-DGxlnwSh.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountAddressForm = defineAsyncComponent(() => import('./Form-DwIjG5_K.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountAddressTile = defineAsyncComponent(() => import('./Tile-BERtVUuN.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountMenuElement = defineAsyncComponent(() => import('./element-B__dpnqL.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountMenuList = defineAsyncComponent(() => import('./list-BCGvZYuB.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderDetails = defineAsyncComponent(() => import('./Details-R1R9Esfv.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderDownloads = defineAsyncComponent(() => import('./Downloads-Ds3QIgv9.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLine = defineAsyncComponent(() => import('./Line-Dhl0MxsU.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineData = defineAsyncComponent(() => import('./LineData-GQG9oQnE.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineItem = defineAsyncComponent(() => import('./LineItem-B5SzDP68.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineItemCredit = defineAsyncComponent(() => import('./LineItemCredit-CiumI4bA.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineItemCustom = defineAsyncComponent(() => import('./LineItemCustom-gP1dVbbi.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineItemProduct = defineAsyncComponent(() => import('./LineItemProduct-BlN5GsYX.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderLineItemPromotion = defineAsyncComponent(() => import('./LineItemPromotion-DyVsVy8Z.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderProduct = defineAsyncComponent(() => import('./Product-CxGE2cGw.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderStatus = defineAsyncComponent(() => import('./Status-BPwYdPy_.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountOrderSummary = defineAsyncComponent(() => import('./Summary-DNbQ-ygT.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountPersonalDataForm = defineAsyncComponent(() => import('./DataForm-DJxzQY7L.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountPersonalDataSection = defineAsyncComponent(() => import('./DataSection-D3DlmO5D.mjs').then((r) => r["default"] || r.default || r));
const LazyAccountPersonalLoginData = defineAsyncComponent(() => import('./LoginData-BJx7d_b4.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutCustomerAddress = defineAsyncComponent(() => import('./CustomerAddress-B6i-A3G8.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutCustomerAddressChosen = defineAsyncComponent(() => import('./CustomerAddressChosen-zdQ5d18x.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutCustomerBaseInfo = defineAsyncComponent(() => import('./CustomerBaseInfo-ClblcwKq.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutPaymentMethods = defineAsyncComponent(() => import('./PaymentMethods--TIqjnna.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutProductTile = defineAsyncComponent(() => import('./ProductTile-BB2m7r-T.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutShippingMethods = defineAsyncComponent(() => import('./ShippingMethods-4-3JWqLx.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutStepHeader = defineAsyncComponent(() => import('./StepHeader-lwgI2ufv.mjs').then((r) => r["default"] || r.default || r));
const LazyCheckoutSummaryBox = defineAsyncComponent(() => import('./SummaryBox-CX2paqlO.mjs').then((r) => r["default"] || r.default || r));
const LazyFormAccountTypeSelect = defineAsyncComponent(() => import('./AccountTypeSelect-WWW-q77x.mjs').then((r) => r["default"] || r.default || r));
const LazyFormBaseButton = defineAsyncComponent(() => import('./BaseButton-CtNN_2CK.mjs').then((r) => r["default"] || r.default || r));
const LazyFormBaseDropdown = defineAsyncComponent(() => import('./BaseDropdown-DnldUMz4.mjs').then((r) => r["default"] || r.default || r));
const LazyFormBaseInput = defineAsyncComponent(() => import('./BaseInput-Bd1YNFpA.mjs').then((r) => r["default"] || r.default || r));
const LazyFormCheckbox = defineAsyncComponent(() => import('./Checkbox-DT7ZMZZl.mjs').then((r) => r["default"] || r.default || r));
const LazyFormDropdownField = defineAsyncComponent(() => import('./DropdownField-DTfEBMIB.mjs').then((r) => r["default"] || r.default || r));
const LazyFormIconButton = defineAsyncComponent(() => import('./IconButton-C-Xi6SDN.mjs').then((r) => r["default"] || r.default || r));
const LazyFormInputField = defineAsyncComponent(() => import('./InputField-D300m7hz.mjs').then((r) => r["default"] || r.default || r));
const LazyFormLinkButton = defineAsyncComponent(() => import('./LinkButton-CTjOSiub.mjs').then((r) => r["default"] || r.default || r));
const LazyFormQuantitySelect = defineAsyncComponent(() => import('./QuantitySelect-CmcRrO8d.mjs').then((r) => r["default"] || r.default || r));
const LazyFormRadioButton = defineAsyncComponent(() => import('./RadioButton-Bx0xOWZ0.mjs').then((r) => r["default"] || r.default || r));
const LazyFormSalutationSelect = defineAsyncComponent(() => import('./SalutationSelect-CT4DLAVC.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutAccountMenu = defineAsyncComponent(() => import('./AccountMenu-BeZAwSrG.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutFooter = defineAsyncComponent(() => import('./Footer-CBA-uJjb.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeader = defineAsyncComponent(() => import('./Header-CKV8X-oS.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutMainBadge = defineAsyncComponent(() => import('./MainBadge-CpIa_c3m.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutMainCounter = defineAsyncComponent(() => import('./MainCounter-CRUGyARM.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutMetaNavigation = defineAsyncComponent(() => import('./MetaNavigation-r7tFUa5m.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutMiniCart = defineAsyncComponent(() => import('./MiniCart-BSX3Qu4o.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutNotification = defineAsyncComponent(() => import('./Notification-aCZKxyOH.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutNotifications = defineAsyncComponent(() => import('./Notifications-2preuZWH.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutSideMenu = defineAsyncComponent(() => import('./SideMenu-uiHzbM41.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutSidebar = defineAsyncComponent(() => import('./Sidebar-CUx_e7L7.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutBreadcrumbsDivider = defineAsyncComponent(() => import('./Divider-CMbfAKW7.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutBreadcrumbsElement = defineAsyncComponent(() => import('./Element-XVWuoBtA.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutBreadcrumbs = defineAsyncComponent(() => import('./index-B5zMXW0d.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutFooterNewsletterBox = defineAsyncComponent(() => import('./NewsletterBox-DNSJZCIB.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderCartIcon = defineAsyncComponent(() => import('./CartIcon-BnUnDg2e.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderMobileMenuIcon = defineAsyncComponent(() => import('./MobileMenuIcon-BOo8nFrs.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderMyAccountIcon = defineAsyncComponent(() => import('./MyAccountIcon-BH1fNXGS.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderSearch = defineAsyncComponent(() => import('./Search-CjGAmj-r.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderSearchIcon = defineAsyncComponent(() => import('./SearchIcon-BJe8bZvl.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderTopNavigation = defineAsyncComponent(() => import('./TopNavigation-CQHBW2fA.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderTopNavigationSubcategories = defineAsyncComponent(() => import('./TopNavigationSubcategories-bHWMqSJX.mjs').then((r) => r["default"] || r.default || r));
const LazyLayoutHeaderWishlistIcon = defineAsyncComponent(() => import('./WishlistIcon-DEHwQDTQ.mjs').then((r) => r["default"] || r.default || r));
const LazyProductWishlistIcon = defineAsyncComponent(() => import('./WishlistIcon-QPEOmafG.mjs').then((r) => r["default"] || r.default || r));
const LazySearchSuggest = defineAsyncComponent(() => import('./Suggest-Bki7k34l.mjs').then((r) => r["default"] || r.default || r));
const LazySharedCountryStateInput = defineAsyncComponent(() => import('./CountryStateInput-f0sWk9zO.mjs').then((r) => r["default"] || r.default || r));
const LazySharedDataTextRow = defineAsyncComponent(() => import('./DataTextRow-BWtIhzlr.mjs').then((r) => r["default"] || r.default || r));
const LazySharedElementsNavigation = defineAsyncComponent(() => import('./ElementsNavigation-BjU8UuVp.mjs').then((r) => r["default"] || r.default || r));
const LazySharedModal = defineAsyncComponent(() => import('./Modal-Q-hgMrms.mjs').then((r) => r["default"] || r.default || r));
const LazySharedPagination = defineAsyncComponent(() => import('./Pagination-Cue1vOZm.mjs').then((r) => r["default"] || r.default || r));
const LazySharedPrice = defineAsyncComponent(() => import('./Price-D7PucwgC.mjs').then((r) => r["default"] || r.default || r));
const LazySharedSizeSelector = defineAsyncComponent(() => import('./SizeSelector-DQWtP7Lz.mjs').then((r) => r["default"] || r.default || r));
const LazyWishlistProductTile = defineAsyncComponent(() => import('./ProductTile-CWCGbndB.mjs').then((r) => r["default"] || r.default || r));
const LazyWishlistProductTileSkeleton = defineAsyncComponent(() => import('./ProductTileSkeleton-COLf4zLk.mjs').then((r) => r["default"] || r.default || r));
const LazySwBaseButton = defineAsyncComponent(() => import('./BaseButton-D0eElC8N.mjs').then((r) => r["default"] || r.default || r));
const LazySwBaseIcon = defineAsyncComponent(() => import('./BaseIcon-CuUpCLk5.mjs').then((r) => r["default"] || r.default || r));
const LazySwCheckbox = defineAsyncComponent(() => import('./Checkbox-8GjGFXe_.mjs').then((r) => r["default"] || r.default || r));
const LazySwCheckmarkIcon = defineAsyncComponent(() => import('./CheckmarkIcon-C1wz8qX_.mjs').then((r) => r["default"] || r.default || r));
const LazySwChevronIcon = defineAsyncComponent(() => import('./ChevronIcon-Aj1t6zS4.mjs').then((r) => r["default"] || r.default || r));
const LazySwExclamationIcon = defineAsyncComponent(() => import('./ExclamationIcon-Dak5_-Kw.mjs').then((r) => r["default"] || r.default || r));
const LazySwIconButton = defineAsyncComponent(() => import('./IconButton-B9TJf-aJ.mjs').then((r) => r["default"] || r.default || r));
const LazySwRadioButton = defineAsyncComponent(() => import('./RadioButton-DRvWChKx.mjs').then((r) => r["default"] || r.default || r));
const LazySwStarIcon = defineAsyncComponent(() => import('./StarIcon-DB6h1IBB.mjs').then((r) => r["default"] || r.default || r));
const LazySwSwitchButton = defineAsyncComponent(() => import('./SwitchButton-BwRPFSLu.mjs').then((r) => r["default"] || r.default || r));
const LazySwUserIcon = defineAsyncComponent(() => import('./UserIcon-DYcQnG84.mjs').then((r) => r["default"] || r.default || r));
const LazySwWishlistIcon = defineAsyncComponent(() => import('./WishlistIcon-DKydId8L.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockSpatialViewer = defineAsyncComponent(() => import('./CmsBlockSpatialViewer-Dpaj3Qn1.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsGenericBlock = defineAsyncComponent(() => import('./CmsGenericBlock-BOHRhFf-.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsGenericElement = defineAsyncComponent(() => import('./CmsGenericElement-0uMNMOJ4.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsNoComponent = defineAsyncComponent(() => import('./CmsNoComponent-DtIcCCCp.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsPage = defineAsyncComponent(() => import('./CmsPage-FwkThjWd.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockCategoryNavigation = defineAsyncComponent(() => import('./CmsBlockCategoryNavigation-i8rwGd8Z.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockCenterText = defineAsyncComponent(() => import('./CmsBlockCenterText-D2Ydze7Z.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockCrossSelling = defineAsyncComponent(() => import('./CmsBlockCrossSelling-C86VdOc4.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockCustomForm = defineAsyncComponent(() => import('./CmsBlockCustomForm-B1f_8AUj.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockDefault = defineAsyncComponent(() => import('./CmsBlockDefault-CfBEPPAr.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockForm = defineAsyncComponent(() => import('./CmsBlockForm-0-EAbhMv.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockGalleryBuybox = defineAsyncComponent(() => import('./CmsBlockGalleryBuybox-WfsQe-Lf.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockHtml = defineAsyncComponent(() => import('./CmsBlockHtml-QJCbXO76.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImage = defineAsyncComponent(() => import('./CmsBlockImage-Bs-zNcZR.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageBubbleRow = defineAsyncComponent(() => import('./CmsBlockImageBubbleRow-CqYuSkEM.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageCover = defineAsyncComponent(() => import('./CmsBlockImageCover-DKYK330N.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageFourColumn = defineAsyncComponent(() => import('./CmsBlockImageFourColumn-BhcOWI0d.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageGallery = defineAsyncComponent(() => import('./CmsBlockImageGallery-BmvFV3eY.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageGalleryBig = defineAsyncComponent(() => import('./CmsBlockImageGalleryBig-lbSTUjYQ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageHighlightRow = defineAsyncComponent(() => import('./CmsBlockImageHighlightRow-Bg4I89ef.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageSimpleGrid = defineAsyncComponent(() => import('./CmsBlockImageSimpleGrid-DXUBwtvg.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageSlider = defineAsyncComponent(() => import('./CmsBlockImageSlider-DujNs2vJ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageText = defineAsyncComponent(() => import('./CmsBlockImageText-DVyJDTxO.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageTextBubble = defineAsyncComponent(() => import('./CmsBlockImageTextBubble-B8bnSclk.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageTextCover = defineAsyncComponent(() => import('./CmsBlockImageTextCover-2kFYzThm.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageTextGallery = defineAsyncComponent(() => import('./CmsBlockImageTextGallery-DzKqdXeS.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageTextRow = defineAsyncComponent(() => import('./CmsBlockImageTextRow-CJe8ML-F.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageThreeColumn = defineAsyncComponent(() => import('./CmsBlockImageThreeColumn-y1hD9ltk.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageThreeCover = defineAsyncComponent(() => import('./CmsBlockImageThreeCover-D0izWGQZ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockImageTwoColumn = defineAsyncComponent(() => import('./CmsBlockImageTwoColumn-B7HibQY2.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockProductDescriptionReviews = defineAsyncComponent(() => import('./CmsBlockProductDescriptionReviews-DDAJdHZI.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockProductHeading = defineAsyncComponent(() => import('./CmsBlockProductHeading-C4pZhPvN.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockProductListing = defineAsyncComponent(() => import('./CmsBlockProductListing-D5NNuVZZ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockProductSlider = defineAsyncComponent(() => import('./CmsBlockProductSlider-DbWIne0s.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockProductThreeColumn = defineAsyncComponent(() => import('./CmsBlockProductThreeColumn-Bcmzkk5k.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockSidebarFilter = defineAsyncComponent(() => import('./CmsBlockSidebarFilter-pc_BWoeC.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockText = defineAsyncComponent(() => import('./CmsBlockText-DRZo5zwg.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextHero = defineAsyncComponent(() => import('./CmsBlockTextHero-BfXPZ3eZ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextOnImage = defineAsyncComponent(() => import('./CmsBlockTextOnImage-njPrzKBA.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextTeaser = defineAsyncComponent(() => import('./CmsBlockTextTeaser-SZPnRWXk.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextTeaserSection = defineAsyncComponent(() => import('./CmsBlockTextTeaserSection-CAmxfep4.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextThreeColumn = defineAsyncComponent(() => import('./CmsBlockTextThreeColumn-Bvd_7LcE.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockTextTwoColumn = defineAsyncComponent(() => import('./CmsBlockTextTwoColumn-D57mTzva.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockVimeoVideo = defineAsyncComponent(() => import('./CmsBlockVimeoVideo-B54ueGSM.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsBlockYoutubeVideo = defineAsyncComponent(() => import('./CmsBlockYoutubeVideo-aMOBmKUP.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementBuyBox = defineAsyncComponent(() => import('./CmsElementBuyBox-BZNaTEJP.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementCategoryNavigation = defineAsyncComponent(() => import('./CmsElementCategoryNavigation-B6XTWQMf.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementCrossSelling = defineAsyncComponent(() => import('./CmsElementCrossSelling-C1q3bnnr.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementCustomForm = defineAsyncComponent(() => import('./CmsElementCustomForm-U5em83zt.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementForm = defineAsyncComponent(() => import('./CmsElementForm-HZ9hg3JL.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementHtml = defineAsyncComponent(() => import('./CmsElementHtml-Bl0IvSX3.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementImage = defineAsyncComponent(() => import('./CmsElementImage-BpNT58Zk.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementImageGallery = defineAsyncComponent(() => import('./CmsElementImageGallery-DeIRHxqJ.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementImageGallery3dPlaceholder = defineAsyncComponent(() => import('./CmsElementImageGallery3dPlaceholder-oJCEVX_7.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementImageSlider = defineAsyncComponent(() => import('./CmsElementImageSlider-4Crd4RiU.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementManufacturerLogo = defineAsyncComponent(() => import('./CmsElementManufacturerLogo-DlgHSl1h.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementProductBox = defineAsyncComponent(() => import('./CmsElementProductBox-DkzfZvj3.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementProductListing = defineAsyncComponent(() => import('./CmsElementProductListing-DlitF-Ti.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementProductName = defineAsyncComponent(() => import('./CmsElementProductName-C49SJmwo.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementProductSlider = defineAsyncComponent(() => import('./CmsElementProductSlider-BUKfTOzw.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementSidebarFilter = defineAsyncComponent(() => import('./CmsElementSidebarFilter-BpXhNfQ5.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementText = defineAsyncComponent(() => import('./CmsElementText-CnAlO-WO.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementVimeoVideo = defineAsyncComponent(() => import('./CmsElementVimeoVideo-QvfMzjiM.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsElementYoutubeVideo = defineAsyncComponent(() => import('./CmsElementYoutubeVideo-DFOoB_5g.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductListingPagination = defineAsyncComponent(() => import('./SwProductListingPagination-toQenkp-.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsSectionDefault = defineAsyncComponent(() => import('./CmsSectionDefault-DiAEcceW.mjs').then((r) => r["default"] || r.default || r));
const LazyCmsSectionSidebar = defineAsyncComponent(() => import('./CmsSectionSidebar-L7Ch0mYU.mjs').then((r) => r["default"] || r.default || r));
const LazyProductCardSkeleton = defineAsyncComponent(() => import('./ProductCardSkeleton-BXswqGML.mjs').then((r) => r["default"] || r.default || r));
const LazySwCategoryNavigation = defineAsyncComponent(() => import('./SwCategoryNavigation-BYH5vy37.mjs').then((r) => r["default"] || r.default || r));
const LazySwCategoryNavigationLink = defineAsyncComponent(() => import('./SwCategoryNavigationLink-BU65EIA1.mjs').then((r) => r["default"] || r.default || r));
const LazySwContactForm = defineAsyncComponent(() => import('./SwContactForm-Dvw--d2j.mjs').then((r) => r["default"] || r.default || r));
const LazySwFilterChips = defineAsyncComponent(() => import('./SwFilterChips-BkykUXAw.mjs').then((r) => r["default"] || r.default || r));
const LazySwFilterDropdown = defineAsyncComponent(() => import('./SwFilterDropdown-C60wMOfB.mjs').then((r) => r["default"] || r.default || r));
const LazySwListingProductPrice = defineAsyncComponent(() => import('./SwListingProductPrice-uLKvwDX7.mjs').then((r) => r["default"] || r.default || r));
const LazySwNewsletterForm = defineAsyncComponent(() => import('./SwNewsletterForm-dY-hOseB.mjs').then((r) => r["default"] || r.default || r));
const LazySwPagination = defineAsyncComponent(() => import('./SwPagination-f5VMphAR.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductAddToCart = defineAsyncComponent(() => import('./SwProductAddToCart-DhG5_cJm.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductCard = defineAsyncComponent(() => import('./SwProductCard-BA76azQz.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductCardDetails = defineAsyncComponent(() => import('./SwProductCardDetails-BWTz-xFm.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductCardImage = defineAsyncComponent(() => import('./SwProductCardImage-DdEndLgG.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductCardSkeleton = defineAsyncComponent(() => import('./SwProductCardSkeleton-DYKDZIx0.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductGallery = defineAsyncComponent(() => import('./SwProductGallery-BruycCd8.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductListingFilter = defineAsyncComponent(() => import('./SwProductListingFilter-BBWYHPB5.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductListingFilters = defineAsyncComponent(() => import('./SwProductListingFilters-CfTWGHyq.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductListingFiltersHorizontal = defineAsyncComponent(() => import('./SwProductListingFiltersHorizontal-BJb1X7QR.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductPrice = defineAsyncComponent(() => import('./SwProductPrice-aMIByQcB.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductRating = defineAsyncComponent(() => import('./SwProductRating-CCZ84wsh.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductReviews = defineAsyncComponent(() => import('./SwProductReviews-DeFX_uTn.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductReviewsForm = defineAsyncComponent(() => import('./SwProductReviewsForm-EV-GDa5Y.mjs').then((r) => r["default"] || r.default || r));
const LazySwProductUnits = defineAsyncComponent(() => import('./SwProductUnits-coeEiUsW.mjs').then((r) => r["default"] || r.default || r));
const LazySwQuantitySelect = defineAsyncComponent(() => import('./SwQuantitySelect-0TylgMz1.mjs').then((r) => r["default"] || r.default || r));
const LazySwSharedPrice = defineAsyncComponent(() => import('./SwSharedPrice-DrqxF5OW.mjs').then((r) => r["default"] || r.default || r));
const LazySwSlider = defineAsyncComponent(() => import('./SwSlider-CN4jIJjs.mjs').then((r) => r["default"] || r.default || r));
const LazySwSortDropdown = defineAsyncComponent(() => import('./SwSortDropdown-Bbvi3pDB.mjs').then((r) => r["default"] || r.default || r));
const LazySwStockInfo = defineAsyncComponent(() => import('./SwStockInfo-DAPML143.mjs').then((r) => r["default"] || r.default || r));
const LazySwVariantConfigurator = defineAsyncComponent(() => import('./SwVariantConfigurator-Cjm5WRIH.mjs').then((r) => r["default"] || r.default || r));
const LazyIcon = defineAsyncComponent(() => import('./index-DKA3nfTy.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["FrontendDetailPage", LazyFrontendDetailPage],
  ["AccountTabAdresy", LazyAccountTabAdresy],
  ["AccountTabObjednavky", LazyAccountTabObjednavky],
  ["AccountTabOblubene", LazyAccountTabOblubene],
  ["AccountTabPorovnania", LazyAccountTabPorovnania],
  ["AccountTabPrehled", LazyAccountTabPrehled],
  ["AccountTabProfil", LazyAccountTabProfil],
  ["AccountTabReklamacie", LazyAccountTabReklamacie],
  ["AccountTabSledovanie", LazyAccountTabSledovanie],
  ["AccountTabUlozenKosik", LazyAccountTabUlozenKosik],
  ["AccountTabVernostne", LazyAccountTabVernostne],
  ["BiometricLogin", LazyBiometricLogin],
  ["BiometricSetup", LazyBiometricSetup],
  ["ForgotPasswordForm", LazyForgotPasswordForm],
  ["LoginForm", LazyLoginForm],
  ["PasskeyManager", LazyPasskeyManager],
  ["RegisterForm", LazyRegisterForm],
  ["SocialLoginButtons", LazySocialLoginButtons],
  ["CartAdvisor", LazyCartAdvisor],
  ["CartCrossSellPanel", LazyCartCrossSellPanel],
  ["CartEmptyState", LazyCartEmptyState],
  ["CartFooter", LazyCartFooter],
  ["CartHeader", LazyCartHeader],
  ["CartItem", LazyCartItem],
  ["CartShippingBar", LazyCartShippingBar],
  ["CartSidebar", LazyCartSidebar],
  ["SaveCart", LazySaveCart],
  ["ShareCart", LazyShareCart],
  ["CartReviewStep", LazyCartReviewStep],
  ["CheckoutSteps", LazyCheckoutSteps],
  ["DeliveryStep", LazyDeliveryStep],
  ["OrderSummary", LazyOrderSummary],
  ["PaymentStep", LazyPaymentStep],
  ["PersonalInfoStep", LazyPersonalInfoStep],
  ["ShippingPaymentStep", LazyShippingPaymentStep],
  ["SpsPickupPointPicker", LazySpsPickupPointPicker],
  ["SuccessStep", LazySuccessStep],
  ["OffcanvasFilter", LazyOffcanvasFilter],
  ["ProductFilters", LazyProductFilters],
  ["StickyToolbar", LazyStickyToolbar],
  ["ChatBot", LazyChatBot],
  ["ChatProductCard", LazyChatProductCard],
  ["CmsHeroSlider", LazyCmsHeroSlider],
  ["StaticPage", LazyStaticPage],
  ["FrontendNavigationPage", LazyFrontendNavigationPage],
  ["ProductCard", LazyProductCard],
  ["AkciaCarousel", LazyAkciaCarousel],
  ["BlogGrid", LazyBlogGrid],
  ["CategoryGrid", LazyCategoryGrid],
  ["CategoryHeroSlider", LazyCategoryHeroSlider],
  ["FeaturedCollection", LazyFeaturedCollection],
  ["Features", LazyFeatures],
  ["HeroSlider", LazyHeroSlider],
  ["HomeBlogSection", LazyHomeBlogSection],
  ["NewProducts", LazyNewProducts],
  ["Newsletter", LazyNewsletter],
  ["RecommendedProducts", LazyRecommendedProducts],
  ["ReviewsWall", LazyReviewsWall],
  ["RideStyles", LazyRideStyles],
  ["Znacky", LazyZnacky],
  ["Footer", LazyFooter],
  ["MobileBottomNav", LazyMobileBottomNav],
  ["Navbar", LazyNavbar],
  ["CountrySwitcher", LazyCountrySwitcher],
  ["DesktopNav", LazyDesktopNav],
  ["Logo", LazyLogo],
  ["MegaMenu", LazyMegaMenu],
  ["MobileMenu", LazyMobileMenu],
  ["MobileSearchOverlay", LazyMobileSearchOverlay],
  ["NavIcons", LazyNavIcons],
  ["SearchBar", LazySearchBar],
  ["TopBar", LazyTopBar],
  ["SearchDropdown", LazySearchDropdown],
  ["SearchDropdownEmpty", LazySearchDropdownEmpty],
  ["SearchDropdownResults", LazySearchDropdownResults],
  ["SearchInput", LazySearchInput],
  ["ComparisonModal", LazyComparisonModal],
  ["ManufacturerInfo", LazyManufacturerInfo],
  ["PriceOfferModal", LazyPriceOfferModal],
  ["ProductCardMini", LazyProductCardMini],
  ["ProductDetail", LazyProductDetail],
  ["ProductDetailSkeleton", LazyProductDetailSkeleton],
  ["ProductGallery", LazyProductGallery],
  ["ProductInfo", LazyProductInfo],
  ["ProductQA", LazyProductQA],
  ["ProductReviewForm", LazyProductReviewForm],
  ["ProductReviewsSection", LazyProductReviewsSection],
  ["ProductStickyBar", LazyProductStickyBar],
  ["ProductTabs", LazyProductTabs],
  ["ShareProduct", LazyShareProduct],
  ["SupportPanel", LazySupportPanel],
  ["TrustBadges", LazyTrustBadges],
  ["VariantSelector", LazyVariantSelector],
  ["WatchdogModal", LazyWatchdogModal],
  ["DescriptionTab", LazyDescriptionTab],
  ["DistributorTab", LazyDistributorTab],
  ["DownloadsTab", LazyDownloadsTab],
  ["ReviewsTab", LazyReviewsTab],
  ["SpecsTab", LazySpecsTab],
  ["CmsElementCenterText", LazyCmsElementCenterText],
  ["CmsElementProductDescriptionReviews", LazyCmsElementProductDescriptionReviews],
  ["CmsElementTextHero", LazyCmsElementTextHero],
  ["ReturnFormModal", LazyReturnFormModal],
  ["ReturnFormStep1", LazyReturnFormStep1],
  ["ReturnFormStep2", LazyReturnFormStep2],
  ["ReturnFormStep3", LazyReturnFormStep3],
  ["ReturnFormSuccess", LazyReturnFormSuccess],
  ["AddToCartButton", LazyAddToCartButton],
  ["AppHoneypot", LazyAppHoneypot],
  ["AppModal", LazyAppModal],
  ["BackendErrorState", LazyBackendErrorState],
  ["BaseButton", LazyBaseButton],
  ["BaseLink", LazyBaseLink],
  ["BaseStockStatus", LazyBaseStockStatus],
  ["ComparisonToast", LazyComparisonToast],
  ["QuantitySelector", LazyQuantitySelector],
  ["QuickViewModal", LazyQuickViewModal],
  ["RatingStars", LazyRatingStars],
  ["ScrollToTop", LazyScrollToTop],
  ["SizeChartModal", LazySizeChartModal],
  ["WishlistToast", LazyWishlistToast],
  ["FrontendAccountCustomerGroupRegistrationPage", LazyFrontendAccountCustomerGroupRegistrationPage],
  ["FrontendLandingPage", LazyFrontendLandingPage],
  ["AccountActionLink", LazyAccountActionLink],
  ["AccountLoginForm", LazyAccountLoginForm],
  ["AccountNewsletterSection", LazyAccountNewsletterSection],
  ["AccountPageHeader", LazyAccountPageHeader],
  ["AccountRegistrationForm", LazyAccountRegistrationForm],
  ["AccountSectionHeader", LazyAccountSectionHeader],
  ["AccountAddressDataSection", LazyAccountAddressDataSection],
  ["AccountAddressDeleteButton", LazyAccountAddressDeleteButton],
  ["AccountAddressEditButton", LazyAccountAddressEditButton],
  ["AccountAddressForm", LazyAccountAddressForm],
  ["AccountAddressTile", LazyAccountAddressTile],
  ["AccountMenuElement", LazyAccountMenuElement],
  ["AccountMenuList", LazyAccountMenuList],
  ["AccountOrderDetails", LazyAccountOrderDetails],
  ["AccountOrderDownloads", LazyAccountOrderDownloads],
  ["AccountOrderLine", LazyAccountOrderLine],
  ["AccountOrderLineData", LazyAccountOrderLineData],
  ["AccountOrderLineItem", LazyAccountOrderLineItem],
  ["AccountOrderLineItemCredit", LazyAccountOrderLineItemCredit],
  ["AccountOrderLineItemCustom", LazyAccountOrderLineItemCustom],
  ["AccountOrderLineItemProduct", LazyAccountOrderLineItemProduct],
  ["AccountOrderLineItemPromotion", LazyAccountOrderLineItemPromotion],
  ["AccountOrderProduct", LazyAccountOrderProduct],
  ["AccountOrderStatus", LazyAccountOrderStatus],
  ["AccountOrderSummary", LazyAccountOrderSummary],
  ["AccountPersonalDataForm", LazyAccountPersonalDataForm],
  ["AccountPersonalDataSection", LazyAccountPersonalDataSection],
  ["AccountPersonalLoginData", LazyAccountPersonalLoginData],
  ["CheckoutCustomerAddress", LazyCheckoutCustomerAddress],
  ["CheckoutCustomerAddressChosen", LazyCheckoutCustomerAddressChosen],
  ["CheckoutCustomerBaseInfo", LazyCheckoutCustomerBaseInfo],
  ["CheckoutPaymentMethods", LazyCheckoutPaymentMethods],
  ["CheckoutProductTile", LazyCheckoutProductTile],
  ["CheckoutShippingMethods", LazyCheckoutShippingMethods],
  ["CheckoutStepHeader", LazyCheckoutStepHeader],
  ["CheckoutSummaryBox", LazyCheckoutSummaryBox],
  ["FormAccountTypeSelect", LazyFormAccountTypeSelect],
  ["FormBaseButton", LazyFormBaseButton],
  ["FormBaseDropdown", LazyFormBaseDropdown],
  ["FormBaseInput", LazyFormBaseInput],
  ["FormCheckbox", LazyFormCheckbox],
  ["FormDropdownField", LazyFormDropdownField],
  ["FormIconButton", LazyFormIconButton],
  ["FormInputField", LazyFormInputField],
  ["FormLinkButton", LazyFormLinkButton],
  ["FormQuantitySelect", LazyFormQuantitySelect],
  ["FormRadioButton", LazyFormRadioButton],
  ["FormSalutationSelect", LazyFormSalutationSelect],
  ["LayoutAccountMenu", LazyLayoutAccountMenu],
  ["LayoutFooter", LazyLayoutFooter],
  ["LayoutHeader", LazyLayoutHeader],
  ["LayoutMainBadge", LazyLayoutMainBadge],
  ["LayoutMainCounter", LazyLayoutMainCounter],
  ["LayoutMetaNavigation", LazyLayoutMetaNavigation],
  ["LayoutMiniCart", LazyLayoutMiniCart],
  ["LayoutNotification", LazyLayoutNotification],
  ["LayoutNotifications", LazyLayoutNotifications],
  ["LayoutSideMenu", LazyLayoutSideMenu],
  ["LayoutSidebar", LazyLayoutSidebar],
  ["LayoutBreadcrumbsDivider", LazyLayoutBreadcrumbsDivider],
  ["LayoutBreadcrumbsElement", LazyLayoutBreadcrumbsElement],
  ["LayoutBreadcrumbs", LazyLayoutBreadcrumbs],
  ["LayoutFooterNewsletterBox", LazyLayoutFooterNewsletterBox],
  ["LayoutHeaderCartIcon", LazyLayoutHeaderCartIcon],
  ["LayoutHeaderMobileMenuIcon", LazyLayoutHeaderMobileMenuIcon],
  ["LayoutHeaderMyAccountIcon", LazyLayoutHeaderMyAccountIcon],
  ["LayoutHeaderSearch", LazyLayoutHeaderSearch],
  ["LayoutHeaderSearchIcon", LazyLayoutHeaderSearchIcon],
  ["LayoutHeaderTopNavigation", LazyLayoutHeaderTopNavigation],
  ["LayoutHeaderTopNavigationSubcategories", LazyLayoutHeaderTopNavigationSubcategories],
  ["LayoutHeaderWishlistIcon", LazyLayoutHeaderWishlistIcon],
  ["ProductWishlistIcon", LazyProductWishlistIcon],
  ["SearchSuggest", LazySearchSuggest],
  ["SharedCountryStateInput", LazySharedCountryStateInput],
  ["SharedDataTextRow", LazySharedDataTextRow],
  ["SharedElementsNavigation", LazySharedElementsNavigation],
  ["SharedModal", LazySharedModal],
  ["SharedPagination", LazySharedPagination],
  ["SharedPrice", LazySharedPrice],
  ["SharedSizeSelector", LazySharedSizeSelector],
  ["WishlistProductTile", LazyWishlistProductTile],
  ["WishlistProductTileSkeleton", LazyWishlistProductTileSkeleton],
  ["SwBaseButton", LazySwBaseButton],
  ["SwBaseIcon", LazySwBaseIcon],
  ["SwCheckbox", LazySwCheckbox],
  ["SwCheckmarkIcon", LazySwCheckmarkIcon],
  ["SwChevronIcon", LazySwChevronIcon],
  ["SwExclamationIcon", LazySwExclamationIcon],
  ["SwIconButton", LazySwIconButton],
  ["SwRadioButton", LazySwRadioButton],
  ["SwStarIcon", LazySwStarIcon],
  ["SwSwitchButton", LazySwSwitchButton],
  ["SwUserIcon", LazySwUserIcon],
  ["SwWishlistIcon", LazySwWishlistIcon],
  ["CmsBlockSpatialViewer", LazyCmsBlockSpatialViewer],
  ["CmsGenericBlock", LazyCmsGenericBlock],
  ["CmsGenericElement", LazyCmsGenericElement],
  ["CmsNoComponent", LazyCmsNoComponent],
  ["CmsPage", LazyCmsPage],
  ["CmsBlockCategoryNavigation", LazyCmsBlockCategoryNavigation],
  ["CmsBlockCenterText", LazyCmsBlockCenterText],
  ["CmsBlockCrossSelling", LazyCmsBlockCrossSelling],
  ["CmsBlockCustomForm", LazyCmsBlockCustomForm],
  ["CmsBlockDefault", LazyCmsBlockDefault],
  ["CmsBlockForm", LazyCmsBlockForm],
  ["CmsBlockGalleryBuybox", LazyCmsBlockGalleryBuybox],
  ["CmsBlockHtml", LazyCmsBlockHtml],
  ["CmsBlockImage", LazyCmsBlockImage],
  ["CmsBlockImageBubbleRow", LazyCmsBlockImageBubbleRow],
  ["CmsBlockImageCover", LazyCmsBlockImageCover],
  ["CmsBlockImageFourColumn", LazyCmsBlockImageFourColumn],
  ["CmsBlockImageGallery", LazyCmsBlockImageGallery],
  ["CmsBlockImageGalleryBig", LazyCmsBlockImageGalleryBig],
  ["CmsBlockImageHighlightRow", LazyCmsBlockImageHighlightRow],
  ["CmsBlockImageSimpleGrid", LazyCmsBlockImageSimpleGrid],
  ["CmsBlockImageSlider", LazyCmsBlockImageSlider],
  ["CmsBlockImageText", LazyCmsBlockImageText],
  ["CmsBlockImageTextBubble", LazyCmsBlockImageTextBubble],
  ["CmsBlockImageTextCover", LazyCmsBlockImageTextCover],
  ["CmsBlockImageTextGallery", LazyCmsBlockImageTextGallery],
  ["CmsBlockImageTextRow", LazyCmsBlockImageTextRow],
  ["CmsBlockImageThreeColumn", LazyCmsBlockImageThreeColumn],
  ["CmsBlockImageThreeCover", LazyCmsBlockImageThreeCover],
  ["CmsBlockImageTwoColumn", LazyCmsBlockImageTwoColumn],
  ["CmsBlockProductDescriptionReviews", LazyCmsBlockProductDescriptionReviews],
  ["CmsBlockProductHeading", LazyCmsBlockProductHeading],
  ["CmsBlockProductListing", LazyCmsBlockProductListing],
  ["CmsBlockProductSlider", LazyCmsBlockProductSlider],
  ["CmsBlockProductThreeColumn", LazyCmsBlockProductThreeColumn],
  ["CmsBlockSidebarFilter", LazyCmsBlockSidebarFilter],
  ["CmsBlockText", LazyCmsBlockText],
  ["CmsBlockTextHero", LazyCmsBlockTextHero],
  ["CmsBlockTextOnImage", LazyCmsBlockTextOnImage],
  ["CmsBlockTextTeaser", LazyCmsBlockTextTeaser],
  ["CmsBlockTextTeaserSection", LazyCmsBlockTextTeaserSection],
  ["CmsBlockTextThreeColumn", LazyCmsBlockTextThreeColumn],
  ["CmsBlockTextTwoColumn", LazyCmsBlockTextTwoColumn],
  ["CmsBlockVimeoVideo", LazyCmsBlockVimeoVideo],
  ["CmsBlockYoutubeVideo", LazyCmsBlockYoutubeVideo],
  ["CmsElementBuyBox", LazyCmsElementBuyBox],
  ["CmsElementCategoryNavigation", LazyCmsElementCategoryNavigation],
  ["CmsElementCrossSelling", LazyCmsElementCrossSelling],
  ["CmsElementCustomForm", LazyCmsElementCustomForm],
  ["CmsElementForm", LazyCmsElementForm],
  ["CmsElementHtml", LazyCmsElementHtml],
  ["CmsElementImage", LazyCmsElementImage],
  ["CmsElementImageGallery", LazyCmsElementImageGallery],
  ["CmsElementImageGallery3dPlaceholder", LazyCmsElementImageGallery3dPlaceholder],
  ["CmsElementImageSlider", LazyCmsElementImageSlider],
  ["CmsElementManufacturerLogo", LazyCmsElementManufacturerLogo],
  ["CmsElementProductBox", LazyCmsElementProductBox],
  ["CmsElementProductListing", LazyCmsElementProductListing],
  ["CmsElementProductName", LazyCmsElementProductName],
  ["CmsElementProductSlider", LazyCmsElementProductSlider],
  ["CmsElementSidebarFilter", LazyCmsElementSidebarFilter],
  ["CmsElementText", LazyCmsElementText],
  ["CmsElementVimeoVideo", LazyCmsElementVimeoVideo],
  ["CmsElementYoutubeVideo", LazyCmsElementYoutubeVideo],
  ["SwProductListingPagination", LazySwProductListingPagination],
  ["CmsSectionDefault", LazyCmsSectionDefault],
  ["CmsSectionSidebar", LazyCmsSectionSidebar],
  ["ProductCardSkeleton", LazyProductCardSkeleton],
  ["SwCategoryNavigation", LazySwCategoryNavigation],
  ["SwCategoryNavigationLink", LazySwCategoryNavigationLink],
  ["SwContactForm", LazySwContactForm],
  ["SwFilterChips", LazySwFilterChips],
  ["SwFilterDropdown", LazySwFilterDropdown],
  ["SwListingProductPrice", LazySwListingProductPrice],
  ["SwNewsletterForm", LazySwNewsletterForm],
  ["SwPagination", LazySwPagination],
  ["SwProductAddToCart", LazySwProductAddToCart],
  ["SwProductCard", LazySwProductCard],
  ["SwProductCardDetails", LazySwProductCardDetails],
  ["SwProductCardImage", LazySwProductCardImage],
  ["SwProductCardSkeleton", LazySwProductCardSkeleton],
  ["SwProductGallery", LazySwProductGallery],
  ["SwProductListingFilter", LazySwProductListingFilter],
  ["SwProductListingFilters", LazySwProductListingFilters],
  ["SwProductListingFiltersHorizontal", LazySwProductListingFiltersHorizontal],
  ["SwProductPrice", LazySwProductPrice],
  ["SwProductRating", LazySwProductRating],
  ["SwProductReviews", LazySwProductReviews],
  ["SwProductReviewsForm", LazySwProductReviewsForm],
  ["SwProductUnits", LazySwProductUnits],
  ["SwQuantitySelect", LazySwQuantitySelect],
  ["SwSharedPrice", LazySwSharedPrice],
  ["SwSlider", LazySwSlider],
  ["SwSortDropdown", LazySwSortDropdown],
  ["SwStockInfo", LazySwStockInfo],
  ["SwVariantConfigurator", LazySwVariantConfigurator],
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const css = `@font-face { font-family: "Space Grotesk fallback"; src: local("Segoe UI"); size-adjust: 110.2943%; ascent-override: 89.2159%; descent-override: 26.4746%; line-gap-override: 0%; } @font-face { font-family: "Space Grotesk fallback"; src: local("Roboto"); size-adjust: 109.9311%; ascent-override: 89.5106%; descent-override: 26.5621%; line-gap-override: 0%; } @font-face { font-family: "Space Grotesk fallback"; src: local("Helvetica Neue"); size-adjust: 108.6667%; ascent-override: 90.5521%; descent-override: 26.8712%; line-gap-override: 0%; } @font-face { font-family: "Space Grotesk fallback"; src: local("Arial"); size-adjust: 109.6903%; ascent-override: 89.7072%; descent-override: 26.6204%; line-gap-override: 0%; } @font-face { font-family: "Space Grotesk fallback"; src: local("Noto Sans"); size-adjust: 103.1646%; ascent-override: 95.3816%; descent-override: 28.3043%; line-gap-override: 0%; } `;
const font_fallback_inlining_plugin_server_Ws81Prt9Nl2CWJJFHbFcLowVk4saho6ynWp0RZ6s4Bs = /* @__PURE__ */ defineNuxtPlugin(() => {
  useHead({ style: [{ innerHTML: css + ` ` }] });
});
const plugin_c515ayiLuocRMvhGInzV4Ci6HK9AGMOPyzAKHLWV3Qg = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
function warn(msg, err) {
}
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
  return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const javascriptSchemePattern = /^\s*javascript\s*(?::|&#0*58;?|&#x0*3a;?|&colon;?)/i;
const urlAttributePattern = /^(?:href|src|action|formaction)$/i;
function hasJavascriptScheme(value) {
  return javascriptSchemePattern.test(value);
}
function sanitizeStyleValue(value) {
  const urlPattern = /url\s*\(/gi;
  let sanitized = "";
  let cursor = 0;
  let match;
  while ((match = urlPattern.exec(value)) !== null) {
    const urlStart = match.index;
    const openParenIndex = urlPattern.lastIndex - 1;
    let index = openParenIndex + 1;
    let depth = 1;
    let quote = null;
    for (; index < value.length; index++) {
      const char = value[index];
      if (quote) {
        if (char === quote) {
          quote = null;
        }
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
      } else if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          break;
        }
      }
    }
    if (depth !== 0) {
      break;
    }
    const rawUrlValue = value.slice(openParenIndex + 1, index).trim();
    const unquotedUrlValue = rawUrlValue.startsWith('"') && rawUrlValue.endsWith('"') || rawUrlValue.startsWith("'") && rawUrlValue.endsWith("'") ? rawUrlValue.slice(1, -1).trim() : rawUrlValue;
    sanitized += value.slice(cursor, urlStart);
    sanitized += hasJavascriptScheme(unquotedUrlValue) ? "url(about:blank)" : value.slice(urlStart, index + 1);
    cursor = index + 1;
  }
  return sanitized + value.slice(cursor);
}
function sanitizeAttributeValue(attrName, value) {
  if (urlAttributePattern.test(attrName) && hasJavascriptScheme(value)) {
    return "about:blank";
  }
  const sanitizedValue = attrName.toLowerCase() === "style" ? sanitizeStyleValue(value) : value;
  return escapeAttributeValue(sanitizedValue);
}
function sanitizeTranslatedHtml(html) {
  html = html.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${sanitizeAttributeValue(attrName, attrValue)}"`);
  html = html.replace(/([\w:-]+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${sanitizeAttributeValue(attrName, attrValue)}'`);
  const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
  if (eventHandlerPattern.test(html)) {
    html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
  }
  html = html.replace(/(\s+(?:href|src|action|formaction)\s*=\s*)([^\s"'=<>`]+)/gi, (match, prefix, attrValue) => hasJavascriptScheme(attrValue) ? `${prefix}about:blank` : match);
  return html;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator2 = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator2 + item, "");
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject$1(src2[key]) && !isObject$1(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
function localeHead$1(options, currentLanguage = options.getCurrentLanguage(), currentDirection = options.getCurrentDirection()) {
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  if (options.dir) {
    metaObject.htmlAttrs.dir = currentDirection;
  }
  if (options.lang && currentLanguage) {
    metaObject.htmlAttrs.lang = currentLanguage;
  }
  if (options.seo) {
    const alternateLinks = getHreflangLinks(options);
    metaObject.link = metaObject.link.concat(
      alternateLinks,
      getCanonicalLink(options)
    );
    metaObject.meta = metaObject.meta.concat(
      getOgUrl(options),
      getCurrentOgLocale(options),
      getAlternateOgLocales(
        options,
        options.locales.map((x) => x.language || x.code)
      )
    );
  }
  return metaObject;
}
function createLocaleMap(locales) {
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (!locale.language) {
      continue;
    }
    const [language, region] = locale.language.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(locale.language, locale);
  }
  return localeMap;
}
function getHreflangLinks(options) {
  if (!options.hreflangLinks) {
    return [];
  }
  const links = [];
  const localeMap = createLocaleMap(options.locales);
  for (const [language, locale] of localeMap.entries()) {
    const link = getHreflangLink(language, locale, options);
    if (!link) {
      continue;
    }
    links.push(link);
    if (options.defaultLocale && options.defaultLocale === locale.code && links[0].hreflang !== "x-default") {
      links.unshift(
        { [options.key]: "i18n-xd", rel: "alternate", href: link.href, hreflang: "x-default" }
      );
    }
  }
  return links;
}
function getHreflangLink(language, locale, options, routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0) {
  const localePath2 = options.getLocalizedRoute(locale.code, routeWithoutQuery);
  if (!localePath2) {
    return void 0;
  }
  const href = withQuery(
    hasProtocol(localePath2) ? localePath2 : joinURL(options.baseUrl, localePath2),
    options.strictCanonicals ? getCanonicalQueryParams(options) : {}
  );
  return { [options.key]: `i18n-alt-${language}`, rel: "alternate", href, hreflang: language };
}
function getCanonicalUrl(options, route = options.getCurrentRoute()) {
  const currentRoute = options.getLocaleRoute(
    Object.assign({}, route, { path: void 0, name: options.getRouteBaseName(route) })
  );
  if (!currentRoute) {
    return "";
  }
  return withQuery(joinURL(options.baseUrl, currentRoute.path), getCanonicalQueryParams(options));
}
function getCanonicalLink(options, href = getCanonicalUrl(options)) {
  if (!href) {
    return [];
  }
  return [{ [options.key]: "i18n-can", rel: "canonical", href }];
}
function getCanonicalQueryParams(options, route = options.getCurrentRoute()) {
  const currentRoute = options.getLocaleRoute(
    Object.assign({}, route, { path: void 0, name: options.getRouteBaseName(route) })
  );
  const currentRouteQuery = currentRoute?.query ?? {};
  const params = {};
  for (const param of options.canonicalQueries.filter((x) => x in currentRouteQuery)) {
    params[param] ??= [];
    for (const val of toArray$2(currentRouteQuery[param])) {
      params[param].push(val || "");
    }
  }
  return params;
}
function getOgUrl(options, href = getCanonicalUrl(options)) {
  if (!href) {
    return [];
  }
  return [
    { [options.key]: "i18n-og-url", property: "og:url", content: href }
  ];
}
function getCurrentOgLocale(options, currentLanguage = options.getCurrentLanguage()) {
  if (!currentLanguage) {
    return [];
  }
  return [
    { [options.key]: "i18n-og", property: "og:locale", content: formatOgLanguage(currentLanguage) }
  ];
}
function getAlternateOgLocales(options, languages, currentLanguage = options.getCurrentLanguage()) {
  const alternateLocales = languages.filter((locale) => locale && locale !== currentLanguage);
  return alternateLocales.map(
    (locale) => ({
      [options.key]: `i18n-og-alt-${locale}`,
      property: "og:locale:alternate",
      content: formatOgLanguage(locale)
    })
  );
}
function formatOgLanguage(val = "") {
  return val.replace(/-/g, "_");
}
function toArray$2(value) {
  return Array.isArray(value) ? value : [value];
}
function localePath(ctx, route, locale = ctx.getLocale()) {
  if (isString(route) && hasProtocol(route, { acceptRelative: true })) {
    return route;
  }
  try {
    return resolveRoute(ctx, route, locale).fullPath;
  } catch {
    return "";
  }
}
function localeRoute(ctx, route, locale = ctx.getLocale()) {
  try {
    return resolveRoute(ctx, route, locale);
  } catch {
    return;
  }
}
function normalizeRawLocation(route) {
  if (!isString(route)) {
    return assign({}, route);
  }
  if (route[0] === "/") {
    const { pathname: path, search, hash } = parsePath(route);
    return { path, query: parseQuery(search), hash };
  }
  return { name: route };
}
function resolveRoute(ctx, route, locale) {
  const normalized = normalizeRawLocation(route);
  const resolved = ctx.router.resolve(ctx.resolveLocalizedRouteObject(normalized, locale));
  if (resolved.name) {
    return resolved;
  }
  return ctx.router.resolve(route);
}
function switchLocalePath(ctx, locale, route = ctx.router.currentRoute.value) {
  const name = ctx.getRouteBaseName(route);
  if (!name) {
    return "";
  }
  const routeCopy = {
    name,
    params: assign({}, route.params, ctx.getLocalizedDynamicParams(locale)),
    fullPath: route.fullPath,
    query: route.query,
    hash: route.hash,
    path: route.path,
    meta: route.meta
  };
  const path = localePath(ctx, routeCopy, locale);
  return ctx.afterSwitchLocalePath(path, locale);
}
function createHeadContext(ctx, config, locale = ctx.getLocale(), locales = ctx.getLocales(), baseUrl = ctx.getBaseUrl()) {
  const currentLocale = locales.find((l) => l.code === locale) || {};
  const canonicalQueries = typeof config.seo === "object" && config.seo?.canonicalQueries || [];
  return {
    ...config,
    key: "id",
    locales,
    baseUrl,
    canonicalQueries,
    hreflangLinks: ctx.routingOptions.hreflangLinks,
    defaultLocale: ctx.routingOptions.defaultLocale,
    strictCanonicals: ctx.routingOptions.strictCanonicals,
    getRouteBaseName: ctx.getRouteBaseName,
    getCurrentRoute: () => ctx.router.currentRoute.value,
    getCurrentLanguage: () => currentLocale.language,
    getCurrentDirection: () => currentLocale.dir || "ltr",
    getLocaleRoute: (route) => localeRoute(ctx, route),
    getLocalizedRoute: (locale2, route) => switchLocalePath(ctx, locale2, route),
    getRouteWithoutQuery: () => {
      try {
        return assign({}, ctx.router.resolve({ query: {} }), { meta: ctx.router.currentRoute.value.meta });
      } catch {
        return void 0;
      }
    }
  };
}
function localeHead(ctx, { dir = true, lang = true, seo = true }) {
  return localeHead$1(createHeadContext(ctx, { dir, lang, seo }));
}
function _useLocaleHead(ctx, options) {
  const metaObject = ref(localeHead$1(createHeadContext(ctx, options)));
  return metaObject;
}
function parseAcceptLanguage(value) {
  return value.split(",").map((tag) => tag.split(";")[0]).filter(
    (tag) => !(tag === "*" || tag === "")
  );
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === "string" ? path : path.pathname;
    const normalizedPath = rawPath.split("?")[0];
    const parts = normalizedPath.split("/");
    if (parts[0] === "") {
      parts.shift();
    }
    return parts.length > index ? parts[index] || "" : "";
  };
}
const separator = "___";
function normalizeRouteName(routeName) {
  if (typeof routeName === "string") {
    return routeName;
  }
  if (routeName != null) {
    return routeName.toString();
  }
  return "";
}
function getRouteBaseName(route) {
  return normalizeRouteName(typeof route === "object" ? route?.name : route).split(separator)[0];
}
function getLocalizedRouteName(routeName, locale, isDefault) {
  return routeName + separator + locale ;
}
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  return input[0] === "/" ? getLocaleFromRoutePath(input) : getLocaleFromRouteName(input);
}
function createLocaleRouteNameGetter(defaultLocale) {
  return (name, locale) => getLocalizedRouteName(normalizeRouteName(name), locale);
}
function createLocalizedRouteByPathResolver(router) {
  return (route) => router.resolve(route);
}
const localeCodes = [
  "sk",
  "cz",
  "de",
  "hu",
  "en",
  "pl",
  "en-GB",
  "pl-PL",
  "de-DE"
];
const localeLoaders = {
  sk: [
    {
      key: "locale_sk_45SK_46ts_c93dcca6",
      load: () => import(
        './sk-SK-DBOOm261.mjs'
        /* webpackChunkName: "locale_sk_45SK_46ts_c93dcca6" */
      ),
      cache: true
    }
  ],
  cz: [
    {
      key: "locale_cs_45CZ_46ts_3da6ac40",
      load: () => import(
        './cs-CZ-TI4u9LIb.mjs'
        /* webpackChunkName: "locale_cs_45CZ_46ts_3da6ac40" */
      ),
      cache: true
    }
  ],
  de: [
    {
      key: "locale_de_45DE_46ts_529547a5",
      load: () => import(
        './de-DE-CgvzEtQy.mjs'
        /* webpackChunkName: "locale_de_45DE_46ts_529547a5" */
      ),
      cache: true
    }
  ],
  hu: [
    {
      key: "locale_hu_45HU_46ts_3a0ed05b",
      load: () => import(
        './hu-HU-BHBVbCJI.mjs'
        /* webpackChunkName: "locale_hu_45HU_46ts_3a0ed05b" */
      ),
      cache: true
    }
  ],
  en: [
    {
      key: "locale_en_45GB_46ts_72e5ed53",
      load: () => import(
        './en-GB-BHuhSyKv.mjs'
        /* webpackChunkName: "locale_en_45GB_46ts_72e5ed53" */
      ),
      cache: true
    }
  ],
  pl: [
    {
      key: "locale_pl_45PL_46ts_c1d42c2e",
      load: () => import(
        './pl-PL-B0jMesiK.mjs'
        /* webpackChunkName: "locale_pl_45PL_46ts_c1d42c2e" */
      ),
      cache: true
    }
  ],
  "en-GB": [
    {
      key: "locale_en_45GB_46ts_4f07b94d",
      load: () => import(
        './en-GB-CxkriYfg.mjs'
        /* webpackChunkName: "locale_en_45GB_46ts_4f07b94d" */
      ),
      cache: false
    }
  ],
  "pl-PL": [
    {
      key: "locale_pl_45PL_46ts_d97052ab",
      load: () => import(
        './pl-PL-stN1a4ys.mjs'
        /* webpackChunkName: "locale_pl_45PL_46ts_d97052ab" */
      ),
      cache: false
    }
  ],
  "de-DE": [
    {
      key: "locale_de_45DE_46ts_de587c5f",
      load: () => import(
        './de-DE-Cv1Co8LJ.mjs'
        /* webpackChunkName: "locale_de_45DE_46ts_de587c5f" */
      ),
      cache: false
    }
  ]
};
const vueI18nConfigs = [
  () => import(
    './config-DQ3HQ0RL.mjs'
    /* webpackChunkName: "config_config_46ts_977561ac" */
  ),
  () => import(
    './config-DQ3HQ0RL.mjs'
    /* webpackChunkName: "config_config_46ts_977561ac" */
  )
];
const normalizedLocales = [
  {
    code: "sk",
    iso: "sk-SK",
    language: "sk-SK",
    name: "Slovak",
    shopwareId: "019ed5eca5c972ee81c851a9ddec7216"
  },
  {
    code: "cz",
    iso: "cs-CZ",
    language: "cs-CZ",
    name: "Czech",
    shopwareId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b"
  },
  {
    code: "de",
    iso: "de-DE",
    language: "de-DE",
    name: "Deutsch",
    shopwareId: void 0
  },
  {
    code: "hu",
    iso: "hu-HU",
    language: "hu-HU",
    name: "Magyar",
    shopwareId: void 0
  },
  {
    code: "en",
    iso: "en-GB",
    language: "en-GB",
    name: "English",
    shopwareId: void 0
  },
  {
    code: "pl",
    iso: "pl-PL",
    language: "pl-PL",
    name: "Polski",
    shopwareId: "019ed5ef1c4470d387dcb04ba1437025"
  },
  {
    code: "en-GB",
    language: "en-GB"
  },
  {
    code: "pl-PL",
    language: "pl-PL"
  },
  {
    code: "de-DE",
    language: "de-DE"
  }
];
const cacheMessages = /* @__PURE__ */ new Map();
const merger = createDefu$1((obj, key, value) => {
  if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
    obj[key] ??= create(null);
    deepCopy(value, obj[key]);
    return true;
  }
});
async function loadVueI18nOptions(vueI18nConfigs2) {
  const nuxtApp = useNuxtApp();
  let vueI18nOptions = { messages: create(null) };
  for (const configFile of vueI18nConfigs2) {
    const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages$1(locale, loader) {
  const nuxtApp = useNuxtApp();
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message);
  }
}
async function getLocaleMessagesMergedCached(locale, loaders = []) {
  const nuxtApp = useNuxtApp();
  const messages = await Promise.all(loaders.map(async (loader) => {
    const cached = getCachedMessages();
    const messages2 = cached || await nuxtApp.runWithContext(() => getLocaleMessages$1(locale, loader));
    if (!cached && loader.cache !== false) {
      cacheMessages.set(loader.key, { ttl: Date.now() + -1 * 1e3, value: messages2 });
    }
    return messages2;
  }));
  const merged = {};
  for (const message of messages) {
    deepCopy(message, merged);
  }
  return merged;
}
function getCachedMessages(loader) {
  {
    return;
  }
}
function getI18nTarget(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n ? i18n.global : i18n;
}
function getComposer$3(i18n) {
  const target = getI18nTarget(i18n);
  return "__composer" in target ? target.__composer : target;
}
function useRuntimeI18n(nuxtApp, event) {
  if (!nuxtApp) {
    return (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  }
  return nuxtApp.$config.public.i18n;
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n(nuxtApp).detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0;
  }
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
function matchDomainLocale(locales, host, pathLocale) {
  const normalizeDomain = (domain = "") => domain.replace(/https?:\/\//, "");
  const matches = locales.filter(
    (locale) => normalizeDomain(locale.domain) === host || toArray$1(locale.domains).includes(host)
  );
  if (matches.length <= 1) {
    return matches[0]?.code;
  }
  return (
    // match by current path locale
    matches.find((l) => l.code === pathLocale)?.code || matches.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault)?.code
  );
}
function domainFromLocale(domainLocales, url, locale) {
  const lang = normalizedLocales.find((x) => x.code === locale);
  const domain = domainLocales?.[locale]?.domain || lang?.domain || lang?.domains?.find((v) => v === url.host);
  if (!domain) {
    return;
  }
  if (hasProtocol(domain, { strict: true })) {
    return domain;
  }
  return url.protocol + "//" + domain;
}
function getDefaultLocaleForDomain(host) {
  return normalizedLocales.find((l) => !!l.defaultForDomains?.includes(host))?.code;
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");
const resolveSupportedLocale = (locale) => isSupportedLocale(locale) ? locale : void 0;
const useLocaleConfigs = () => useState(
  "i18n:cached-locale-configs",
  () => void 0
);
const useResolvedLocale = () => useState("i18n:resolved-locale", () => "");
function useI18nCookie({ cookieCrossOrigin, cookieDomain, cookieSecure, cookieKey }) {
  const date = /* @__PURE__ */ new Date();
  return useCookie(cookieKey, {
    path: "/",
    readonly: false,
    expires: new Date(date.setDate(date.getDate() + 365)),
    sameSite: cookieCrossOrigin ? "none" : "lax",
    domain: cookieDomain || void 0,
    secure: cookieCrossOrigin || cookieSecure
  });
}
function createNuxtI18nContext(nuxt, vueI18n, defaultLocale) {
  const i18n = getI18nTarget(vueI18n);
  const runtimeI18n = useRuntimeI18n(nuxt);
  const detectConfig = useI18nDetection(nuxt);
  const serverLocaleConfigs = useLocaleConfigs();
  const localeCookie = useI18nCookie(detectConfig);
  const loadMap = /* @__PURE__ */ new Set();
  const getLocaleConfig = (locale) => serverLocaleConfigs.value[locale];
  const getDomainFromLocale = (locale) => domainFromLocale(runtimeI18n.domainLocales, useRequestURL({ xForwardedHost: true }), locale);
  const baseUrl = createBaseUrlGetter(nuxt, runtimeI18n.baseUrl);
  const resolvedLocale = useResolvedLocale();
  if (nuxt.ssrContext?.event?.context?.nuxtI18n?.detectLocale) {
    resolvedLocale.value = nuxt.ssrContext.event.context.nuxtI18n.detectLocale;
  }
  const loadMessagesFromClient = async (locale) => {
    const locales = getLocaleConfig(locale)?.fallbacks ?? [];
    if (!locales.includes(locale)) {
      locales.push(locale);
    }
    for (const k of locales) {
      const msg = await nuxt.runWithContext(() => getLocaleMessagesMergedCached(k, localeLoaders[k]));
      i18n.mergeLocaleMessage(k, msg);
    }
  };
  const loadMessagesFromServer = async (locale) => {
    if (locale in localeLoaders === false) {
      return;
    }
    const headers = getLocaleConfig(locale)?.cacheable ? {} : { "Cache-Control": "no-cache" };
    const messages = await $fetch(`${"/_i18n/54CPHSVC"}/${locale}/messages.json`, { headers });
    for (const k of Object.keys(messages)) {
      i18n.mergeLocaleMessage(k, messages[k]);
    }
  };
  const ctx = {
    vueI18n,
    initial: true,
    preloaded: false,
    config: runtimeI18n,
    rootRedirect: resolveRootRedirect(runtimeI18n.rootRedirect),
    redirectStatusCode: runtimeI18n.redirectStatusCode ?? 302,
    dynamicResourcesSSG: false,
    getDefaultLocale: () => defaultLocale,
    getLocale: () => unref(i18n.locale),
    setLocale: async (locale) => {
      const oldLocale = ctx.getLocale();
      if (locale === oldLocale || !isSupportedLocale(locale)) {
        return;
      }
      if (isRef(i18n.locale)) {
        i18n.locale.value = locale;
      } else {
        i18n.locale = locale;
      }
      await nuxt.callHook("i18n:localeSwitched", { newLocale: locale, oldLocale });
      resolvedLocale.value = locale;
    },
    setLocaleSuspend: async (locale) => {
      if (!isSupportedLocale(locale)) {
        return;
      }
      ctx.vueI18n.__pendingLocale = locale;
      ctx.vueI18n.__pendingLocalePromise = new Promise((resolve) => {
        ctx.vueI18n.__resolvePendingLocalePromise = async () => {
          ctx.setCookieLocale(locale);
          await ctx.setLocale(locale);
          ctx.vueI18n.__pendingLocale = void 0;
          resolve();
        };
      });
      {
        await ctx.vueI18n.__resolvePendingLocalePromise?.();
      }
    },
    getLocales: () => unref(i18n.locales).map((x) => isString(x) ? { code: x } : x),
    setCookieLocale: (locale) => {
      if (detectConfig.useCookie && isSupportedLocale(locale)) {
        localeCookie.value = locale;
      }
    },
    getBaseUrl: (locale) => {
      if (locale) {
        return joinURL(getDomainFromLocale(locale) || baseUrl(), nuxt.$config.app.baseURL);
      }
      return joinURL(baseUrl(), nuxt.$config.app.baseURL);
    },
    loadMessages: async (locale) => {
      if (nuxt.isHydrating && loadMap.has(locale)) {
        return;
      }
      try {
        return ctx.dynamicResourcesSSG || false ? await loadMessagesFromClient(locale) : await loadMessagesFromServer(locale);
      } catch (e) {
      } finally {
        loadMap.add(locale);
      }
    },
    composableCtx: void 0
  };
  ctx.composableCtx = createComposableContext(ctx, nuxt);
  return ctx;
}
function useNuxtI18nContext(nuxt) {
  if (nuxt._nuxtI18n == null) {
    throw new Error("Nuxt I18n context has not been set up yet.");
  }
  return nuxt._nuxtI18n;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}
const getCookieLocale = (event, cookieName) => getCookie$1(event, cookieName) || void 0;
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
const getHostLocale = (event, path, domainLocales) => {
  const host = getRequestURL(event, { xForwardedHost: true }).host;
  const locales = normalizedLocales.map((l) => ({
    ...l,
    domain: domainLocales[l.code]?.domain ?? l.domain
  }));
  return matchDomainLocale(locales, host, getLocaleFromRoutePath(path));
};
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n(nuxtApp);
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event),
    navigator: () => void 0,
    host: (path) => getHostLocale(event, path, runtimeI18n.domainLocales),
    route: (path) => getRouteLocale(event, path)
  };
};
const isRouteLocationPathRaw = (val) => !!val.path && !val.name;
function useComposableContext(nuxtApp) {
  const context = nuxtApp?._nuxtI18n?.composableCtx;
  if (!context) {
    throw new Error(
      "i18n context is not initialized. Ensure the i18n plugin is installed and the composable is used within a Vue component or setup function."
    );
  }
  return context;
}
const formatTrailingSlash = withoutTrailingSlash;
function createComposableContext(ctx, nuxtApp = useNuxtApp()) {
  const router = useRouter();
  useDetectors(useRequestEvent(), useI18nDetection(nuxtApp), nuxtApp);
  const defaultLocale = ctx.getDefaultLocale();
  const getLocalizedRouteName2 = createLocaleRouteNameGetter();
  function resolveLocalizedRouteByName(route, locale) {
    route.name = getRouteBaseName(route.name || router.currentRoute.value);
    const localizedName = getLocalizedRouteName2(route.name, locale);
    if (router.hasRoute(localizedName)) {
      route.name = localizedName;
    }
    return route;
  }
  const routeByPathResolver = createLocalizedRouteByPathResolver(router);
  function resolveLocalizedRouteByPath(input, locale) {
    const route = routeByPathResolver(input, locale);
    const baseName = getRouteBaseName(route);
    if (baseName) {
      route.name = getLocalizedRouteName2(baseName, locale);
      return route;
    }
    if (prefixable(locale, defaultLocale)) {
      route.path = "/" + locale + route.path;
    }
    route.path = formatTrailingSlash(route.path, true);
    return route;
  }
  const composableCtx = {
    router,
    _head: void 0,
    get head() {
      this._head ??= useHead({});
      return this._head;
    },
    metaState: { htmlAttrs: {}, meta: [], link: [] },
    seoSettings: {
      dir: false,
      lang: false,
      seo: false
    },
    localePathPayload: getLocalePathPayload(),
    routingOptions: {
      defaultLocale,
      strictCanonicals: ctx.config.experimental.alternateLinkCanonicalQueries ?? true,
      hreflangLinks: true
    },
    getLocale: ctx.getLocale,
    getLocales: ctx.getLocales,
    getBaseUrl: ctx.getBaseUrl,
    getRouteBaseName,
    getRouteLocalizedParams: () => router.currentRoute.value.meta["nuxtI18nInternal"] ?? {},
    getLocalizedDynamicParams: (locale) => {
      return composableCtx.getRouteLocalizedParams()?.[locale];
    },
    afterSwitchLocalePath: (path, locale) => {
      composableCtx.getRouteLocalizedParams();
      return path;
    },
    resolveLocalizedRouteObject: (route, locale) => {
      return isRouteLocationPathRaw(route) ? resolveLocalizedRouteByPath(route, locale) : resolveLocalizedRouteByName(route, locale);
    }
  };
  return composableCtx;
}
function getLocalePathPayload(nuxtApp = useNuxtApp()) {
  return JSON.parse("{}");
}
async function loadAndSetLocale(nuxtApp, locale) {
  const ctx = useNuxtI18nContext(nuxtApp);
  const oldLocale = ctx.getLocale();
  if (locale === oldLocale && !ctx.initial) {
    return locale;
  }
  const data = { oldLocale, newLocale: locale, initialSetup: ctx.initial, context: nuxtApp };
  let override = await nuxtApp.callHook("i18n:beforeLocaleSwitch", data);
  override ??= data.newLocale;
  if (isSupportedLocale(override)) {
    locale = override;
  }
  await ctx.loadMessages(locale);
  await ctx.setLocaleSuspend(locale);
  return locale;
}
function skipDetect(detect, path, pathLocale) {
  if (detect.redirectOn === "root" && path !== "/") {
    return true;
  }
  if (detect.redirectOn === "no prefix" && !detect.alwaysRedirect && isSupportedLocale(pathLocale)) {
    return true;
  }
  return false;
}
function detectLocale(nuxtApp, route) {
  const detectConfig = useI18nDetection(nuxtApp);
  const detectors = useDetectors(useRequestEvent(nuxtApp), detectConfig, nuxtApp);
  const ctx = useNuxtI18nContext(nuxtApp);
  const path = isString(route) ? route : route.path;
  function* detect() {
    if (ctx.initial && detectConfig.enabled && !skipDetect(detectConfig, path, detectors.route(path))) {
      yield detectors.cookie();
      yield detectors.header();
      yield detectors.navigator();
      yield detectConfig.fallbackLocale;
    }
    {
      yield detectors.route(route);
    }
  }
  for (const detected of detect()) {
    if (detected && isSupportedLocale(detected)) {
      return detected;
    }
  }
  return ctx.getLocale() || ctx.getDefaultLocale() || "";
}
function navigate(nuxtApp, to, locale) {
  const ctx = useNuxtI18nContext(nuxtApp);
  const _ctx = useComposableContext(nuxtApp);
  if (to.path === "/" && ctx.rootRedirect) {
    return navigateTo(localePath(_ctx, ctx.rootRedirect.path, locale), { redirectCode: ctx.rootRedirect.code });
  }
  if (ctx.vueI18n.__pendingLocale && useNuxtApp()._processingMiddleware) {
    return;
  }
  const detectors = useDetectors(useRequestEvent(), useI18nDetection(nuxtApp), nuxtApp);
  if (detectors.route(to) === locale) {
    return;
  }
  const destination = switchLocalePath(_ctx, locale, to) || localePath(_ctx, to.fullPath, locale);
  if (isEqual$1(destination, to.fullPath)) {
    return;
  }
  return navigateTo(destination, { redirectCode: ctx.redirectStatusCode });
}
function prefixable(currentLocale, defaultLocale) {
  return currentLocale !== defaultLocale || false;
}
function createBaseUrlGetter(nuxt, baseUrl, defaultLocale, getDomainFromLocale) {
  if (isFunction(baseUrl)) {
    return () => baseUrl(nuxt);
  }
  return () => {
    return baseUrl ?? "";
  };
}
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14};
const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
function createCompileError(code, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 13,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 13,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    13
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 7) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 7 || currentType === 11)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "") => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return hasSpace;
      } else if (ch === "@" || !ch) {
        return hasSpace;
      } else if (ch === "|") {
        return !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "\\") {
        const nextCh = scnr.peek();
        if (nextCh === "{" || nextCh === "}" || nextCh === "@" || nextCh === "|" || nextCh === "\\") {
          buf += ch + nextCh;
          scnr.next();
          scnr.next();
        } else {
          scnr.resetPeek();
          buf += ch;
          scnr.next();
        }
      } else if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    const currentChar = scnr.currentChar();
    if (currentChar && currentChar !== "}" && currentChar !== EOF && currentChar !== CHAR_SP && currentChar !== CHAR_LF && currentChar !== "　") {
      const invalidPart = readInvalidIdentifier(scnr);
      emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, name + invalidPart);
      return name + invalidPart;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 4, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 6, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 12, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 11, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 10, readLinkedRefer(scnr));
          }
        }
        if (currentType === 7) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        13
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
const TEXT_ESCAPES = /\\([\\@{}|])/g;
function fromTextEscapeSequence(_match, char) {
  return char;
}
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    // eslint-disable-next-line no-useless-escape
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value.replace(TEXT_ESCAPES, fromTextEscapeSequence);
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 11) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 8) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 9) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 10:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 4:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 7: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 13 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 13);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 13) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 13) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 13) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
  }
  delete node.type;
}
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code, node) {
    _context.code += code;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code, map } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
function isMessageAST(val) {
  return isObject$1(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
// @__NO_SIDE_EFFECTS__
function compile(message, context) {
  if (isString(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: "production" !== "production",
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
};
const CORE_ERROR_CODES_EXTEND_POINT = 24;
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString(locale)) {
    return locale;
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve = locale();
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject$1(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return ch;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$1(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$1(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    if (!isObject$1(last)) {
      return null;
    }
    if (!hasOwn(last, key)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const VERSION$1 = "11.4.6";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
};
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$1(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index = locales.indexOf(targetLocale);
  if (index === -1) {
    return false;
  }
  for (let i = index + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  if (!isString(args[0]) && !isDate(args[0]) && !isNumber(args[0])) {
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    const formatter2 = new Intl.DateTimeFormat(locale.replace(/!/g, ""), overrides);
    return !part ? formatter2.format(value) : formatter2.formatToParts(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  if (!isNumber(args[0])) {
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    const formatter2 = new Intl.NumberFormat(locale.replace(/!/g, ""), overrides);
    return !part ? formatter2.format(value) : formatter2.formatToParts(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice === 1 ? 0 : 1;
  }
  return Math.min(choice, 2);
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return isNumber(options.named?.count) ? options.named.count : isNumber(options.named?.n) ? options.named.n : index;
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isString(locale) && isFunction(options.pluralRules?.[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = pluralRule === pluralDefault ? void 0 : pluralDefault;
  const plural = (messages) => messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || create();
  if (isNumber(options.pluralIndex)) {
    _named.count ||= options.pluralIndex;
    _named.n ||= options.pluralIndex;
  }
  const named = (key) => _named[key];
  function message(key, useLinked) {
    const msg = isFunction(options.messages) ? options.messages(key, !!useLinked) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isFunction(options.processor?.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isFunction(options.processor?.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isString(options.processor?.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$1(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key, true)(ctx);
    const resolved = ret === "" || ret === void 0 ? key : ret;
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(resolved) && modifier ? resolved[0] : resolved
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign(create(), _list, _named)
  };
  return ctx;
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey));
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  let ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (escapeParameter && isString(ret)) {
    ret = sanitizeTranslatedHtml(ret);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = (() => format2);
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      throw err;
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key, useLinked) => {
    let val = resolveValue2(message, key);
    if (val == null && (fallbackContext || useLinked)) {
      const [format2, , message2] = resolveMessageFormat(
        fallbackContext || context,
        // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale,
        fallbackWarn,
        missingWarn
      );
      val = format2 ?? resolveValue2(message2, key);
    }
    if (isString(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
const VERSION = "11.4.8";
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: 25,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 26,
  NOT_INSTALLED: 27,
  // directive module errors
  REQUIRED_VALUE: 28,
  INVALID_VALUE: 29,
  NOT_INSTALLED_WITH_PROVIDE: 31,
  // unexpected error
  UNEXPECTED_ERROR: 32,
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: 34
};
function createI18nError(code, ...args) {
  return createCompileError(code, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject$1(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$1(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject$1(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject$1(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject$1(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
function getCurrentInstance() {
  const key = "currentInstance";
  if (key in Vue) {
    return Vue[key];
  } else {
    return Vue.getCurrentInstance();
  }
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return ((ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  });
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = shallowRef;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _context.locale = val;
      _locale.value = val;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _context.fallbackLocale = val;
      _fallbackLocale.value = val;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if ("production" !== "production" || false) ;
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = Reflect.apply(translate, null, [_context2, ...args]);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString(locale2) ? locale2 : _locale.value;
      const locales = isString(locale2) ? [targetLocale] : fallbackWithLocaleChain(_context, _fallbackLocale.value, targetLocale);
      for (let i = 0; i < locales.length; i++) {
        const message = getLocaleMessage(locales[i]);
        let resolved = _context.messageResolver(message, key);
        if (resolved === null) {
          resolved = message[key];
        }
        if (isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved)) {
          return true;
        }
      }
      return false;
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag() {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const renderChildren = () => {
        const keys = Object.keys(slots).filter((key) => key[0] !== "_");
        const options = create();
        if (props.locale) {
          options.locale = props.locale;
        }
        if (props.plural !== void 0) {
          options.plural = isString(props.plural) ? +props.plural : props.plural;
        }
        const arg = getInterpolateArg(context, keys);
        return i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      };
      const assignedAttrs = assign(create(), attrs);
      const tag = isString(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
      return isObject$1(tag) ? h(tag, assignedAttrs, { default: renderChildren }) : h(tag, assignedAttrs, renderChildren());
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const renderChildren = () => {
      const options = { part: true };
      let overrides = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (isString(props.format)) {
        options.key = props.format;
      } else if (isObject$1(props.format)) {
        if (isString(props.format.key)) {
          options.key = props.format.key;
        }
        overrides = Object.keys(props.format).reduce((options2, prop) => {
          return slotKeys.includes(prop) ? assign(create(), options2, { [prop]: props.format[prop] }) : options2;
        }, create());
      }
      const parts = partFormatter(...[props.value, options, overrides]);
      let children = [options.key];
      if (isArray(parts)) {
        children = parts.map((part, index) => {
          const slot = slots[part.type];
          const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
          if (isVNode(node)) {
            node[0].key = `${part.type}-${index}`;
          }
          return node;
        });
      } else if (isString(parts)) {
        children = [parts];
      }
      return children;
    };
    const assignedAttrs = assign(create(), attrs);
    const tag = isString(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
    return isObject$1(tag) ? h(tag, assignedAttrs, { default: renderChildren }) : h(tag, assignedAttrs, renderChildren());
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
function getComposer$1(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$1(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [Translation.name, "I18nT"].forEach((name) => app.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  const i18n = {
    // mode
    get mode() {
      return "composition";
    },
    // install plugin
    async install(app, ...options2) {
      app.__VUE_I18N_SYMBOL__ = symbol;
      app.provide(app.__VUE_I18N_SYMBOL__, i18n);
      if (isPlainObject(options2[0])) {
        const opts = options2[0];
        i18n.__composerExtend = opts.__composerExtend;
        i18n.__vueI18nExtend = opts.__vueI18nExtend;
      }
      let globalReleaseHandler = null;
      if (__globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global);
      }
      {
        apply(app, i18n, ...options2);
      }
      const unmountApp = app.unmount;
      app.unmount = () => {
        globalReleaseHandler && globalReleaseHandler();
        i18n.dispose();
        unmountApp();
      };
    },
    // global accessor
    get global() {
      return __global;
    },
    dispose() {
      globalScope.stop();
    },
    // @internal
    __instances,
    // @internal
    __getInstance,
    // @internal
    __setInstance,
    // @internal
    __deleteInstance
  };
  return i18n;
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  if (scope === "isolated") {
    if (i18n.mode !== "composition") {
      throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    }
    const i18nInternalIso = i18n;
    const composerOptions = assign({}, options);
    const parentComposer = getComposer(i18n, instance);
    composerOptions.__root = parentComposer || gl;
    const composer2 = createComposer(composerOptions);
    if (i18nInternalIso.__composerExtend) {
      composer2[DisposeSymbol] = i18nInternalIso.__composerExtend(composer2);
    }
    const currentScope = getCurrentScope();
    if (currentScope) {
      onScopeDispose(() => {
        const dispose = composer2[DisposeSymbol];
        if (dispose) {
          dispose();
          delete composer2[DisposeSymbol];
        }
      });
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode) {
  const scope = effectScope();
  const obj = scope.run(() => createComposer(options));
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
  }
  return [scope, obj];
}
function getI18nInstance(instance) {
  const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
  if (!i18n) {
    throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
  }
  return i18n;
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  return !useComponent ? target.parent : target.vnode.ctx || target.parent;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
registerMessageCompiler(compile);
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
function useLocaleHead({ dir = true, lang = true, seo = true } = {}, nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  common.seoSettings = { dir, lang, seo };
  const head = _useLocaleHead(common, common.seoSettings);
  common.metaState = head.value;
  return head;
}
function useRouteBaseName(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route) => {
    if (route == null) {
      return;
    }
    return common.getRouteBaseName(route) || void 0;
  };
}
function useLocalePath(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route, locale) => localePath(common, route, locale);
}
function useLocaleRoute(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (route, locale) => localeRoute(common, route, locale);
}
function useSwitchLocalePath(nuxtApp = useNuxtApp()) {
  const common = useComposableContext(nuxtApp);
  return (locale) => switchLocalePath(common, locale);
}
const identifier = "nuxt-i18n-slp";
const switchLocalePathLinkWrapperExpr = new RegExp(
  [`<!--${identifier}-\\[(\\w+)\\]-->`, `.+?`, `<!--/${identifier}-->`].join(""),
  "g"
);
const switch_locale_path_ssr_Hk9vdM15aB_0VkdtA_Usx_xFCjk41oE2KO5i9C8RnMs = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:switch-locale-path-ssr",
  dependsOn: ["i18n:plugin"],
  setup(_nuxt) {
    const nuxt = useNuxtApp(_nuxt._id);
    const switchLocalePath2 = useSwitchLocalePath(nuxt);
    nuxt.hook("app:rendered", (ctx) => {
      if (ctx.renderResult?.html == null) {
        return;
      }
      ctx.renderResult.html = ctx.renderResult.html.replaceAll(
        switchLocalePathLinkWrapperExpr,
        (match, p1) => {
          const encoded = encodeURI(switchLocalePath2(p1 ?? ""));
          return match.replace(
            /href="([^"]+)"/,
            `href="${encoded || "#"}" ${""}`
          );
        }
      );
    });
  }
});
const route_locale_detect_9xnjrvR2gs_Q4sLywtkwzH8IawzhEmfdVknj25um3og = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:route-locale-detect",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    const ctx = useNuxtI18nContext(nuxt);
    const resolvedLocale = useResolvedLocale();
    [__temp, __restore] = executeAsync(() => nuxt.runWithContext(
      () => loadAndSetLocale(
        nuxt,
        ctx.initial && resolvedLocale.value || detectLocale(nuxt, nuxt.$router.currentRoute.value)
      )
    )), await __temp, __restore();
    {
      return;
    }
  }
});
const preload_4ENXi7Vj1g30VXJLzH8WCZKt4IDCRT7OKDVeyfxxWf0 = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:preload",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    {
      return;
    }
  }
});
function extendI18n(i18n, { extendComposer, extendComposerInstance }) {
  const scope = effectScope();
  const installI18n = i18n.install.bind(i18n);
  i18n.install = (app, ...options) => {
    const pluginOptions = assign({}, options[0]);
    pluginOptions.__composerExtend = (c) => {
      extendComposerInstance(c, getComposer$3(i18n));
      return () => {
      };
    };
    if (i18n.mode === "legacy") {
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendComposerInstance(vueI18n, getComposer$3(vueI18n));
        return () => {
        };
      };
    }
    Reflect.apply(installI18n, i18n, [app, pluginOptions]);
    const globalComposer = getComposer$3(i18n);
    scope.run(() => {
      extendComposer(globalComposer);
      if (i18n.mode === "legacy" && "__composer" in i18n.global) {
        extendComposerInstance(i18n.global, getComposer$3(i18n.global));
      }
    });
    if (i18n.mode === "composition" && app.config.globalProperties.$i18n != null) {
      extendComposerInstance(app.config.globalProperties.$i18n, globalComposer);
    }
    if (app.unmount) {
      const unmountApp = app.unmount.bind(app);
      app.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
}
const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};
const i18n_aNMRN_VpxP5fGsesKfa8RtP7jI8L9qZpzOP_wk7xuAQ = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin",
  parallel: false,
  async setup(_nuxt) {
    let __temp, __restore;
    Object.defineProperty(_nuxt.versions, "nuxtI18n", { get: () => "10.2.4" });
    const nuxt = useNuxtApp(_nuxt._id);
    const runtimeI18n = useRuntimeI18n(nuxt);
    const preloadedOptions = nuxt.ssrContext?.event?.context?.nuxtI18n?.vueI18nOptions;
    const _defaultLocale = getDefaultLocaleForDomain(useRequestURL({ xForwardedHost: true }).host) || runtimeI18n.defaultLocale || "";
    const optionsI18n = preloadedOptions || ([__temp, __restore] = executeAsync(() => setupVueI18nOptions(_defaultLocale)), __temp = await __temp, __restore(), __temp);
    const localeConfigs = useLocaleConfigs();
    {
      localeConfigs.value = useRequestEvent().context.nuxtI18n?.localeConfigs || {};
    }
    prerenderRoutes(localeCodes.map((locale) => `${"/_i18n/54CPHSVC"}/${locale}/messages.json`));
    const i18n = createI18n(optionsI18n);
    const detectors = useDetectors(useRequestEvent(nuxt), useI18nDetection(nuxt), nuxt);
    const ctx = createNuxtI18nContext(nuxt, i18n, optionsI18n.defaultLocale);
    nuxt._nuxtI18n = ctx;
    extendI18n(i18n, {
      extendComposer(composer) {
        composer.locales = computed(() => runtimeI18n.locales);
        composer.localeCodes = computed(() => localeCodes);
        const _baseUrl = ref(ctx.getBaseUrl());
        composer.baseUrl = computed(() => _baseUrl.value);
        composer.strategy = "prefix_except_default";
        composer.localeProperties = computed(
          () => normalizedLocales.find((l) => l.code === composer.locale.value) || { code: composer.locale.value }
        );
        composer.setLocale = async (locale) => {
          await loadAndSetLocale(nuxt, locale);
          await nuxt.runWithContext(() => navigate(nuxt, nuxt.$router.currentRoute.value, locale));
        };
        composer.loadLocaleMessages = ctx.loadMessages;
        composer.differentDomains = false;
        composer.defaultLocale = optionsI18n.defaultLocale;
        composer.getBrowserLocale = () => resolveSupportedLocale(detectors.header());
        composer.getLocaleCookie = () => resolveSupportedLocale(detectors.cookie());
        composer.setLocaleCookie = ctx.setCookieLocale;
        composer.finalizePendingLocaleChange = async () => {
          if (!i18n.__pendingLocale) {
            return;
          }
          await i18n.__resolvePendingLocalePromise?.();
        };
        composer.waitForPendingLocaleChange = async () => {
          await i18n?.__pendingLocalePromise;
        };
      },
      extendComposerInstance(instance, c) {
        const props = [
          ["locales", () => c.locales],
          ["localeCodes", () => c.localeCodes],
          ["baseUrl", () => c.baseUrl],
          ["strategy", () => "prefix_except_default"],
          ["localeProperties", () => c.localeProperties],
          ["setLocale", () => (locale) => Reflect.apply(c.setLocale, c, [locale])],
          ["loadLocaleMessages", () => (locale) => Reflect.apply(c.loadLocaleMessages, c, [locale])],
          ["differentDomains", () => false],
          ["defaultLocale", () => c.defaultLocale],
          ["getBrowserLocale", () => () => Reflect.apply(c.getBrowserLocale, c, [])],
          ["getLocaleCookie", () => () => Reflect.apply(c.getLocaleCookie, c, [])],
          ["setLocaleCookie", () => (locale) => Reflect.apply(c.setLocaleCookie, c, [locale])],
          ["finalizePendingLocaleChange", () => () => Reflect.apply(c.finalizePendingLocaleChange, c, [])],
          ["waitForPendingLocaleChange", () => () => Reflect.apply(c.waitForPendingLocaleChange, c, [])]
        ];
        for (const [key, get] of props) {
          Object.defineProperty(instance, key, { get });
        }
      }
    });
    nuxt.vueApp.use(i18n);
    Object.defineProperty(nuxt, "$i18n", { get: () => getI18nTarget(i18n) });
    nuxt.provide("localeHead", (options) => localeHead(nuxt._nuxtI18n.composableCtx, options));
    nuxt.provide("localePath", useLocalePath(nuxt));
    nuxt.provide("localeRoute", useLocaleRoute(nuxt));
    nuxt.provide("routeBaseName", useRouteBaseName(nuxt));
    nuxt.provide("getRouteBaseName", useRouteBaseName(nuxt));
    nuxt.provide("switchLocalePath", useSwitchLocalePath(nuxt));
  }
});
function createShopwareContext(app, options) {
  const scope = effectScope(true);
  const state = scope.run(() => {
    return reactive({
      interceptors: {}
      // sharedStore: options.initialStore || reactive({}),
      // shopwareDefaults: options.shopwareDefaults || {},
    });
  });
  const shopwarePlugin = markRaw({
    install(app2) {
      shopwarePlugin._a = app2;
      app2.config.globalProperties.$shopware = shopwarePlugin;
      app2.provide("shopware", shopwarePlugin);
    },
    _a: app,
    _e: scope,
    devStorefrontUrl: options.devStorefrontUrl,
    state,
    browserLocale: options.browserLocale || "en-US"
  });
  return shopwarePlugin;
}
const plugin_oBNFNVHL6yQjyny5te872yZmR0688VlZ6QyIsgpFQxI = /* @__PURE__ */ defineNuxtPlugin((NuxtApp) => {
  const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
  const shopwareRuntimeConfigPublic = runtimeConfig.public.shopware;
  const shopwareRuntimeConfig = runtimeConfig.shopware;
  const shopwareEndpointCSR = shopwareRuntimeConfigPublic?.endpoint ?? shopwareRuntimeConfigPublic?.shopwareEndpoint;
  const shopwareEndpointSSR = NuxtApp.ssrContext && shopwareRuntimeConfig?.endpoint || shopwareEndpointCSR;
  const shopwareEndpoint = shopwareEndpointSSR;
  const shopwareAccessToken = shopwareRuntimeConfigPublic?.accessToken ?? shopwareRuntimeConfigPublic?.shopwareAccessToken;
  if (!shopwareEndpoint || !shopwareAccessToken) {
    throw new Error(
      "Make sure that endpoint and accessToken are settled in the configuration"
    );
  }
  const shouldUseSessionContextInServerRender = !NuxtApp.ssrContext || !!shopwareRuntimeConfigPublic?.useUserContextInSSR || !!shopwareRuntimeConfig?.useUserContextInSSR;
  const contextTokenFromCookie = NuxtApp.ssrContext ? getCookie(NuxtApp.ssrContext.event, "sw-context-token") : Cookies.get("sw-context-token");
  const apiClient = createAPIClient({
    baseURL: shopwareEndpoint,
    accessToken: shopwareAccessToken,
    contextToken: shouldUseSessionContextInServerRender ? contextTokenFromCookie : "",
    defaultHeaders: NuxtApp.ssrContext && runtimeConfig.apiClientConfig?.headers || runtimeConfig.public?.apiClientConfig?.headers
  });
  apiClient.hook("onContextChanged", (newContextToken) => {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365,
      // days
      path: "/",
      sameSite: "lax",
      secure: shopwareEndpoint.startsWith("https://")
    });
  });
  apiClient.hook("onResponseError", (response) => {
    const error = isMaintenanceMode(response._data?.errors ?? []);
    if (error) {
      throw showError({
        statusCode: 503,
        statusMessage: "MAINTENANCE_MODE"
      });
    }
  });
  let browserLocale = "en-US";
  {
    browserLocale = useRequestHeaders()["accept-language"]?.split(",")[0]?.split(";")[0] ?? "en-US";
  }
  NuxtApp.vueApp.provide("apiClient", apiClient);
  const shopwareContext = createShopwareContext(NuxtApp.vueApp, {
    devStorefrontUrl: shopwareRuntimeConfigPublic?.devStorefrontUrl || null,
    browserLocale
  });
  NuxtApp.vueApp.provide("shopware", shopwareContext);
  const sessionContextData = ref();
  NuxtApp.vueApp.provide("swSessionContext", sessionContextData);
  useState("swSessionContext", () => sessionContextData);
  return {
    provide: {
      shopwareApiClient: apiClient
    }
  };
});
const unocss_6Z4vW7S9aX_q2svWbGBc_X2b5QbQdkNmvzr_3kqqCd0 = /* @__PURE__ */ defineNuxtPlugin(() => {
});
const _00_fix_locale_eLxoogYFESrpqC1h5ksHVeQQYe_RvxFKaC5G57jHuwo = /* @__PURE__ */ defineNuxtPlugin({
  name: "mts-fix-locale",
  parallel: true,
  setup(nuxtApp) {
    const shopwareContext = nuxtApp.vueApp._context?.provides?.shopware;
    if (shopwareContext && shopwareContext.browserLocale) {
      try {
        new Intl.NumberFormat(shopwareContext.browserLocale);
      } catch (e) {
        shopwareContext.browserLocale = "en-US";
      }
    }
  }
});
class ContextError extends Error {
  constructor(scope, message) {
    super(`${scope} ${message ? message : "context is not provided"}`);
    this.name = "ContextError";
  }
}
function useShopwareContext() {
  const shopwareContext = inject("shopware", null);
  const apiClient = inject("apiClient");
  if (!shopwareContext || !apiClient) {
    throw new ContextError("Shopware or apiClient");
  }
  return {
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
    browserLocale: shopwareContext.browserLocale || "en-US"
  };
}
const auth_token_ci5EkxBEMgoVdcQ5AGT5GQwge9xMlMQtCTNZKVpXn0I = /* @__PURE__ */ defineNuxtPlugin((_nuxtApp) => {
  const { apiClient } = useShopwareContext();
  const tokenCookie = useCookie("sw-context-token", {
    maxAge: 60 * 60 * 24 * 30,
    // 30 dní — košík prežije zatvorenie prehliadača
    sameSite: "lax",
    path: "/"
  });
  apiClient.hook("request", (requestContext) => {
    const token = tokenCookie.value;
    if (token) {
      requestContext.headers = {
        ...requestContext.headers,
        "sw-context-token": token
      };
    }
  });
  apiClient.hook("response", (response) => {
    const newToken = response?.headers?.get?.("sw-context-token") ?? response?.data?.contextToken ?? null;
    if (newToken && newToken !== tokenCookie.value) {
      tokenCookie.value = newToken;
    }
  });
});
const shopware_language_y0_kntQmS7tzjJ_3rkr3COSSN8eQyPdYuGEIwuIwv2Q = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const route = useRoute();
  const { apiClient } = useShopwareContext();
  const config = /* @__PURE__ */ useRuntimeConfig();
  const langMap = config.public.shopware.ids.languages;
  const PREFIX_MAP = [
    ["/cz/", langMap.cz],
    ["/pl/", langMap.pl],
    ["/en/", langMap.en],
    ["/de/", langMap.de],
    ["/hu/", langMap.hu],
    ["/cz", langMap.cz],
    ["/pl", langMap.pl],
    ["/en", langMap.en],
    ["/de", langMap.de],
    ["/hu", langMap.hu]
  ];
  apiClient.hook("request", (requestContext) => {
    const path = route.path;
    const langId = PREFIX_MAP.find(
      ([prefix]) => path === prefix || path.startsWith(prefix + "/") || path.startsWith(prefix)
    )?.[1] ?? langMap.sk;
    requestContext.headers = {
      ...requestContext.headers,
      "sw-language-id": langId
    };
  });
});
const slugify = (text) => {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
};
const getCategoryUrl = (category) => {
  if (!category) return "/";
  const id = category.id;
  const name = category.translated?.name || category.name;
  if (category.seoUrl && !category.seoUrl.startsWith("/navigation/") && !category.seoUrl.startsWith("navigation/")) {
    return `/${category.seoUrl.startsWith("/") ? category.seoUrl.slice(1) : category.seoUrl}`;
  }
  if (category.seoUrls && category.seoUrls.length > 0) {
    const seoPath = category.seoUrls[0]?.seoPathInfo;
    if (seoPath && !seoPath.startsWith("navigation/")) {
      return `/${seoPath.startsWith("/") ? seoPath.slice(1) : seoPath}`;
    }
  }
  if (name && name !== "undefined") {
    return `/${slugify(name)}`;
  }
  if (id && id !== "undefined") {
    return `/navigation/${id}`;
  }
  return "/";
};
const getProductUrl = (product) => {
  if (!product) return "/";
  const sku = product.productNumber || product.payload?.productNumber || product.sku;
  const name = product.translated?.name || product.name || product.label || product.payload?.translated?.name;
  const id = product.id || product.referencedId || product.payload?.id;
  if (name && sku && name !== "undefined" && sku !== "undefined") {
    return `/${slugify(name)}/${sku}`;
  }
  if (product.seoUrl && !product.seoUrl.startsWith("/detail/") && !product.seoUrl.startsWith("detail/")) {
    return `/${product.seoUrl.startsWith("/") ? product.seoUrl.slice(1) : product.seoUrl}`;
  }
  if (product.seoUrls && product.seoUrls.length > 0) {
    const seoPath = product.seoUrls[0]?.seoPathInfo;
    if (seoPath && !seoPath.startsWith("detail/")) {
      return `/${seoPath.startsWith("/") ? seoPath.slice(1) : seoPath}`;
    }
  }
  if (id && id !== "undefined") {
    return `/detail/${id}`;
  }
  return "/";
};
const resolveUrl = (entity) => {
  if (!entity) return "/";
  if (typeof entity === "string") return entity;
  if (entity.productNumber || entity.routeName === "frontend.detail.page" || entity.referencedId) {
    return getProductUrl(entity);
  }
  if (entity.routeName === "frontend.navigation.page" || entity.displayGroup === null || entity.level && entity.path) {
    return getCategoryUrl(entity);
  }
  return "/";
};
const url_resolver_lq_ah7Qr6hZpcHkHcEwf1JyoeaBBLAW9s9OBhSM701c = /* @__PURE__ */ defineNuxtPlugin(() => {
  const localePath2 = useLocalePath();
  return {
    provide: {
      /**
       * Resolves any entity to its correct, localized SEO URL.
       * @param entity Product | Category | String | null
       */
      url: (entity) => {
        if (!entity) return localePath2("/");
        const rawPath = resolveUrl(entity);
        return localePath2(rawPath);
      }
    }
  };
});
const ssg_detect_UF4Nst39t0UMaSCKhdiI3ti9uHUzHwDPgMWmwbxO5Uw = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:ssg-detect",
  dependsOn: ["i18n:plugin", "i18n:plugin:route-locale-detect"],
  enforce: "post",
  setup(_nuxt) {
    {
      return;
    }
  }
});
const plugins = [
  payloadPlugin,
  unhead_PtamfB47yqQY_Rh4zjrimgYJkXOrkZ_s7Rhm1JWaAcQ,
  plugin$1,
  revive_payload_server_Ws8SUMTo68XWM_TEhuJIQbORo_qC7bnyjJcGdGVwAYw,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  font_fallback_inlining_plugin_server_Ws81Prt9Nl2CWJJFHbFcLowVk4saho6ynWp0RZ6s4Bs,
  plugin_c515ayiLuocRMvhGInzV4Ci6HK9AGMOPyzAKHLWV3Qg,
  switch_locale_path_ssr_Hk9vdM15aB_0VkdtA_Usx_xFCjk41oE2KO5i9C8RnMs,
  route_locale_detect_9xnjrvR2gs_Q4sLywtkwzH8IawzhEmfdVknj25um3og,
  preload_4ENXi7Vj1g30VXJLzH8WCZKt4IDCRT7OKDVeyfxxWf0,
  i18n_aNMRN_VpxP5fGsesKfa8RtP7jI8L9qZpzOP_wk7xuAQ,
  plugin_oBNFNVHL6yQjyny5te872yZmR0688VlZ6QyIsgpFQxI,
  unocss_6Z4vW7S9aX_q2svWbGBc_X2b5QbQdkNmvzr_3kqqCd0,
  _00_fix_locale_eLxoogYFESrpqC1h5ksHVeQQYe_RvxFKaC5G57jHuwo,
  auth_token_ci5EkxBEMgoVdcQ5AGT5GQwge9xMlMQtCTNZKVpXn0I,
  shopware_language_y0_kntQmS7tzjJ_3rkr3COSSN8eQyPdYuGEIwuIwv2Q,
  url_resolver_lq_ah7Qr6hZpcHkHcEwf1JyoeaBBLAW9s9OBhSM701c,
  ssg_detect_UF4Nst39t0UMaSCKhdiI3ti9uHUzHwDPgMWmwbxO5Uw
];
function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = elapsed / duration * 100;
  return 2 / Math.PI * 100 * Math.atan(completionPercentage / 50);
}
function createLoadingIndicator(opts = {}) {
  const { duration = 2e3, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
  opts.estimatedProgress || defaultEstimatedProgress;
  const nuxtApp = useNuxtApp();
  const progress = shallowRef(0);
  const isLoading2 = shallowRef(false);
  const error = shallowRef(false);
  const start = (opts2 = {}) => {
    error.value = false;
    set(0, opts2);
  };
  function set(at = 0, opts2 = {}) {
    if (nuxtApp.isHydrating) {
      return;
    }
    if (at >= 100) {
      return finish({ force: opts2.force });
    }
    progress.value = at < 0 ? 0 : at;
    opts2.force ? 0 : throttle;
    {
      isLoading2.value = true;
    }
  }
  function finish(opts2 = {}) {
    progress.value = 100;
    if (opts2.error) {
      error.value = true;
    }
    if (opts2.force) {
      progress.value = 0;
      isLoading2.value = false;
    }
  }
  function clear() {
  }
  let _cleanup = () => {
  };
  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading2.value),
    error: computed(() => error.value),
    start,
    set,
    finish,
    clear
  };
}
function useLoadingIndicator(opts = {}) {
  const nuxtApp = useNuxtApp();
  const indicator = nuxtApp._loadingIndicator ||= createLoadingIndicator(opts);
  return indicator;
}
const __nuxt_component_1 = defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    hideDelay: {
      type: Number,
      default: 500
    },
    resetDelay: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    },
    errorColor: {
      type: String,
      default: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)"
    },
    estimatedProgress: {
      type: Function,
      required: false
    }
  },
  setup(props, { slots, expose }) {
    const { progress, isLoading: isLoading2, error, start, finish, clear } = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
      hideDelay: props.hideDelay,
      resetDelay: props.resetDelay,
      estimatedProgress: props.estimatedProgress
    });
    expose({
      progress,
      isLoading: isLoading2,
      error,
      start,
      finish,
      clear
    });
    return () => h("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: isLoading2.value ? 1 : 0,
        background: error.value ? props.errorColor : props.color || void 0,
        backgroundSize: `${progress.value > 0 ? 100 / progress.value * 100 : 0}% auto`,
        transform: `scaleX(${progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
const layouts = {
  cart: defineAsyncComponent(() => import('./cart-DdSOcQtg.mjs').then((m) => m.default || m)),
  checkout: defineAsyncComponent(() => import('./checkout-DZB1EEl_.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-BLswPEqI.mjs').then((m) => m.default || m)),
  account: defineAsyncComponent(() => import('./account-1poJTgrG.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_3 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProductDetailSkeleton",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen font-sans animate-pulse" }, _attrs))} data-v-6dc3c870><div class="max-w-[1536px] mx-auto flex flex-col lg:flex-row lg:items-start lg:px-8" data-v-6dc3c870><div class="w-full lg:w-[58%] xl:w-[60%] lg:pt-8 flex flex-col" data-v-6dc3c870><div class="lg:hidden w-full px-4 pt-4 pb-4" data-v-6dc3c870><div class="h-3 w-32 bg-gray-100 mb-4 rounded" data-v-6dc3c870></div><div class="h-8 w-3/4 bg-gray-100 mb-2 rounded" data-v-6dc3c870></div><div class="h-4 w-24 bg-gray-100 rounded" data-v-6dc3c870></div></div><div class="w-full aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden" data-v-6dc3c870><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" data-v-6dc3c870></div></div><div class="hidden lg:grid grid-cols-2 gap-[1px] mt-[1px]" data-v-6dc3c870><!--[-->`);
      ssrRenderList(2, (i) => {
        _push(`<div class="aspect-square bg-gray-50" data-v-6dc3c870></div>`);
      });
      _push(`<!--]--></div></div><div class="w-full lg:w-[42%] xl:w-[40%] lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:h-[calc(100vh-var(--navbar-height-scrolled,88px))] px-4 md:px-6 xl:px-10 py-6 lg:py-8 lg:pt-16" data-v-6dc3c870><div class="h-6 w-24 bg-gray-100 mb-6 rounded hidden lg:block" data-v-6dc3c870></div><div class="h-4 w-48 bg-gray-50 mb-10 rounded hidden lg:block" data-v-6dc3c870></div><div class="h-10 w-full bg-gray-100 mb-4 rounded" data-v-6dc3c870></div><div class="h-10 w-2/3 bg-gray-100 mb-8 rounded" data-v-6dc3c870></div><div class="h-8 w-32 bg-gray-100 mb-10 rounded" data-v-6dc3c870></div><div class="h-4 w-24 bg-gray-50 mb-4 rounded" data-v-6dc3c870></div><div class="grid grid-cols-4 gap-2 mb-10" data-v-6dc3c870><!--[-->`);
      ssrRenderList(8, (i) => {
        _push(`<div class="h-12 bg-gray-50 border border-gray-100 rounded-sm" data-v-6dc3c870></div>`);
      });
      _push(`<!--]--></div><div class="h-16 w-full bg-black/5 mb-3 rounded-sm" data-v-6dc3c870></div><div class="h-16 w-full bg-gray-100 rounded-sm" data-v-6dc3c870></div></div></div></div>`);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductDetailSkeleton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProductDetailSkeleton = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-6dc3c870"]]), { __name: "ProductDetailSkeleton" });
const ProductDetailSkeleton$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductDetailSkeleton
}, Symbol.toStringTag, { value: "Module" }));
const getLanguageMap = () => {
  try {
    const config = /* @__PURE__ */ useRuntimeConfig();
    return config.public.shopware.ids.languages || {};
  } catch (e) {
    return {};
  }
};
const getLanguageIdFromPath = (path) => {
  const map = getLanguageMap();
  const parts = path.split("/");
  const prefix = parts[1] || "sk";
  return map[prefix] || map.sk || "";
};
const getLocaleFromPath = (path) => {
  const map = getLanguageMap();
  const parts = path.split("/");
  const prefix = parts[1] || "sk";
  return map[prefix] ? prefix : "sk";
};
function tryOnScopeDispose(fn, failSilently) {
  if (getCurrentScope()) {
    onScopeDispose(fn, failSilently);
    return true;
  }
  return false;
}
const localProvidedStateMap = /* @__PURE__ */ new WeakMap();
const injectLocal = /* @__NO_SIDE_EFFECTS__ */ (...args) => {
  var _getCurrentInstance;
  const key = args[0];
  const instance = (_getCurrentInstance = getCurrentInstance$1()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
  const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope();
  if (owner == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
  if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
  return inject(...args);
};
function provideLocal(key, value) {
  var _getCurrentInstance;
  const instance = (_getCurrentInstance = getCurrentInstance$1()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
  const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope();
  if (owner == null) throw new Error("provideLocal must be called in setup");
  if (!localProvidedStateMap.has(owner)) localProvidedStateMap.set(owner, /* @__PURE__ */ Object.create(null));
  const localProvidedState = localProvidedStateMap.get(owner);
  localProvidedState[key] = value;
  return provide(key, value);
}
// @__NO_SIDE_EFFECTS__
function createInjectionState(composable, options) {
  const key = (options === null || options === void 0 ? void 0 : options.injectionKey) || Symbol(composable.name || "InjectionState");
  const defaultValue = options === null || options === void 0 ? void 0 : options.defaultValue;
  const useProvidingState = (...args) => {
    const state = composable(...args);
    provideLocal(key, state);
    return state;
  };
  const useInjectedState = () => /* @__PURE__ */ injectLocal(key, defaultValue);
  return [useProvidingState, useInjectedState];
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), {
        fn,
        thisArg: this,
        args
      })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke$1) => {
  return invoke$1();
};
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer$1) => {
    clearTimeout(timer$1);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const filter = (invoke$1) => {
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
    if (timer) _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = void 0;
      }
      return Promise.resolve(invoke$1());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastInvoker = invoke$1;
      if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
        if (timer) _clearTimeout(timer);
        maxTimer = void 0;
        resolve(lastInvoker());
      }, maxDuration);
      timer = setTimeout(() => {
        if (maxTimer) _clearTimeout(maxTimer);
        maxTimer = void 0;
        resolve(invoke$1());
      }, duration);
    });
  };
  return filter;
}
function pxValue(px) {
  return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function getLifeCycleTarget(target) {
  return getCurrentInstance$1();
}
// @__NO_SIDE_EFFECTS__
function createSharedComposable(composable) {
  return composable;
}
// @__NO_SIDE_EFFECTS__
function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(debounceFilter(ms, options), fn);
}
function watchWithFilter(source, cb, options = {}) {
  const { eventFilter = bypassFilter, ...watchOptions } = options;
  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
function syncRefs(source, targets, options = {}) {
  const { flush = "sync", deep = false, immediate = true } = options;
  const targetsArray = toArray(targets);
  return watch(source, (newValue) => targetsArray.forEach((target) => target.value = newValue), {
    flush,
    deep,
    immediate
  });
}
function tryOnMounted(fn, sync = true, target) {
  if (getLifeCycleTarget()) ;
  else if (sync) fn();
  else nextTick(fn);
}
function useTimeoutFn(cb, interval, options = {}) {
  const { immediate = true, immediateCallback = false } = options;
  const isPending = shallowRef(false);
  let timer;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    if (immediateCallback) cb();
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = void 0;
      cb(...args);
    }, toValue(interval));
  }
  if (immediate) {
    isPending.value = true;
  }
  tryOnScopeDispose(stop);
  return {
    isPending: shallowReadonly(isPending),
    start,
    stop
  };
}
function watchDebounced(source, cb, options = {}) {
  const { debounce: debounce2 = 0, maxWait = void 0, ...watchOptions } = options;
  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: debounceFilter(debounce2, { maxWait })
  });
}
function watchImmediate(source, cb, options) {
  return watch(source, cb, {
    ...options,
    immediate: true
  });
}
function useContext(injectionName, params) {
  const isNewContext = !!params?.context;
  const _context = isNewContext ? ref(unref(params?.context)) : /* @__PURE__ */ injectLocal(injectionName, ref());
  provideLocal(injectionName, _context);
  if (params?.replace) {
    _context.value = unref(params.replace);
  }
  return _context;
}
function useCartFunction() {
  const { apiClient } = useShopwareContext();
  const _storeCart = useContext("swCart");
  const _storeCartErrors = useContext(
    "swCartErrors"
  );
  async function refreshCart(newCart) {
    if (newCart) {
      _storeCart.value = newCart;
      return newCart;
    }
    const { data } = await apiClient.invoke("readCart get /checkout/cart");
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }
  async function addProduct(params) {
    return addProducts([
      {
        id: params.id,
        quantity: params.quantity ?? 0,
        type: "product"
      }
    ]);
  }
  async function addProducts(items) {
    const { data: addToCartResult } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: {
          items
        }
      }
    );
    _storeCart.value = addToCartResult;
    setCartErrors(addToCartResult);
    return addToCartResult;
  }
  async function removeItem(lineItem) {
    const { data } = await apiClient.invoke(
      "removeLineItem post /checkout/cart/line-item/delete",
      {
        body: { ids: [lineItem.id] }
      }
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }
  async function removeItemById(id) {
    const { data } = await apiClient.invoke(
      "removeLineItem post /checkout/cart/line-item/delete",
      {
        body: { ids: [id] }
      }
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }
  async function changeProductQuantity(params) {
    const { data } = await apiClient.invoke(
      "updateLineItem patch /checkout/cart/line-item",
      {
        body: {
          items: [
            {
              id: params.id,
              quantity: +params.quantity
            }
          ]
        }
      }
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }
  async function submitPromotionCode(promotionCode) {
    const { data } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: {
          items: [
            {
              referencedId: promotionCode,
              type: "promotion"
            }
          ]
        }
      }
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }
  const appliedPromotionCodes = computed(() => {
    return cartItems.value.filter(
      (cartItem) => cartItem.type === "promotion"
    );
  });
  const cart = computed(
    () => _storeCart.value
  );
  const cartItems = computed(() => {
    return cart.value?.lineItems || [];
  });
  const count = computed(() => {
    return cartItems.value.reduce(
      (accumulator, lineItem) => lineItem.good === true ? lineItem.quantity + accumulator : accumulator,
      0
    );
  });
  const isEmpty = computed(() => count.value <= 0);
  const totalPrice = computed(() => {
    const cartPrice = cart.value?.price?.totalPrice;
    return cartPrice || 0;
  });
  const shippingTotal = computed(() => {
    const shippingTotal2 = cart.value?.deliveries?.[0]?.shippingCosts?.totalPrice;
    return shippingTotal2 || 0;
  });
  const shippingCosts = computed(() => {
    return cart.value?.deliveries || [];
  });
  const subtotal = computed(() => {
    const cartPrice = cart.value?.price?.positionPrice;
    return cartPrice || 0;
  });
  const isVirtualCart = computed(() => {
    return cartItems.value.length > 0 && cartItems.value.filter((element) => element.type !== "promotion").every((item) => item.states.includes("is-download"));
  });
  const setCartErrors = (cart2) => {
    if (Object.keys(cart2.errors || {}).length) {
      _storeCartErrors.value = Object.assign(
        _storeCartErrors.value ? _storeCartErrors.value : {},
        cart2.errors
      );
    }
  };
  const consumeCartErrors = () => {
    const errors = _storeCartErrors.value ? JSON.parse(JSON.stringify(_storeCartErrors.value)) : null;
    _storeCartErrors.value = null;
    return errors;
  };
  return {
    addProduct,
    addProducts,
    addPromotionCode: submitPromotionCode,
    appliedPromotionCodes,
    cart,
    cartItems,
    changeProductQuantity,
    count,
    refreshCart,
    removeItem,
    removeItemById,
    totalPrice,
    shippingTotal,
    subtotal,
    isEmpty,
    isVirtualCart,
    consumeCartErrors,
    shippingCosts
  };
}
const useCart = /* @__PURE__ */ createSharedComposable(useCartFunction);
const _wishlistItems$1 = ref([]);
function useLocalWishlist() {
  const updateStorage = () => {
    localStorage.setItem(
      "sw-wishlist-items",
      JSON.stringify(_wishlistItems$1.value)
    );
  };
  const getFromStorage = () => {
  };
  async function removeFromWishlist(id) {
    _wishlistItems$1.value = _wishlistItems$1.value?.filter(
      (itemId) => itemId !== id
    );
    updateStorage();
  }
  async function addToWishlist(id) {
    if (!_wishlistItems$1.value.includes(id)) {
      _wishlistItems$1.value.push(id);
      updateStorage();
    }
  }
  async function clearWishlist() {
    _wishlistItems$1.value = [];
    updateStorage();
  }
  function getWishlistProducts() {
    const currentWishlist = getFromStorage();
    if (Array.isArray(currentWishlist) && currentWishlist.length) {
      _wishlistItems$1.value = currentWishlist;
    }
  }
  const items = computed(() => _wishlistItems$1.value);
  const count = computed(() => items.value.length);
  return {
    getWishlistProducts,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    items,
    count
  };
}
const _wishlistItems = ref([]);
const _wishlistProducts = ref([]);
const _currentPage = ref(1);
const _limit = ref(15);
const totalWishlistItemsCount = ref(0);
const isLoading = ref(false);
function useSyncWishlist() {
  const { apiClient } = useShopwareContext();
  async function addToWishlistSync(id) {
    await apiClient.invoke(
      "addProductOnWishlist post /customer/wishlist/add/{productId}",
      {
        pathParams: { productId: id }
      }
    );
  }
  async function removeFromWishlistSync(id) {
    await apiClient.invoke(
      "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}",
      {
        pathParams: { productId: id }
      }
    );
  }
  async function getWishlistProducts(defaultSearchCriteria) {
    try {
      const response = await apiClient.invoke(
        "readCustomerWishlist post /customer/wishlist",
        { body: { ...defaultSearchCriteria, "total-count-mode": "exact" } }
      );
      _wishlistItems.value = [
        ...response.data.products.elements.map((element) => element.id)
      ];
      _wishlistProducts.value = response.data.products.elements;
      totalWishlistItemsCount.value = response.data.products.total ?? 0;
      _currentPage.value = response.data.products.page ?? 1;
      _limit.value = response.data.products.limit ?? 15;
    } catch (error) {
      _wishlistItems.value = [];
      _wishlistProducts.value = [];
      totalWishlistItemsCount.value = 0;
    }
  }
  async function mergeWishlistProducts(productIds) {
    await apiClient.invoke(
      "mergeProductOnWishlist post /customer/wishlist/merge",
      {
        body: { productIds }
      }
    );
  }
  const items = computed(() => _wishlistItems.value);
  const count = computed(() => totalWishlistItemsCount.value);
  const currentPage = computed(() => _currentPage.value);
  const products = computed(() => _wishlistProducts.value);
  const limit = computed(() => _limit.value);
  return {
    getWishlistProducts,
    addToWishlistSync,
    removeFromWishlistSync,
    mergeWishlistProducts,
    products,
    items,
    count,
    currentPage,
    isLoading,
    limit
  };
}
function useInternationalization(pathResolver) {
  const { devStorefrontUrl } = useShopwareContext();
  const { apiClient } = useShopwareContext();
  const _storeLanguages = useContext("swLanguages");
  const _storeCurrentLanguage = useContext(
    "swLanguagesCurrentLanguage"
  );
  const _storeCurrentPrefix = useContext("swLanguagesCurrentPrefix");
  function getStorefrontUrl() {
    return devStorefrontUrl ?? (void 0).location.origin ?? "";
  }
  async function getAvailableLanguages() {
    const { data } = await apiClient.invoke("readLanguages post /language");
    _storeLanguages.value = data.elements;
    return data;
  }
  async function changeLanguage(languageId) {
    const { data } = await apiClient.invoke("updateContext patch /context", {
      body: { languageId }
    });
    return data;
  }
  function getLanguageCodeFromId(languageId) {
    return _storeLanguages.value.find((element) => element?.id === languageId)?.translationCode?.code || "";
  }
  function getLanguageIdFromCode(languageCode) {
    return _storeLanguages.value.find(
      (element) => element.translationCode?.code === languageCode
    )?.id || "";
  }
  function replaceToDevStorefront(url) {
    const current = new URL(url);
    return devStorefrontUrl ? url.replace(`${current.protocol}//${current.host}`, devStorefrontUrl) : url;
  }
  function formatLink(link) {
    if (!pathResolver) return link;
    if (typeof link === "string") {
      if (urlIsAbsolute(link)) return link;
      return pathResolver(link);
    }
    if (link.path) {
      link.path = pathResolver(link.path);
      return link;
    }
    return link;
  }
  return {
    getAvailableLanguages,
    getStorefrontUrl,
    changeLanguage,
    getLanguageCodeFromId,
    getLanguageIdFromCode,
    replaceToDevStorefront,
    formatLink,
    languages: _storeLanguages,
    currentLanguage: _storeCurrentLanguage,
    currentPrefix: _storeCurrentPrefix
  };
}
function useSessionContext(newContext) {
  const { apiClient } = useShopwareContext();
  const _sessionContext = useContext("swSessionContext", {
    replace: newContext
  });
  const sessionContext = computed(() => _sessionContext.value);
  const refreshSessionContext = async () => {
    try {
      const { data } = await apiClient.invoke("readContext get /context");
      _sessionContext.value = data;
    } catch (e) {
    }
  };
  const selectedShippingMethod = computed(
    () => sessionContext.value?.shippingMethod || null
  );
  const setShippingMethod = async (shippingMethod) => {
    if (!shippingMethod?.id) {
      throw new Error(
        "You need to provide shipping method id in order to set shipping method."
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: { shippingMethodId: shippingMethod.id }
    });
    await refreshSessionContext();
  };
  const selectedPaymentMethod = computed(
    () => sessionContext.value?.paymentMethod || null
  );
  const setPaymentMethod = async (paymentMethod) => {
    if (!paymentMethod?.id) {
      throw new Error(
        "You need to provide payment method id in order to set payment method."
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: { paymentMethodId: paymentMethod.id }
    });
    await refreshSessionContext();
  };
  const currency = computed(() => sessionContext.value?.currency || null);
  const setCurrency = async (currency2) => {
    if (!currency2.id) {
      return;
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        currencyId: currency2.id
      }
    });
    await refreshSessionContext();
  };
  const setLanguage = async (language) => {
    if (!language.id) {
      return;
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        languageId: language.id
      }
    });
    await refreshSessionContext();
  };
  const setCountry = async (countryId2) => {
    await apiClient.invoke("updateContext patch /context", {
      body: {
        countryId: countryId2
      }
    });
    await refreshSessionContext();
  };
  const activeShippingAddress = computed(
    () => sessionContext.value?.customer?.activeShippingAddress || sessionContext.value?.shippingLocation?.address || null
  );
  const setActiveShippingAddress = async (address) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address."
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        shippingAddressId: address.id
      }
    });
    refreshSessionContext();
  };
  const activeBillingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress || null
  );
  const setActiveBillingAddress = async (address) => {
    if (!address?.id) {
      throw new Error(
        "You need to provide address id in order to set the address."
      );
    }
    await apiClient.invoke("updateContext patch /context", {
      body: {
        billingAddressId: address.id
      }
    });
    refreshSessionContext();
  };
  const setContext = (context) => {
    _sessionContext.value = context;
  };
  const countryId = computed(
    () => sessionContext.value?.shippingLocation?.country?.id
  );
  const salesChannelCountryId = computed(
    () => sessionContext.value?.salesChannel?.countryId
  );
  const languageId = computed(
    () => sessionContext.value?.salesChannel?.languageId
  );
  const languageIdChain = computed(
    () => sessionContext.value?.context?.languageIdChain?.[0] || ""
  );
  const taxState = computed(() => sessionContext.value?.context?.taxState);
  const userFromContext = computed(() => sessionContext.value?.customer);
  return {
    sessionContext,
    refreshSessionContext,
    selectedShippingMethod,
    setShippingMethod,
    selectedPaymentMethod,
    setPaymentMethod,
    currency,
    setCurrency,
    activeShippingAddress,
    setActiveShippingAddress,
    activeBillingAddress,
    setActiveBillingAddress,
    countryId,
    salesChannelCountryId,
    taxState,
    userFromContext,
    setLanguage,
    languageId,
    languageIdChain,
    setCountry,
    setContext
  };
}
function useUser() {
  const { apiClient } = useShopwareContext();
  const { userFromContext, refreshSessionContext } = useSessionContext();
  const _user = useContext("customer");
  syncRefs(userFromContext, _user, {
    immediate: true
  });
  const { getStorefrontUrl } = useInternationalization();
  const { refreshCart } = useCart();
  const userDefaultPaymentMethod = computed(
    () => user.value?.lastPaymentMethod?.translated || // @ts-expect-error TODO: [MAJOR] Removed since 6.7
    user.value?.defaultPaymentMethod?.translated || null
  );
  const userDefaultBillingAddress = computed(
    () => user.value?.defaultBillingAddress || null
  );
  const userDefaultShippingAddress = computed(
    () => user.value?.defaultShippingAddress || null
  );
  const country = ref(null);
  const salutation = ref(null);
  const user = computed(() => _user.value);
  async function login({
    username,
    password
  }) {
    await apiClient.invoke("loginCustomer post /account/login", {
      body: {
        username,
        password
      }
    });
    await refreshSessionContext();
    refreshCart();
  }
  async function register(params) {
    const { data } = await apiClient.invoke("register post /account/register", {
      body: {
        ...params,
        storefrontUrl: getStorefrontUrl()
      }
    });
    if (data.active && !data.doubleOptInRegistration) {
      _user.value = data;
    }
    await refreshSessionContext();
    return data;
  }
  async function logout() {
    const response = await apiClient.invoke(
      "logoutCustomer post /account/logout"
    );
    await refreshSessionContext();
    refreshCart();
    return response.data;
  }
  async function refreshUser(params = {}) {
    try {
      const response = await apiClient.invoke(
        "readCustomer post /account/customer",
        { body: params }
      );
      _user.value = response.data;
      return response.data;
    } catch (e) {
      _user.value = void 0;
      throw e;
    }
  }
  async function loadCountry(countryId) {
    const countries = await apiClient.invoke("readCountry post /country", {
      body: {
        filter: [
          {
            field: "id",
            type: "equals",
            value: countryId
          }
        ]
      }
    });
    country.value = countries.data.elements?.[0] ?? null;
    return countries.data;
  }
  async function loadSalutation(salutationId) {
    const salutations = await apiClient.invoke(
      "readSalutation post /salutation",
      {
        body: {
          filter: [
            {
              field: "id",
              type: "equals",
              value: salutationId
            }
          ]
        }
      }
    );
    salutation.value = salutations.data.elements?.[0] ?? null;
    return salutations.data;
  }
  async function updatePersonalInfo(personals) {
    await apiClient.invoke("changeProfile post /account/change-profile", {
      body: personals
    });
  }
  async function updateEmail(updateEmailData) {
    await apiClient.invoke("changeEmail post /account/change-email", {
      body: updateEmailData
    });
  }
  async function setDefaultPaymentMethod(paymentMethodId) {
    await apiClient.invoke(
      // @ts-expect-error TODO: [MAJOR] Removed since 6.7
      "changePaymentMethod post /account/change-payment-method/{paymentMethodId}",
      {
        pathParams: { paymentMethodId }
      }
    );
  }
  const defaultBillingAddressId = computed(
    () => user.value?.defaultBillingAddressId || null
  );
  const defaultShippingAddressId = computed(
    () => user.value?.defaultShippingAddressId || null
  );
  const isLoggedIn = computed(
    () => !!user.value?.id && !!user.value.active && !user.value.guest
  );
  const isCustomerSession = computed(
    () => !!user.value?.id && !user.value.guest
  );
  const isGuestSession = computed(() => !!user.value?.guest);
  return {
    login,
    register,
    user,
    isLoggedIn,
    isCustomerSession,
    isGuestSession,
    refreshUser,
    logout,
    updateEmail,
    updatePersonalInfo,
    loadSalutation,
    salutation,
    loadCountry,
    country,
    defaultBillingAddressId,
    defaultShippingAddressId,
    userDefaultPaymentMethod,
    userDefaultBillingAddress,
    setDefaultPaymentMethod,
    userDefaultShippingAddress
  };
}
function useWishlist() {
  const { isLoggedIn, isGuestSession } = useUser();
  const canSyncWishlist = computed(
    () => isLoggedIn.value && !isGuestSession.value
  );
  const {
    getWishlistProducts: getWishlistProductsLocal,
    items: itemsLocal,
    clearWishlist: clearWishlistLocal
  } = useLocalWishlist();
  const {
    getWishlistProducts: getWishlistProductsSync,
    items: itemsSync,
    mergeWishlistProducts: mergeWishlistProductsSync,
    removeFromWishlistSync,
    count: countSync,
    currentPage,
    products,
    limit: limitSync
  } = useSyncWishlist();
  const limit = ref(15);
  const getWishlistProducts = async (query) => {
    let wishlistQuery = {
      limit: limit.value
    };
    if (query) {
      wishlistQuery = defu(query, wishlistQuery);
      if (query.limit) {
        limit.value = query.limit;
      }
    }
    if (canSyncWishlist.value) {
      await getWishlistProductsSync(wishlistQuery);
    } else {
      getWishlistProductsLocal();
    }
  };
  const items = computed(
    () => canSyncWishlist.value ? itemsSync.value : itemsLocal.value
  );
  const totalPagesCount = computed(() => Math.ceil(count.value / limit.value));
  const clearWishlist = async () => {
    if (canSyncWishlist.value) {
      await Promise.all(items.value.map((id) => removeFromWishlistSync(id)));
      await getWishlistProductsSync();
    } else {
      clearWishlistLocal();
    }
  };
  const mergeWishlistProducts = async () => {
    if (itemsLocal.value?.length) {
      await mergeWishlistProductsSync(itemsLocal.value);
      clearWishlist();
    }
    await getWishlistProductsSync();
  };
  const count = computed(() => {
    if (canSyncWishlist.value) {
      return countSync.value;
    }
    return items.value.length;
  });
  return {
    mergeWishlistProducts,
    getWishlistProducts,
    clearWishlist,
    items,
    currentPage,
    totalPagesCount,
    count,
    canSyncWishlist,
    products,
    limit: limitSync
  };
}
function useNotifications() {
  const _notifications = inject(
    "swNotifications",
    ref([])
  );
  provide("swNotifications", _notifications);
  function removeOne(notificationId) {
    _notifications.value = _notifications.value?.filter(({ id }) => id !== notificationId) || [];
  }
  function removeAll() {
    _notifications.value = [];
  }
  function geterateId() {
    return +`${(/* @__PURE__ */ new Date()).getTime()}${Math.random() * 1e3}`;
  }
  async function pushNotification(message, options) {
    const timeout = options.timeout || 2500;
    const persistent = !!options.persistent;
    _notifications.value = _notifications.value || [];
    const messageId = geterateId();
    _notifications.value.push({
      id: messageId,
      type: options.type,
      message
    });
    if (!persistent) {
      setTimeout(() => {
        removeOne(messageId);
      }, timeout);
    }
  }
  return {
    removeOne,
    removeAll,
    pushInfo: (message, options = {}) => pushNotification(message, { ...options, type: "info" }),
    pushSuccess: (message, options = {}) => pushNotification(message, { ...options, type: "success" }),
    pushWarning: (message, options = {}) => pushNotification(message, { ...options, type: "warning" }),
    pushError: (message, options = {}) => pushNotification(message, { ...options, type: "danger" }),
    notifications: computed(() => _notifications.value || [])
  };
}
function getPrefix(locales, name, fallbackLocale) {
  if (name.includes(fallbackLocale)) return "";
  const index = locales.findIndex((element) => name.includes(element));
  if (!locales[index]) return "";
  return index >= 0 ? locales[index] : "";
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "SLICKLY",
      meta: [{ name: "description", content: "SLICKLY" }],
      htmlAttrs: {
        lang: "sk"
      }
    });
    const { apiClient } = useShopwareContext();
    const sessionContextData = ref();
    const { refreshCart } = useCart();
    useWishlist();
    useNotifications();
    const {
      getAvailableLanguages,
      getLanguageCodeFromId,
      getLanguageIdFromCode,
      changeLanguage,
      languages: storeLanguages
    } = useInternationalization();
    const backendError = ref(null);
    try {
      const contextResponse = ([__temp, __restore] = withAsyncContext(() => apiClient.invoke("readContext get /context")), __temp = await __temp, __restore(), __temp);
      sessionContextData.value = contextResponse.data;
    } catch (e) {
      backendError.value = {
        message: String(e?.details?.title || e?.message || e),
        status: e?.statusCode ?? e?.status ?? e?.response?.status ?? null
      };
    }
    provide("backendError", backendError);
    const { data: languagesData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("languages", async () => {
      try {
        return await getAvailableLanguages();
      } catch {
        return null;
      }
    })), __temp = await __temp, __restore(), __temp);
    const languages = unref(languagesData);
    try {
      if (sessionContextData.value) {
        useSessionContext(sessionContextData.value);
      }
    } catch (e) {
    }
    const { locale, availableLocales, defaultLocale, localeProperties, messages } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const isLikelyProductRoute = computed(() => {
      const targetPath = router.currentRoute.value.path;
      const locale2 = getLocaleFromPath(targetPath);
      let path = targetPath;
      if (path === `/${locale2}` || path.startsWith(`/${locale2}/`)) {
        path = path.slice(locale2.length + 1);
      }
      const segments = path.split("/").filter(Boolean);
      return segments.length === 2 && segments[1].length >= 3;
    });
    const { languageIdChain, refreshSessionContext } = useSessionContext();
    let languageToChangeId = null;
    try {
      if (sessionContextData.value && languages && router.currentRoute.value.name) {
        storeLanguages.value = languages.elements;
        const prefix = getPrefix(
          availableLocales,
          router.currentRoute.value.name,
          defaultLocale
        );
        provide(
          "cmsTranslations",
          messages.value[prefix || defaultLocale] ?? {}
        );
        if (localeProperties.value.localeId) {
          if (languageIdChain.value !== localeProperties.value.localeId) {
            languageToChangeId = localeProperties.value.localeId;
          }
        } else {
          const sessionLanguage = getLanguageCodeFromId(languageIdChain.value);
          if (sessionLanguage !== prefix) {
            languageToChangeId = getLanguageIdFromCode(prefix ? prefix : defaultLocale);
          }
        }
        if (languageToChangeId) {
          try {
            apiClient.defaultHeaders.apply({ "sw-language-id": languageToChangeId });
            ;
            [__temp, __restore] = withAsyncContext(() => changeLanguage(languageToChangeId)), await __temp, __restore();
            ;
            [__temp, __restore] = withAsyncContext(() => refreshSessionContext()), await __temp, __restore();
          } catch (e) {
          }
        }
        locale.value = prefix ? prefix : defaultLocale;
        provide("urlPrefix", prefix);
      }
    } catch (e) {
      locale.value = defaultLocale;
    }
    const showDebug = computed(() => route.query.debug !== void 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtRouteAnnouncer = __nuxt_component_0$2;
      const _component_NuxtLoadingIndicator = __nuxt_component_1;
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent));
      if (unref(backendError)) {
        _push(`<div class="bg-amber text-black text-center text-xs font-sans px-4 py-2 leading-snug" role="status"> Práve dolaďujeme katalóg — niektoré dáta môžu byť dočasne nedostupné. `);
        if (unref(showDebug)) {
          _push(`<!--[--><br><span class="font-tech">[${ssrInterpolate(unref(backendError).status ?? "ERR")}]</span> ${ssrInterpolate(unref(backendError).message)} — detail: <a href="/api/debug/shopware" class="underline">/api/debug/shopware</a><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLoadingIndicator, {
        color: "#FFBF00",
        height: 3
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSuspense(_push2, {
              fallback: () => {
                if (unref(isLikelyProductRoute)) {
                  _push2(ssrRenderComponent(ProductDetailSkeleton, null, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              },
              default: () => {
                _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
              },
              _: 1
            });
          } else {
            return [
              (openBlock(), createBlock(Suspense, null, {
                fallback: withCtx(() => [
                  unref(isLikelyProductRoute) ? (openBlock(), createBlock(ProductDetailSkeleton, { key: 0 })) : createCommentVNode("", true)
                ]),
                default: withCtx(() => [
                  createVNode(_component_NuxtPage)
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const is404 = computed(() => props.error?.statusCode === 404);
    if (props.error?.statusCode >= 500) ;
    const showDebug = computed(() => route.query.debug !== void 0);
    const handleError = () => clearError({ redirect: "/" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="min-h-[70vh] flex items-center justify-center bg-white py-24"${_scopeId}><div class="container mx-auto px-4 lg:px-8 text-center"${_scopeId}><div class="relative mb-8 select-none"${_scopeId}><span class="text-[180px] md:text-[240px] font-tech font-black italic text-gray-100 leading-none"${_scopeId}>${ssrInterpolate(__props.error.statusCode)}</span><div class="absolute inset-0 flex items-center justify-center"${_scopeId}><div class="w-20 h-1 bg-brand"${_scopeId}></div></div></div><h1 class="font-tech font-black uppercase italic text-3xl md:text-5xl text-black leading-none mb-4"${_scopeId}>${ssrInterpolate(unref(is404) ? "Stránka sa nenašla" : "Ups! Niečo sa pokazilo")}</h1><div class="section-decorator mx-auto mb-6"${_scopeId}></div><p class="text-gray-500 font-sans text-lg mb-10 max-w-md mx-auto"${_scopeId}>${ssrInterpolate(unref(is404) ? "Požadovaná stránka nebola nájdená." : "Nastala dočasná chyba. Skúste to prosím znova.")}</p><button class="btn-checkout inline-flex items-center justify-center gap-2 px-8 py-4 max-w-xs mx-auto"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(HomeIcon), {
              class: "w-4 h-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Späť na domovskú stránku </button>`);
            if (unref(showDebug)) {
              _push2(`<pre class="mt-10 mx-auto max-w-2xl text-left text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-default p-4 overflow-x-auto whitespace-pre-wrap"${_scopeId}>[${ssrInterpolate(__props.error.statusCode)}] ${ssrInterpolate(__props.error.statusMessage || __props.error.message)}
url: ${ssrInterpolate(__props.error.url || unref(route).fullPath)}</pre>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section>`);
          } else {
            return [
              createVNode("section", { class: "min-h-[70vh] flex items-center justify-center bg-white py-24" }, [
                createVNode("div", { class: "container mx-auto px-4 lg:px-8 text-center" }, [
                  createVNode("div", { class: "relative mb-8 select-none" }, [
                    createVNode("span", { class: "text-[180px] md:text-[240px] font-tech font-black italic text-gray-100 leading-none" }, toDisplayString$1(__props.error.statusCode), 1),
                    createVNode("div", { class: "absolute inset-0 flex items-center justify-center" }, [
                      createVNode("div", { class: "w-20 h-1 bg-brand" })
                    ])
                  ]),
                  createVNode("h1", { class: "font-tech font-black uppercase italic text-3xl md:text-5xl text-black leading-none mb-4" }, toDisplayString$1(unref(is404) ? "Stránka sa nenašla" : "Ups! Niečo sa pokazilo"), 1),
                  createVNode("div", { class: "section-decorator mx-auto mb-6" }),
                  createVNode("p", { class: "text-gray-500 font-sans text-lg mb-10 max-w-md mx-auto" }, toDisplayString$1(unref(is404) ? "Požadovaná stránka nebola nájdená." : "Nastala dočasná chyba. Skúste to prosím znova."), 1),
                  createVNode("button", {
                    class: "btn-checkout inline-flex items-center justify-center gap-2 px-8 py-4 max-w-xs mx-auto",
                    onClick: handleError
                  }, [
                    createVNode(unref(HomeIcon), {
                      class: "w-4 h-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Späť na domovskú stránku ")
                  ]),
                  unref(showDebug) ? (openBlock(), createBlock("pre", {
                    key: 0,
                    class: "mt-10 mx-auto max-w-2xl text-left text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-default p-4 overflow-x-auto whitespace-pre-wrap"
                  }, "[" + toDisplayString$1(__props.error.statusCode) + "] " + toDisplayString$1(__props.error.statusMessage || __props.error.message) + "\nurl: " + toDisplayString$1(__props.error.url || unref(route).fullPath), 1)) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => void 0);
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  A: createError,
  B: useWishlist,
  C: useRequestURL,
  D: useRequestEvent,
  E: createSharedComposable,
  F: useCookie,
  G: resolveRouteObject,
  H: hashMode,
  I: nuxtLinkDefaults,
  J: noop,
  K: toArray,
  L: watchImmediate,
  M: tryOnMounted,
  N: pxValue,
  O: injectLocal,
  P: tryOnScopeDispose,
  Q: isObject,
  R: getProductUrl,
  S: useTimeoutFn,
  T: useContext,
  U: createInjectionState,
  V: useLocalWishlist,
  W: useSyncWishlist,
  X: defineNuxtRouteMiddleware,
  Y: ContextError,
  Z: useLocaleHead,
  _: _export_sfc,
  a: useCart,
  b: useLocalePath,
  c: useRouter,
  d: useRoute,
  default: entry_default,
  e: useShopwareContext,
  f: useUser,
  g: useState,
  h: useAsyncData,
  i: useRuntimeConfig,
  j: useAppConfig,
  k: useI18n,
  l: useSeoMeta,
  m: useNuxtApp,
  n: navigateTo,
  o: useDebounceFn,
  p: getCategoryUrl,
  q: __nuxt_component_0$1,
  r: useSessionContext,
  s: slugify,
  t: useNotifications,
  u: useHead,
  v: __nuxt_component_0,
  w: watchDebounced,
  x: useInternationalization,
  y: getLanguageIdFromPath,
  z: getLocaleFromPath
}, Symbol.toStringTag, { value: 'Module' }));

export { server as $, pxValue as A, injectLocal as B, useSeoMeta as C, useAppConfig as D, getProductUrl as E, slugify as F, getCategoryUrl as G, watchDebounced as H, __nuxt_component_0$1 as I, useTimeoutFn as J, useNotifications as K, __nuxt_component_0 as L, useInternationalization as M, defu as N, getLanguageIdFromPath as O, getLocaleFromPath as P, createError as Q, useContext as R, createInjectionState as S, useWishlist as T, useLocalWishlist as U, useSyncWishlist as V, useRequestURL as W, defineNuxtRouteMiddleware as X, ContextError as Y, useLocaleHead as Z, _export_sfc as _, useCart as a, useLocalePath as b, useRouter as c, useRoute as d, useShopwareContext as e, useUser as f, useState as g, useAsyncData as h, useRuntimeConfig as i, useNuxtApp as j, createSharedComposable as k, useSessionContext as l, useI18n as m, navigateTo as n, useDebounceFn as o, useCookie as p, hashMode as q, resolveRouteObject as r, nuxtLinkDefaults as s, noop as t, useHead as u, toArray as v, watchImmediate as w, isObject as x, tryOnMounted as y, tryOnScopeDispose as z };
