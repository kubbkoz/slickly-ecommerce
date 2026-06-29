import Anthropic from '@anthropic-ai/sdk';

const RATE_OPTS = { key: 'claude-recommend', limit: 15, windowMs: 10 * 60 * 1000 };

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, RATE_OPTS);

  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI service not configured' });
  }

  const body = await readBody(event);
  const { userContext, products } = body as { userContext: string; products: any[] };

  if (!userContext || !products?.length) {
    throw createError({ statusCode: 400, statusMessage: 'userContext and products are required' });
  }
  if (userContext.length > 1000) {
    throw createError({ statusCode: 400, statusMessage: 'userContext too long' });
  }

  const client = new Anthropic({ apiKey });

  const productList = products
    .slice(0, 100)
    .map((p: any) => ({ id: p.id, name: p.name, category: p.category, price: p.price }));

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 256,
    tools: [
      {
        name: 'recommend_products',
        description: 'Return up to 4 product IDs that best match the user context',
        input_schema: {
          type: 'object',
          properties: {
            recommendationIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of up to 4 product IDs from the provided list',
            },
          },
          required: ['recommendationIds'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'recommend_products' },
    messages: [
      {
        role: 'user',
        content: `Based on this user context: "${userContext}"

Return up to 4 product IDs from this list that best match:
${JSON.stringify(productList)}`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === 'tool_use');
  const recommendationIds: string[] = (toolUse?.input as any)?.recommendationIds ?? [];

  return { recommendationIds };
});
