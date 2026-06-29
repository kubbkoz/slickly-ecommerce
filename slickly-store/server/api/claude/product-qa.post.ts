import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Si špecialista na bicykle pre SLICKLY e-shop.
Odpovedáš na otázky zákazníkov týkajúce sa konkrétneho produktu.
Komunikuj v jazyku, v ktorom zákazník píše.
Buď konkrétny, technicky presný a stručný (max 4 vety).
Ak otázka nesúvisí s produktom alebo cyklistikou, jemne presmeruj späť k téme.`;

const RATE_OPTS = { key: 'claude-product-qa', limit: 20, windowMs: 10 * 60 * 1000 };

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, RATE_OPTS);

  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI service not configured' });
  }

  const body = await readBody(event);
  const { question, productContext } = body as {
    question: string;
    productContext: {
      name: string;
      description?: string;
      price?: number;
      brand?: string;
      category?: string;
      properties?: { name: string; value: string }[];
    };
  };

  if (!question?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Question is required' });
  }
  if (question.length > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Question too long' });
  }
  if (!productContext?.name) {
    throw createError({ statusCode: 400, statusMessage: 'productContext.name is required' });
  }

  const productInfo = [
    `Produkt: ${productContext.name}`,
    productContext.brand ? `Značka: ${productContext.brand}` : null,
    productContext.category ? `Kategória: ${productContext.category}` : null,
    productContext.price ? `Cena: ${productContext.price.toFixed(2)} €` : null,
    productContext.description
      ? `Popis: ${productContext.description.replace(/<[^>]*>/g, '').substring(0, 500)}`
      : null,
    productContext.properties?.length
      ? `Špecifikácie: ${productContext.properties.map((p) => `${p.name}: ${p.value}`).join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

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
    messages: [
      {
        role: 'user',
        content: `Informácie o produkte:\n${productInfo}\n\nOtázka zákazníka: ${question.trim()}`,
      },
    ],
  });

  const answer = response.content.find((b) => b.type === 'text')?.text ?? '';
  return { answer };
});
