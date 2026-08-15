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

const SYSTEM_PROMPT = `Si expert na bicykle pre SLICKLY e-shop.
Pom\xE1ha\u0161 z\xE1kazn\xEDkom n\xE1js\u0165 ide\xE1lny bicykel formou priate\u013Esk\xE9ho rozhovoru.
Klade\u0161 maxim\xE1lne 2 ot\xE1zky naraz, stru\u010Dne a jasne.
Komunikuj v jazyku z\xE1kazn\xEDka (SK/CZ/EN/PL/DE/HU).
Ke\u010F m\xE1\u0161 dostatok inform\xE1ci\xED (min 3\u20134 odpovede), odporu\u010D konkr\xE9tne typy bicyklov s kr\xE1tkym od\xF4vodnen\xEDm.
Form\xE1t odpor\xFA\u010Dania:
[[ODPORUCANIE: typ1|typ2|typ3]]
kde typ je jedno z: horsk\xFD MTB hardtail, horsk\xFD MTB full-suspension, silni\u010Dn\xFD bicykel, gravel, trekking, e-bike MTB, e-bike trekking, e-bike road, detsk\xFD bicykel
Nikdy sa nep\xFDtaj viac ako 5 ot\xE1zok celkovo.`;
const RATE_OPTS = { key: "claude-configurator", limit: 15, windowMs: 10 * 60 * 1e3 };
const configurator_post = defineEventHandler(async (event) => {
  var _a, _b;
  await checkRateLimit(event, RATE_OPTS);
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "AI service not configured" });
  }
  const body = await readBody(event);
  const { message, history = [] } = body;
  if (!(message == null ? void 0 : message.trim())) {
    throw createError({ statusCode: 400, statusMessage: "Message is required" });
  }
  if (message.length > 500) {
    throw createError({ statusCode: 400, statusMessage: "Message too long" });
  }
  const messages = [
    ...history.slice(-12),
    { role: "user", content: message.trim() }
  ];
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
    messages
  });
  const text = (_b = (_a = response.content.find((b) => b.type === "text")) == null ? void 0 : _a.text) != null ? _b : "";
  const recMatch = text.match(/\[\[ODPORUCANIE: (.*?)\]\]/);
  const recommendations = recMatch ? recMatch[1].split("|").map((s) => s.trim()).filter(Boolean) : null;
  const cleanText = text.replace(/\[\[ODPORUCANIE:.*?\]\]/, "").trim();
  return { text: cleanText, recommendations };
});

export { configurator_post as default };
