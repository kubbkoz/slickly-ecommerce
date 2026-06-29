import Anthropic from '@anthropic-ai/sdk';
import { hash } from 'ohash';
import { buildAdvisorPrompt } from '../../utils/cartAdvisorSuggestions';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Claude API key not configured' });
  }

  const body = await readBody(event);
  const { cartItems, forceRefresh } = body as { cartItems: { name: string; category?: string; price?: number }[]; forceRefresh?: boolean };

  if (!cartItems?.length) {
    return { tip: '', products: [] };
  }

  // Redis Caching Logic
  const storage = useStorage('redis');
  const cacheKey = `cart-advisor:${hash(cartItems)}`;

  if (!forceRefresh) {
    const cached = await storage.getItem(cacheKey);
    if (cached) return cached;
  }

  const client = new Anthropic({ apiKey });

  const cartSummary = cartItems
    .map((i) => `- ${i.name}${i.category ? ` (${i.category})` : ''}${i.price ? ` – ${i.price} €` : ''}`)
    .join('\n');

  const month = new Date().getMonth() + 1; // 1-12
  const season =
    month >= 3 && month <= 5 ? 'jar' :
      month >= 6 && month <= 8 ? 'leto' :
        month >= 9 && month <= 11 ? 'jeseň' : 'zima';

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 900,
    tools: [
      {
        name: 'cart_product_suggestions',
        description: 'Navrhni 3–5 kontextovo relevantných doplnkových produktov na základe košíka',
        input_schema: {
          type: 'object' as const,
          properties: {
            tip: {
              type: 'string',
              description: `Odborný, prívetivý tip od cyklistického špecialistu (max 1 veta). 
Musí vysvetľovať prečo tieto veci odporúčame k danému bicyklu.`,
            },
            products: {
              type: 'array',
              minItems: 3,
              maxItems: 5,
              items: {
                type: 'object',
                properties: {
                  searchQuery: {
                    type: 'string',
                    description: `Konkrétna fulltext search query pre Shopware. Použi: typ produktu + farba/určenie.`,
                  },
                  label: {
                    type: 'string',
                    description: 'Krátky názov kategórie (napr. "Prilba", "Stojan", "Fľaša")',
                  },
                  priority: {
                    type: 'number',
                    description: 'Priorita 1 až 5.',
                  },
                },
                required: ['searchQuery', 'label', 'priority'],
              },
            },
          },
          required: ['tip', 'products'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'cart_product_suggestions' },
    messages: [
      {
        role: 'user',
        content: buildAdvisorPrompt(cartSummary, season, cartItems),
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === 'tool_use');
  const result = (toolUse?.input as any) ?? { tip: '', products: [] };

  const sorted = ((result.products ?? []) as any[]).sort(
    (a: any, b: any) => (a.priority ?? 5) - (b.priority ?? 5)
  );

  const output = {
    tip: result.tip ?? '',
    products: sorted as { searchQuery: string; label: string; priority: number }[],
  };

  // Cache the result for 1 hour
  await storage.setItem(cacheKey, output, { ttl: 3600 });

  return output;
});
