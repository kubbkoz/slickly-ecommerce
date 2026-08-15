import { d as defineEventHandler, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const recommend_post = defineEventHandler(async (event) => {
  var _a;
  const { items } = await readBody(event);
  if (!Array.isArray(items) || items.length < 2) {
    return { recommendation: "Pridajte aspo\u0148 2 produkty na porovnanie." };
  }
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) return { recommendation: "AI odpor\xFA\u010Danie nie je dostupn\xE9." };
  const summary = items.map(
    (p, i) => `${i + 1}. ${p.name} \u2014 ${p.price}\u20AC${p.oldPrice ? ` (p\xF4vodne ${p.oldPrice}\u20AC)` : ""}
   Kateg\xF3ria: ${p.categoryName}
   V\xFDrobca: ${p.manufacturer}
   Specs: ${(p.properties || []).map((s) => `${s.group}: ${s.value}`).join(", ")}`
  ).join("\n\n");
  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Si odborn\xEDk na starostlivos\u0165 o auto. Porovnaj tieto produkty a odpor\xFA\u010D najlep\u0161\xED pomer cena/v\xFDbava. Odpove\u010F max 3 vety po slovensky. Bu\u010F konkr\xE9tny \u2014 pomenuj v\xED\u0165aza a pre\u010Do.

${summary}`
      }]
    });
    const text = ((_a = msg.content[0]) == null ? void 0 : _a.type) === "text" ? msg.content[0].text : "";
    return { recommendation: text };
  } catch (e) {
    return { recommendation: "AI odpor\xFA\u010Danie moment\xE1lne nedostupn\xE9." };
  }
});

export { recommend_post as default };
