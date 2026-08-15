import { d as defineEventHandler, l as checkRateLimit, c as createError, r as readBody, n as buildSearchQuery, s as searchProducts, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const SYSTEM_INSTRUCTIONS = `Si profesion\xE1lny predajca autokozmetiky a pr\xEDslu\u0161enstva v SLICKLY. M\xE1\u0161 znalosti o produktoch na starostlivos\u0165 o exteri\xE9r, interi\xE9r, le\u0161tenie a ochranu karos\xE9rie.

OSOBNOS\u0164:
- Pr\xEDvetiv\xFD, profesion\xE1lny, d\xF4veryhodn\xFD
- V\u017DDY vykaj z\xE1kazn\xEDkovi (Vy, V\xE1m, V\xE1s, V\xE1\u0161)
- Odborn\xE9 term\xEDny vysvet\u013Euj jednoducho
- Ak produkt nie je vhodn\xFD, povedz to priamo

KATAL\xD3G (prilo\u017Een\xFD ni\u017E\u0161ie ako JSON):
- Polia produktu: id, n (n\xE1zov), cat (kateg\xF3ria), b (zna\u010Dka), pr (cena \u20AC), desc, specs, sizes
- Katal\xF3g u\u017E je server-side filtrovan\xFD pod\u013Ea kontextu konverz\xE1cie \u2014 s\xFAstred sa na\u0148
- NIKDY nevym\xFD\u0161\u013Eaj produkty mimo katal\xF3gu. ID mus\xED existova\u0165 v JSON katal\xF3gu ni\u017E\u0161ie

INTERAKT\xCDVNE OT\xC1ZKY (povinn\xFD form\xE1t \u2014 frontend vykresl\xED ako tla\u010Didl\xE1):
- [CHIPS: mo\u017Enos\u01651|mo\u017Enos\u01652|mo\u017Enos\u01653]
- Max 1 ot\xE1zka naraz

PORADENSK\xDD POSTUP pri novej objedn\xE1vke:
1. Oblas\u0165 z\xE1ujmu (ak nezadan\xE1) \u2192 [CHIPS: Exteri\xE9r|Interi\xE9r|Le\u0161tenie|Ochrana karos\xE9rie|Pr\xEDslu\u0161enstvo]
2. Budget (ak nezadan\xFD) \u2192 [CHIPS: Do 20\u20AC|20\u201350\u20AC|50\u2013100\u20AC|100\u2013200\u20AC|200\u20AC+]
3. Konkr\xE9tny probl\xE9m \u2192 [CHIPS: Umytie a ochrana|Odstr\xE1nenie \u0161krabancov|\u010Cistenie interi\xE9ru|Le\u0161tenie laku|In\xE9]
\u2192 Po 2-3 ot\xE1zkach ODPORU\u010C produkty Z KATAL\xD3GU

KRITICK\xC9 PRAVIDL\xC1:
1. ONLY SLICKLY katal\xF3g \u2014 \u017Eiadne in\xE9 zna\u010Dky ak nie s\xFA ni\u017E\u0161ie v JSON
2. Typov\xE1 zhoda \u2014 odpor\xFA\u010Daj len produkty zodpovedaj\xFAce zadanej kateg\xF3rii/potrebe z\xE1kazn\xEDka
3. Cenov\xFD rozsah \u2014 pri budgete X\u20AC pon\xFAkni produkty v \xB120% (80\u2013120%). Ak ni\u010D, roz\u0161\xEDr na \xB130% s upozornen\xEDm
4. Zna\u010Dka v ot\xE1zke = prim\xE1rny filter v n\xE1zve produktu
5. Specs \u2014 uv\xE1dzaj LEN \u010Do je v poli "specs" alebo "desc"

PRODUCT IDS:
- Do po\u013Ea product_ids vlo\u017E ID ka\u017Ed\xE9ho spom\xEDnan\xE9ho produktu z katal\xF3gu
- ID mus\xED existova\u0165 v JSON katal\xF3gu ni\u017E\u0161ie \u2014 inak nevkladaj
- Ak produkt mimo katal\xF3gu, neodpor\xFA\u010Daj ho`;
const RATE_OPTS = { key: "claude-chat", limit: 20, windowMs: 10 * 60 * 1e3 };
const chat_post = defineEventHandler(async (event) => {
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
  if (message.length > 2e3) {
    throw createError({ statusCode: 400, statusMessage: "Message too long" });
  }
  let catalogJson = "[]";
  try {
    const allText = [
      ...history.map((m) => {
        var _a2, _b2;
        return ((_b2 = (_a2 = m.parts) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.text) || "";
      }),
      message
    ].join(" ").toLowerCase();
    let minPrice = 0;
    let maxPrice = 999999;
    const rangeMatch = allText.match(/(\d{2,5})\s*[-–]\s*(\d{2,5})\s*€/);
    const upperMatch = allText.match(/(?:do|pod|max(?:imálne)?|nanajvýš)\s+(\d{2,5})\s*€/);
    const lowerMatch = allText.match(/(?:od|nad|aspoň)\s+(\d{2,5})\s*€/);
    if (rangeMatch) {
      minPrice = Math.min(+rangeMatch[1], +rangeMatch[2]) * 0.9;
      maxPrice = Math.max(+rangeMatch[1], +rangeMatch[2]) * 1.1;
    } else if (upperMatch) {
      maxPrice = +upperMatch[1] * 1.1;
      minPrice = maxPrice * 0.5;
    } else if (lowerMatch) {
      minPrice = +lowerMatch[1] * 0.9;
    }
    const query = buildSearchQuery(allText);
    const products = await searchProducts({
      query: query || void 0,
      minPrice: minPrice > 0 ? minPrice : void 0,
      maxPrice: maxPrice < 999999 ? maxPrice : void 0,
      inStock: true,
      limit: 30
    });
    if (products.length > 0) {
      catalogJson = JSON.stringify(products.map((p) => ({
        id: p.id,
        n: p.name,
        ...p.category && { cat: p.category },
        ...p.brand && { b: p.brand },
        pr: p.price,
        ...p.description && { desc: p.description },
        ...p.specs && { specs: p.specs },
        ...p.sizes && { sizes: p.sizes }
      })));
    }
  } catch (err) {
    console.error("[chat] Search failed:", err);
  }
  const messages = history.filter((m) => {
    var _a2, _b2, _c;
    return (_c = (_b2 = (_a2 = m.parts) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.text) == null ? void 0 : _c.trim();
  }).slice(-10).map((m) => ({
    role: m.role === "model" ? "assistant" : "user",
    content: m.parts[0].text
  }));
  messages.push({ role: "user", content: message.trim() });
  const client = new Anthropic({ apiKey });
  try {
    const response = await Promise.race([
      client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        tools: [
          {
            name: "chat_response",
            description: "Vr\xE1\u0165 odpove\u010F z\xE1kazn\xEDkovi a zoznam ID produktov z katal\xF3gu ktor\xE9 spom\xEDna\u0161",
            input_schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Odpove\u010F pre z\xE1kazn\xEDka (markdown, bez ID produktov)"
                },
                product_ids: {
                  type: "array",
                  items: { type: "string" },
                  description: "ID produktov z katal\xF3gu spom\xEDnan\xFDch v odpovedi. Pr\xE1zdne ak \u017Eiadne."
                }
              },
              required: ["message", "product_ids"]
            }
          }
        ],
        tool_choice: { type: "tool", name: "chat_response" },
        system: `${SYSTEM_INSTRUCTIONS}

AKTU\xC1LNY KATAL\xD3G PRODUKTOV SLICKLY (filtrovan\xFD pod\u013Ea kontextu):
${catalogJson}`,
        messages
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Claude API timeout")), 2e4)
      )
    ]);
    const toolUse = response.content.find((b) => b.type === "tool_use");
    const result = (_a = toolUse == null ? void 0 : toolUse.input) != null ? _a : { message: "", product_ids: [] };
    return {
      text: result.message || "Ospravedl\u0148ujem sa, moment\xE1lne m\xE1m technick\xFD probl\xE9m.",
      productIds: ((_b = result.product_ids) != null ? _b : []).filter(Boolean)
    };
  } catch (err) {
    console.error("[chat] Claude API error:", (err == null ? void 0 : err.message) || err);
    throw createError({
      statusCode: 502,
      statusMessage: "Chat service temporarily unavailable"
    });
  }
});

export { chat_post as default };
