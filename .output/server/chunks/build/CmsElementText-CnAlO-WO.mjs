import { defineComponent, getCurrentInstance, computed, mergeProps, unref, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { decodeHTML } from 'entities';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { u as useUrlResolver } from './useUrlResolver-CibZ14y1.mjs';
import { _ as _export_sfc } from './server.mjs';
import '@shopware/helpers';
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

var htmlVoidElements = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'image', 'img', 'input', 'isindex', 'keygen', 'link', 'menuitem', 'meta', 'nextid', 'param', 'source', 'track', 'wbr'];

var attrRE = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;
var parseTag = function parseTag(tag) {
  var res = {
    type: 'tag',
    name: '',
    voidElement: false,
    attrs: {},
    children: []
  };
  var tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);

  if (tagMatch) {
    res.name = tagMatch[1];
    res.voidElement = htmlVoidElements.includes(tagMatch[1]) || tag.charAt(tag.length - 2) === '/'; // handle comment tag

    if (res.name.startsWith('!--')) {
      var endIndex = tag.indexOf('-->');
      return {
        type: 'comment',
        comment: endIndex !== -1 ? tag.slice(4, endIndex) : ''
      };
    }
  }

  var reg = new RegExp(attrRE);
  var result = null;

  for (;;) {
    result = reg.exec(tag);

    if (result === null) {
      break;
    }

    if (!result[0].trim()) {
      continue;
    }

    if (result[1]) {
      var attr = result[1].trim();
      var arr = [attr, ''];

      if (attr.indexOf('=') > -1) {
        arr = attr.split('=');
      }

      res.attrs[arr[0]] = arr[1];
      reg.lastIndex--;
    } else if (result[2]) {
      res.attrs[result[2]] = result[3].trim().substring(1, result[3].length - 1);
    }
  }

  return res;
};

var tagRE = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
var whitespaceRE = /^\s*$/; // re-used obj for quick lookups of components

var empty = /*#__PURE__*/Object.create(null);
var parse = function parse(html, options) {
  if (options === void 0) {
    options = {};
  }

  options || (options = {});
  options.components || (options.components = empty);
  var result = [];
  var arr = [];
  var current;
  var level = -1;
  var inComponent = false; // handle text at top level

  if (html.indexOf('<') !== 0) {
    var end = html.indexOf('<');
    result.push({
      type: 'text',
      content: end === -1 ? html : html.substring(0, end)
    });
  } // @ts-ignore


  html.replace(tagRE, function (tag, index) {
    if (inComponent) {
      if (tag !== '</' + current.name + '>') {
        return '';
      } else {
        inComponent = false;
      }
    }

    var isOpen = tag.charAt(1) !== '/';
    var isComment = tag.startsWith('<!--');
    var start = index + tag.length;
    var nextChar = html.charAt(start);
    var parent;

    if (isComment) {
      var comment = parseTag(tag); // if we're at root, push new base node

      if (level < 0) {
        result.push(comment);
        return result;
      }

      parent = arr[level];

      if (parent && parent.children && Array.isArray(parent.children)) {
        parent.children.push(comment);
      }

      return result;
    }

    if (isOpen) {
      level++;
      current = parseTag(tag);

      if (current.type === 'tag' && current.name && options.components && options.components[current.name]) {
        current.type = 'component';
        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<' && Array.isArray(current.children)) {
        current.children.push({
          type: 'text',
          content: html.slice(start, html.indexOf('<', start))
        });
      } // if we're at root, push new base node


      if (level === 0) {
        result.push(current);
      }

      parent = arr[level - 1];

      if (parent && parent.children) {
        parent.children.push(current);
      }

      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      if (level > -1 && (current.voidElement || current.name === tag.slice(2, -1))) {
        level--; // move current up a level to match the end tag

        current = level === -1 ? result : arr[level];
      }

      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        parent = level === -1 ? result : arr[level].children; // calculate correct end of the content slice in case there's
        // no tag after the text node.

        var _end = html.indexOf('<', start);

        var content = html.slice(start, _end === -1 ? undefined : _end); // if a node is nothing but whitespace, collapse it as the spec states:
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1

        if (whitespaceRE.test(content)) {
          content = ' ';
        } // don't add whitespace-only text nodes if they would be trailing text nodes
        // or if they would be leading whitespace-only text nodes:
        //  * end > -1 indicates this is not a trailing text node
        //  * leading node is when level is -1 and parent has length 0


        if (_end > -1 && level + parent.length >= 0 || content !== ' ') {
          if (parent && Array.isArray(parent)) {
            parent.push({
              type: 'text',
              content: content
            });
          }
        }
      }
    }
  });
  return result;
};

