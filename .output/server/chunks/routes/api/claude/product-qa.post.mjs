import { d as defineEventHandler, l as checkRateLimit, c as createError, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const SYSTEM_PROMPT = `Si \u0161pecialista na autokozmetiku a pr\xEDslu\u0161enstvo pre SLICKLY e-shop.
Odpoved\xE1\u0161 na ot\xE1zky z\xE1kazn\xEDkov t\xFDkaj\xFAce sa konkr\xE9tneho produktu.
Komunikuj v jazyku, v ktorom z\xE1kazn\xEDk p\xED\u0161e.
Bu\u010F konkr\xE9tny, technicky presn\xFD a stru\u010Dn\xFD (max 4 vety).
Ak ot\xE1zka nes\xFAvis\xED s produktom alebo starostlivos\u0165ou o auto, jemne presmeruj sp\xE4\u0165 k t\xE9me.`;
const RATE_OPTS = { key: "claude-product-qa", limit: 20, windowMs: 10 * 60 * 1e3 };
const productQa_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  await checkRateLimit(event, RATE_OPTS);
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "AI service not configured" });
  }
  const body = await readBody(event);
  const { question, productContext } = body;
  if (!(question == null ? void 0 : question.trim())) {
    throw createError({ statusCode: 400, statusMessage: "Question is required" });
  }
  if (question.length > 500) {
    throw createError({ statusCode: 400, statusMessage: "Question too long" });
  }
  if (!(productContext == null ? void 0 : productContext.name)) {
    throw createError({ statusCode: 400, statusMessage: "productContext.name is required" });
  }
  const productInfo = [
    `Produkt: ${productContext.name}`,
    productContext.brand ? `Zna\u010Dka: ${productContext.brand}` : null,
    productContext.category ? `Kateg\xF3ria: ${productContext.category}` : null,
    productContext.price ? `Cena: ${productContext.price.toFixed(2)} \u20AC` : null,
    productContext.description ? `Popis: ${productContext.description.replace(/<[^>]*>/g, "").substring(0, 500)}` : null,
    ((_a = productContext.properties) == null ? void 0 : _a.length) ? `\u0160pecifik\xE1cie: ${productContext.properties.map((p) => `${p.name}: ${p.value}`).join(", ")}` : null
  ].filter(Boolean).join("\n");
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }
      }
    ],
    messages: [
      {
        role: "user",
        content: `Inform\xE1cie o produkte:
${productInfo}

Ot\xE1zka z\xE1kazn\xEDka: ${question.trim()}`
      }
    ]
  });
  const answer = (_c = (_b = response.content.find((b) => b.type === "text")) == null ? void 0 : _b.text) != null ? _c : "";
  return { answer };
});

export { productQa_post as default };
