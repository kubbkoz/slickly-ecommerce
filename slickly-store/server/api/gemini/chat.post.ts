import Anthropic from '@anthropic-ai/sdk';
import { searchProducts, buildSearchQuery } from '../../utils/productCatalog';

const SYSTEM_INSTRUCTIONS = `Si profesionálny predajca bicyklov v SLICKLY (predajňa v Lokci). Máš znalosti o bicykloch, e-bikoch, komponentoch.

OSOBNOSŤ:
- Prívetivý, profesionálny, dôveryhodný
- VŽDY vykaj zákazníkovi (Vy, Vám, Vás, Váš)
- Odborné termíny vysvetľuj jednoducho
- Ak produkt nie je vhodný, povedz to priamo

VEĽKOSŤ RÁMU (výška jazdca → veľkosť):
- do 155 cm → XS  | 155–165 → S  | 165–175 → M  | 175–185 → L  | 185–195 → XL  | 195+ → XXL

KATALÓG (priložený nižšie ako JSON):
- Polia produktu: id, n (názov), cat (kategória), b (značka), pr (cena €), desc, specs, sizes
- Katalóg už je server-side filtrovaný podľa kontextu konverzácie — sústred sa naň
- NIKDY nevymýšľaj produkty mimo katalógu. ID musí existovať v JSON katalógu nižšie

INTERAKTÍVNE OTÁZKY (povinný formát — frontend vykreslí ako tlačidlá):
- [CHIPS: možnosť1|možnosť2|možnosť3]
- [HEIGHT_INPUT] (pre zadanie výšky)
- Max 1 otázka naraz

PORADENSKÝ POSTUP pri novej objednávke bicykla:
1. Výška → [HEIGHT_INPUT]
2. Budget (ak nezadaný) → [CHIPS: Do 500€|500–1000€|1000–2000€|2000–3500€|3500–5000€|5000€+]
3. Terén → [CHIPS: Horské traily|Gravel & lesné cesty|Asfalt|Mesto|Mix]
4. Skúsenosti → [CHIPS: Začiatočník|Rekreačný jazdec|Pokročilý|Pretekár]
5. (e-bike) Pohon → [CHIPS: Bosch|Shimano EP|BAFANG|Yamaha|Jedno mi je]
→ Po 3-4 otázkach ODPORUČ produkty Z KATALÓGU

KRITICKÉ PRAVIDLÁ:
1. ONLY SLICKLY katalóg — žiadne ORBEA/Trek/Specialized ak nie sú nižšie v JSON
2. Typová zhoda — kazeta → len kazety, vidlica → len vidlice, bicykel → len bicykle
3. Cenový rozsah — pri budgete X€ ponúkni produkty v ±20% (80–120%). Ak nič, rozšír na ±30% s upozornením
4. Séria/značka v otázke (Deore, XT, Bosch) = primárny filter v názve produktu
5. Veľkosť rámu — ak produkt má pole "sizes" a chýba potrebná veľkosť → nepripoorúčaj
6. Specs — uvádzaj LEN čo je v poli "specs" alebo "desc". SR Suntour XCT/XCM = pružinová (NIE vzduchová)
7. Typ bicykla — "do mesta"/"mestský" = mestský/trekkingový bicykel (NIE e-bike). "elektro"/"e-bike" = e-bike. Ak user povie "striktne X", DRŽ sa X — nedávaj inú kategóriu (klasický bicykel nezamieňať za e-bike a naopak)

PRODUCT IDS:
- Do poľa product_ids vlož ID každého spomínaného produktu z katalógu
- ID musí existovať v JSON katalógu nižšie — inak nevkladaj
- Ak produkt mimo katalógu, neodporúčaj ho`;

const RATE_OPTS = { key: 'claude-chat', limit: 20, windowMs: 10 * 60 * 1000 };

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, RATE_OPTS);

  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI service not configured' });
  }

  const body = await readBody(event);
  const { message, history = [] } = body as {
    message: string;
    history: { role: string; parts: { text: string }[] }[];
  };

  if (!message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required' });
  }
  if (message.length > 2000) {
    throw createError({ statusCode: 400, statusMessage: 'Message too long' });
  }

  // Live search cez Shopware Store API (rovnaký engine ako category filter)
  let catalogJson = '[]';
  try {
    const allText = [
      ...history.map(m => m.parts?.[0]?.text || ''),
      message
    ].join(' ').toLowerCase();

    // Extrahuj cenový rozsah
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
      query: query || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 999999 ? maxPrice : undefined,
      inStock: true,
      limit: 30
    });

    if (products.length > 0) {
      catalogJson = JSON.stringify(products.map(p => ({
        id: p.id, n: p.name,
        ...(p.category && { cat: p.category }),
        ...(p.brand && { b: p.brand }),
        pr: p.price,
        ...(p.description && { desc: p.description }),
        ...(p.specs && { specs: p.specs }),
        ...(p.sizes && { sizes: p.sizes }),
      })));
    }
  } catch (err) {
    console.error('[chat] Search failed:', err);
  }

  // História — max 10 správ
  const messages: Anthropic.MessageParam[] = history
    .filter((m) => m.parts?.[0]?.text?.trim())
    .slice(-10)
    .map((m) => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts[0].text,
    }));

  messages.push({ role: 'user', content: message.trim() });

  const client = new Anthropic({ apiKey });

  try {
    const response = await Promise.race([
      client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        tools: [
          {
            name: 'chat_response',
            description: 'Vráť odpoveď zákazníkovi a zoznam ID produktov z katalógu ktoré spomínaš',
            input_schema: {
              type: 'object' as const,
              properties: {
                message: {
                  type: 'string',
                  description: 'Odpoveď pre zákazníka (markdown, bez ID produktov)'
                },
                product_ids: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'ID produktov z katalógu spomínaných v odpovedi. Prázdne ak žiadne.'
                }
              },
              required: ['message', 'product_ids']
            }
          }
        ],
        tool_choice: { type: 'tool', name: 'chat_response' },
        system: `${SYSTEM_INSTRUCTIONS}\n\nAKTUÁLNY KATALÓG PRODUKTOV SLICKLY (filtrovaný podľa kontextu):\n${catalogJson}`,
        messages,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Claude API timeout')), 20_000)
      )
    ]);

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    const result = (toolUse?.input as any) ?? { message: '', product_ids: [] };

    return {
      text: result.message || 'Ospravedlňujem sa, momentálne mám technický problém.',
      productIds: (result.product_ids ?? []).filter(Boolean) as string[]
    };
  } catch (err: any) {
    console.error('[chat] Claude API error:', err?.message || err);
    throw createError({
      statusCode: 502,
      statusMessage: 'Chat service temporarily unavailable'
    });
  }
});