function getOptionsFromNode(node, resolveUrl) {
  const response = {
    attrs: {}
  };
  try {
    if (!node?.attrs) {
      return response;
    }
    const { align, style, class: classNames, href, ...attrs } = node.attrs;
    if (align) {
      response.align = align;
    }
    if (style) {
      response.style = style;
    }
    if (classNames) {
      response.class = classNames;
    }
    if (attrs && Object.keys(attrs).length > 0) {
      response.attrs = attrs;
    }
    if (href) {
      response.attrs.href = resolveUrl(href);
    }
  } catch (e) {
  }
  return response;
}
function _visitAST(ast, callback) {
  function _visit(node, parent, key, index) {
    callback(node, parent, key, index);
    if (Array.isArray(node)) {
      node.forEach((value, idx) => {
        _visit(value, node, null, idx);
      });
    } else if (isNode(node)) {
      const keys = Object.keys(node);
      for (let i = 0; i < keys.length; i++) {
        const childKey = keys[i];
        if (childKey === void 0) continue;
        const child = node[childKey];
        if (Array.isArray(child)) {
          for (let j = 0; j < child.length; j++) {
            _visit(child[j], node, key, j);
          }
        } else if (isNode(child)) {
          _visit(child, node, key, void 0);
        }
      }
    }
  }
  _visit(ast, null, null, void 0);
}
function isNode(node) {
  return typeof node === "object" && node !== null && typeof node.type !== "undefined";
}
function generateAST(html) {
  return parse(html);
}
function rectifyAST(ast, config) {
  const _ast = JSON.parse(JSON.stringify(ast));
  const keys = config.extraComponentsMap ? Object.keys(config.extraComponentsMap) : [];
  _visitAST(_ast, (node) => {
    if (!isNode(node)) {
      return;
    }
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (currentKey === void 0) continue;
      const componentConfig = config.extraComponentsMap?.[currentKey];
      if (componentConfig?.conditions(node)) {
        node.name = currentKey;
      }
    }
  });
  return _ast;
}
function flattenChildren(children) {
  if (children === void 0) {
    return [];
  }
  if (Array.isArray(children)) {
    const result = [];
    for (const child of children) {
      if (child !== null && child !== void 0) {
        if (Array.isArray(child)) {
          result.push(...flattenChildren(child));
        } else {
          result.push(child);
        }
      }
    }
    return result;
  }
  return [children];
}
function renderer(ast, config, createElement, context, resolveUrl) {
  function _render(h2, node) {
    if (Array.isArray(node)) {
      const nodes = [];
      for (const subnode of node) {
        const rendered2 = _render(h2, subnode);
        const flattened = flattenChildren(rendered2);
        nodes.push(...flattened);
      }
      return nodes;
    }
    if (isNode(node)) {
      if (node.type === "text") {
        return config.textTransformer(node.content);
      }
      if (node.type === "tag") {
        const transformedNode = getOptionsFromNode(node, resolveUrl);
        const children2 = [];
        for (const child of node.children) {
          const rendered2 = _render(h2, child);
          const flattened = flattenChildren(rendered2);
          children2.push(...flattened);
        }
        const componentConfig = config.extraComponentsMap[node.name];
        if (componentConfig !== void 0) {
          return componentConfig.renderer(node, children2, h2, context);
        }
        return h2(node.name, transformedNode, [...children2]);
      }
    }
    return void 0;
  }
  const rendered = _render(createElement, ast);
  const children = flattenChildren(rendered);
  return createElement(config.container.type, context?.data || {}, children);
}
const defaultConfig = {
  container: {
    type: "div"
  },
  extraComponentsMap: {},
  renderAnyway: false,
  textTransformer: (text) => text
};
function renderHtml(html, config, createElement, context, resolveUrl) {
  const mergedConfig = Object.assign(defaultConfig, config);
  const _ast = generateAST(html);
  const rectifyConfig = {
    extraComponentsMap: config.extraComponentsMap
  };
  const _rectifiedAst = rectifyAST(_ast, rectifyConfig);
  return renderer(
    _rectifiedAst,
    mergedConfig,
    createElement,
    context,
    resolveUrl
  );
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementText",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const context = getCurrentInstance();
    const { getConfigValue } = useCmsElementConfig(props.content);
    const mappedContent = computed(() => {
      return props.content?.data?.content || getConfigValue("content");
    });
    const style = computed(() => ({
      alignContent: getConfigValue("verticalAlign")
    }));
    const hasVerticalAlignment = computed(() => !!style.value.alignContent);
    const CmsTextRender = defineComponent({
      setup() {
        const { resolveUrl } = useUrlResolver();
        const config = {
          textTransformer: (text) => decodeHTML(text),
          extraComponentsMap: {
            link: {
              conditions(node) {
                return node.type === "tag" && node.name === "a" && !node.attrs?.class?.includes("btn");
              },
              renderer(node, children, createElement) {
                return createElement(
                  "a",
                  {
                    class: "underline text-base font-normal text-primary hover:text-secondary-900",
                    ...getOptionsFromNode(node, resolveUrl).attrs
                  },
                  [...children]
                );
              }
            },
            button: {
              conditions(node) {
                return node.type === "tag" && node.name === "a" && !!node.attrs?.class?.includes("btn");
              },
              renderer(node, children, createElement) {
                let _class = "";
                if (node?.attrs?.class) {
                  const btnClass = "rounded-md inline-block my-2 py-2 px-4 border border-transparent text-sm font-medium focus:outline-none disabled:opacity-75";
                  _class = node.attrs.class.replace(/\bbtn\s+/, "").replace(
                    "btn-secondary",
                    `${btnClass} bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary-hover`
                  ).replace(
                    "btn-primary",
                    `${btnClass} bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover`
                  ).trim();
                }
                return createElement(
                  "a",
                  {
                    class: _class,
                    ...getOptionsFromNode(node, resolveUrl).attrs
                  },
                  [...children]
                );
              }
            },
            font: {
              conditions(node) {
                return node.type === "tag" && node.name === "font";
              },
              renderer(node, children, createElement) {
                let newStyle = null;
                const styleColor = node?.attrs?.color;
                if (styleColor && node.attrs) {
                  const currentStyle = node.attrs?.style ?? "";
                  newStyle = `color:${styleColor};${currentStyle}`;
                  const { color: _, ...attrsWithoutColor } = node.attrs;
                  node.attrs = attrsWithoutColor;
                }
                return createElement(
                  "span",
                  {
                    style: newStyle,
                    ...getOptionsFromNode(node, resolveUrl).attrs
                  },
                  [...children]
                );
              }
            },
            img: {
              conditions(node) {
                return node.type === "tag" && node.name === "img";
              },
              renderer(node, children, createElement) {
                return createElement(
                  "img",
                  getOptionsFromNode(node, resolveUrl)?.attrs
                );
              }
            }
          }
        };
        const rawHtml = mappedContent.value?.length > 0 ? mappedContent.value : "<div class='cms-element-text missing-content-element'></div>";
        return () => renderHtml(rawHtml, config, h, context, resolveUrl);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (hasVerticalAlignment.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "grid h-full",
          style: style.value
        }, _attrs))} data-v-843500be>`);
        _push(ssrRenderComponent(unref(CmsTextRender), null, null, _parent));
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(unref(CmsTextRender), _attrs, null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-843500be"]]), { __name: "CmsElementText" });

export { __nuxt_component_0 as default };
