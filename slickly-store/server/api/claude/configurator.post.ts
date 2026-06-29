import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Si expert na bicykle pre SLICKLY e-shop.
Pomáhaš zákazníkom nájsť ideálny bicykel formou priateľského rozhovoru.
Kladeš maximálne 2 otázky naraz, stručne a jasne.
Komunikuj v jazyku zákazníka (SK/CZ/EN/PL/DE/HU).
Keď máš dostatok informácií (min 3–4 odpovede), odporuč konkrétne typy bicyklov s krátkym odôvodnením.
Formát odporúčania:
[[ODPORUCANIE: typ1|typ2|typ3]]
kde typ je jedno z: horský MTB hardtail, horský MTB full-suspension, silničný bicykel, gravel, trekking, e-bike MTB, e-bike trekking, e-bike road, detský bicykel
Nikdy sa nepýtaj viac ako 5 otázok celkovo.`;

const RATE_OPTS = { key: 'claude-configurator', limit: 15, windowMs: 10 * 60 * 1000 };

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
    history: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required' });
  }
  if (message.length > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Message too long' });
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-12),
    { role: 'user', content: message.trim() },
  ];

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const text = response.content.find((b) => b.type === 'text')?.text ?? '';

  // Extract recommendation if present
  const recMatch = text.match(/\[\[ODPORUCANIE: (.*?)\]\]/);
  const recommendations = recMatch
    ? recMatch[1].split('|').map((s) => s.trim()).filter(Boolean)
    : null;

  const cleanText = text.replace(/\[\[ODPORUCANIE:.*?\]\]/, '').trim();

  return { text: cleanText, recommendations };
});
