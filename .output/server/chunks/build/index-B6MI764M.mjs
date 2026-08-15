import { t as noop, v as toArray, w as watchImmediate, x as isObject, y as tryOnMounted, z as tryOnScopeDispose, A as pxValue, B as injectLocal } from './server.mjs';
import { computed, toValue, unref, shallowRef, watch, reactive, watchEffect, hasInjectionContext, getCurrentInstance } from 'vue';

const defaultWindow = void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test = toArray(toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  return watchImmediate(() => {
    var _firstParamTargets$va, _firstParamTargets$va2;
    return [
      (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
      toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
      toArray(unref(firstParamTargets.value ? args[2] : args[1])),
      toValue(firstParamTargets.value ? args[3] : args[2])
    ];
  }, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
    if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
    const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
    const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
    onCleanup(() => {
      cleanups.forEach((fn) => fn());
    });
  }, { flush: "post" });
}
function onClickOutside(target, handler, options = {}) {
  const { window: window$1 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
  if (!window$1) return controls ? {
    stop: noop,
    cancel: noop,
    trigger: noop
  } : noop;
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return toValue(ignore).some((target$1) => {
      if (typeof target$1 === "string") return Array.from(window$1.document.querySelectorAll(target$1)).some((el) => el === event.target || event.composedPath().includes(el));
      else {
        const el = unrefElement(target$1);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  function hasMultipleRoots(target$1) {
    const vm = toValue(target$1);
    return vm && vm.$.subTree.shapeFlag === 16;
  }
  function checkMultipleRoots(target$1, event) {
    const vm = toValue(target$1);
    const children = vm.$.subTree && vm.$.subTree.children;
    if (children == null || !Array.isArray(children)) return false;
    return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
  }
  const listener = (event) => {
    const el = unrefElement(target);
    if (event.target == null) return;
    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;
    if (!el || el === event.target || event.composedPath().includes(el)) return;
    if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  let isProcessingClick = false;
  const cleanup = [
    useEventListener(window$1, "click", (event) => {
      if (!isProcessingClick) {
        isProcessingClick = true;
        setTimeout(() => {
          isProcessingClick = false;
        }, 0);
        listener(event);
      }
    }, {
      passive: true,
      capture
    }),
    useEventListener(window$1, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window$1, "blur", (event) => {
      setTimeout(() => {
        var _window$document$acti;
        const el = unrefElement(target);
        if (((_window$document$acti = window$1.document.activeElement) === null || _window$document$acti === void 0 ? void 0 : _window$document$acti.tagName) === "IFRAME" && !(el === null || el === void 0 ? void 0 : el.contains(window$1.document.activeElement))) handler(event);
      }, 0);
    }, { passive: true })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  if (controls) return {
    stop,
    cancel: () => {
      shouldListen = false;
    },
    trigger: (event) => {
      shouldListen = true;
      listener(event);
      shouldListen = false;
    }
  };
  return stop;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = shallowRef(false);
  getCurrentInstance();
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
const ssrWidthSymbol = /* @__PURE__ */ Symbol("vueuse-ssr-width");
// @__NO_SIDE_EFFECTS__
function useSSRWidth() {
  const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
  return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
function useMediaQuery(query, options = {}) {
  const { window: window$1 = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "matchMedia" in window$1 && typeof window$1.matchMedia === "function");
  const ssrSupport = shallowRef(typeof ssrWidth === "number");
  const mediaQuery = shallowRef();
  const matches = shallowRef(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  watchEffect(() => {
    if (ssrSupport.value) {
      ssrSupport.value = !isSupported.value;
      matches.value = toValue(query).split(",").some((queryString) => {
        const not = queryString.includes("not all");
        const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let res = Boolean(minWidth || maxWidth);
        if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
        if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
        return not ? !res : res;
      });
      return;
    }
    if (!isSupported.value) return;
    mediaQuery.value = window$1.matchMedia(toValue(query));
    matches.value = mediaQuery.value.matches;
  });
  useEventListener(mediaQuery, "change", handler, { passive: true });
  return computed(() => matches.value);
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window$1 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "ResizeObserver" in window$1);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = watch(computed(() => {
    const _targets = toValue(target);
    return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
  }), (els) => {
    cleanup();
    if (isSupported.value && window$1) {
      observer = new ResizeObserver(callback);
      for (const _el of els) if (_el) observer.observe(_el, observerOptions);
    }
  }, {
    immediate: true,
    flush: "post"
  });
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
function useElementSize(target, initialSize = {
  width: 0,
  height: 0
}, options = {}) {
  const { window: window$1 = defaultWindow, box = "content-box" } = options;
  const isSVG = computed(() => {
    var _unrefElement;
    return (_unrefElement = unrefElement(target)) === null || _unrefElement === void 0 || (_unrefElement = _unrefElement.namespaceURI) === null || _unrefElement === void 0 ? void 0 : _unrefElement.includes("svg");
  });
  const width = shallowRef(initialSize.width);
  const height = shallowRef(initialSize.height);
  const { stop: stop1 } = useResizeObserver(target, ([entry]) => {
    const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
    if (window$1 && isSVG.value) {
      const $elem = unrefElement(target);
      if ($elem) {
        const rect = $elem.getBoundingClientRect();
        width.value = rect.width;
        height.value = rect.height;
      }
    } else if (boxSize) {
      const formatBoxSize = toArray(boxSize);
      width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
      height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
    } else {
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }
  }, options);
  tryOnMounted(() => {
    const ele = unrefElement(target);
    if (ele) {
      width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
      height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
    }
  });
  const stop2 = watch(() => unrefElement(target), (ele) => {
    width.value = ele ? initialSize.width : 0;
    height.value = ele ? initialSize.height : 0;
  });
  function stop() {
    stop1();
    stop2();
  }
  return {
    width,
    height,
    stop
  };
}
const DefaultMagicKeysAliasMap = {
  ctrl: "control",
  command: "meta",
  cmd: "meta",
  option: "alt",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright"
};
function useMagicKeys(options = {}) {
  const { reactive: useReactive = false, target = defaultWindow, aliasMap = DefaultMagicKeysAliasMap, passive = true, onEventFired = noop } = options;
  const current = reactive(/* @__PURE__ */ new Set());
  const obj = {
    toJSON() {
      return {};
    },
    current
  };
  const refs = useReactive ? reactive(obj) : obj;
  const metaDeps = /* @__PURE__ */ new Set();
  const depsMap = /* @__PURE__ */ new Map([
    ["Meta", metaDeps],
    ["Shift", /* @__PURE__ */ new Set()],
    ["Alt", /* @__PURE__ */ new Set()]
  ]);
  const usedKeys = /* @__PURE__ */ new Set();
  function setRefs(key, value) {
    if (key in refs) if (useReactive) refs[key] = value;
    else refs[key].value = value;
  }
  function reset() {
    current.clear();
    for (const key of usedKeys) setRefs(key, false);
  }
  function updateDeps(value, e, keys$1) {
    if (!value || typeof e.getModifierState !== "function") return;
    for (const [modifier, depsSet] of depsMap) if (e.getModifierState(modifier)) {
      keys$1.forEach((key) => depsSet.add(key));
      break;
    }
  }
  function clearDeps(value, key) {
    if (value) return;
    const depsMapKey = `${key[0].toUpperCase()}${key.slice(1)}`;
    const deps = depsMap.get(depsMapKey);
    if (!["shift", "alt"].includes(key) || !deps) return;
    const depsArray = Array.from(deps);
    const depsIndex = depsArray.indexOf(key);
    depsArray.forEach((key$1, index) => {
      if (index >= depsIndex) {
        current.delete(key$1);
        setRefs(key$1, false);
      }
    });
    deps.clear();
  }
  function updateRefs(e, value) {
    var _e$key, _e$code;
    const key = (_e$key = e.key) === null || _e$key === void 0 ? void 0 : _e$key.toLowerCase();
    const values = [(_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.toLowerCase(), key].filter(Boolean);
    if (key === "") return;
    if (key) if (value) current.add(key);
    else current.delete(key);
    for (const key$1 of values) {
      usedKeys.add(key$1);
      setRefs(key$1, value);
    }
    updateDeps(value, e, [...current, ...values]);
    clearDeps(value, key);
    if (key === "meta" && !value) {
      metaDeps.forEach((key$1) => {
        current.delete(key$1);
        setRefs(key$1, false);
      });
      metaDeps.clear();
    }
  }
  useEventListener(target, "keydown", (e) => {
    updateRefs(e, true);
    return onEventFired(e);
  }, { passive });
  useEventListener(target, "keyup", (e) => {
    updateRefs(e, false);
    return onEventFired(e);
  }, { passive });
  useEventListener("blur", reset, { passive });
  useEventListener("focus", reset, { passive });
  const proxy = new Proxy(refs, { get(target$1, prop, rec) {
    if (typeof prop !== "string") return Reflect.get(target$1, prop, rec);
    prop = prop.toLowerCase();
    if (prop in aliasMap) prop = aliasMap[prop];
    if (!(prop in refs)) if (/[+_-]/.test(prop)) {
      const keys$1 = prop.split(/[+_-]/g).map((i) => i.trim());
      refs[prop] = computed(() => keys$1.map((key) => toValue(proxy[key])).every(Boolean));
    } else refs[prop] = shallowRef(false);
    const r = Reflect.get(target$1, prop, rec);
    return useReactive ? toValue(r) : r;
  } });
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function useWindowSize(options = {}) {
  const { window: window$1 = defaultWindow, initialWidth = Number.POSITIVE_INFINITY, initialHeight = Number.POSITIVE_INFINITY, listenOrientation = true, includeScrollbar = true, type = "inner" } = options;
  const width = shallowRef(initialWidth);
  const height = shallowRef(initialHeight);
  const update = () => {
    if (window$1) if (type === "outer") {
      width.value = window$1.outerWidth;
      height.value = window$1.outerHeight;
    } else if (type === "visual" && window$1.visualViewport) {
      const { width: visualViewportWidth, height: visualViewportHeight, scale } = window$1.visualViewport;
      width.value = Math.round(visualViewportWidth * scale);
      height.value = Math.round(visualViewportHeight * scale);
    } else if (includeScrollbar) {
      width.value = window$1.innerWidth;
      height.value = window$1.innerHeight;
    } else {
      width.value = window$1.document.documentElement.clientWidth;
      height.value = window$1.document.documentElement.clientHeight;
    }
  };
  update();
  tryOnMounted(update);
  const listenerOptions = { passive: true };
  useEventListener("resize", update, listenerOptions);
  if (window$1 && type === "visual" && window$1.visualViewport) useEventListener(window$1.visualViewport, "resize", update, listenerOptions);
  if (listenOrientation) watch(useMediaQuery("(orientation: portrait)"), () => update());
  return {
    width,
    height
  };
}

export { useElementSize as a, useMagicKeys as b, useEventListener as c, onClickOutside as o, useWindowSize as u };
