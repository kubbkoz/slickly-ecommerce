import { d as defineEventHandler, c as createError, r as readBody, b as useStorage, j as hash, k as buildAdvisorPrompt, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import Anthropic from '@anthropic-ai/sdk';
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

const cartAdvisor_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: "Claude API key not configured" });
  }
  const body = await readBody(event);
  const { cartItems, forceRefresh } = body;
  if (!(cartItems == null ? void 0 : cartItems.length)) {
    return { tip: "", products: [] };
  }
  const storage = useStorage("redis");
  const cacheKey = `cart-advisor:${hash(cartItems)}`;
  if (!forceRefresh) {
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;
  }
  const client = new Anthropic({ apiKey });
  const cartSummary = cartItems.map((i) => `- ${i.name}${i.category ? ` (${i.category})` : ""}${i.price ? ` \u2013 ${i.price} \u20AC` : ""}`).join("\n");
  const month = (/* @__PURE__ */ new Date()).getMonth() + 1;
  const season = month >= 3 && month <= 5 ? "jar" : month >= 6 && month <= 8 ? "leto" : month >= 9 && month <= 11 ? "jese\u0148" : "zima";
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 900,
    tools: [
      {
        name: "cart_product_suggestions",
        description: "Navrhni 3\u20135 kontextovo relevantn\xFDch doplnkov\xFDch produktov na z\xE1klade ko\u0161\xEDka",
        input_schema: {
          type: "object",
          properties: {
            tip: {
              type: "string",
              description: `Odborn\xFD, pr\xEDvetiv\xFD tip od \u0161pecialistu na starostlivos\u0165 o auto (max 1 veta).
Mus\xED vysvet\u013Eova\u0165 pre\u010Do tieto veci odpor\xFA\u010Dame k dan\xE9mu produktu.`
            },
            products: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: {
                type: "object",
                properties: {
                  searchQuery: {
                    type: "string",
                    description: `Konkr\xE9tna fulltext search query pre Shopware. Pou\u017Ei: typ produktu + farba/ur\u010Denie.`
                  },
                  label: {
                    type: "string",
                    description: 'Kr\xE1tky n\xE1zov kateg\xF3rie (napr. "Prilba", "Stojan", "F\u013Ea\u0161a")'
                  },
                  priority: {
                    type: "number",
                    description: "Priorita 1 a\u017E 5."
                  }
                },
                required: ["searchQuery", "label", "priority"]
              }
            }
          },
          required: ["tip", "products"]
        }
      }
    ],
    tool_choice: { type: "tool", name: "cart_product_suggestions" },
    messages: [
      {
        role: "user",
        content: buildAdvisorPrompt(cartSummary, season, cartItems)
      }
    ]
  });
  const toolUse = response.content.find((b) => b.type === "tool_use");
  const result = (_a = toolUse == null ? void 0 : toolUse.input) != null ? _a : { tip: "", products: [] };
  const sorted = ((_b = result.products) != null ? _b : []).sort(
    (a, b) => {
      var _a2, _b2;
      return ((_a2 = a.priority) != null ? _a2 : 5) - ((_b2 = b.priority) != null ? _b2 : 5);
    }
  );
  const output = {
    tip: (_c = result.tip) != null ? _c : "",
    products: sorted
  };
  await storage.setItem(cacheKey, output, { ttl: 3600 });
  return output;
});

export { cartAdvisor_post as default };
