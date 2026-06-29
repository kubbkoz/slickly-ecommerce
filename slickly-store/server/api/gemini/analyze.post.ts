import Anthropic from '@anthropic-ai/sdk';

const RATE_OPTS = { key: 'claude-analyze', limit: 10, windowMs: 10 * 60 * 1000 };

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, RATE_OPTS);

  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI service not configured' });
  }

  const body = await readBody(event);
  const { image } = body as { image: { data: string; mimeType: string } };

  if (!image?.data || !image?.mimeType) {
    throw createError({ statusCode: 400, statusMessage: 'Image data and mimeType are required' });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(image.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported image type' });
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: image.data,
            },
          },
          {
            type: 'text',
            text: 'Analyze this image and extract the most relevant search terms for a bicycle e-shop. Return only a short comma-separated list of keywords in Slovak language (e.g. "horský bicykel, hardtail, 29").',
          },
        ],
      },
    ],
  });

  const result = response.content.find((b) => b.type === 'text')?.text ?? 'Bicykel';
  return { result };
});
