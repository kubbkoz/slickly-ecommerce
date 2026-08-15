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

const RATE_OPTS = { key: "claude-recommend", limit: 15, windowMs: 10 * 60 * 1e3 };
const recommend_post = defineEventHandler(async (event) => {
  var _a, _b;
  await checkRateLimit(event, RATE_OPTS);
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "AI service not configured" });
  }
  const body = await readBody(event);
  const { userContext, products } = body;
  if (!userContext || !(products == null ? void 0 : products.length)) {
    throw createError({ statusCode: 400, statusMessage: "userContext and products are required" });
  }
  if (userContext.length > 1e3) {
    throw createError({ statusCode: 400, statusMessage: "userContext too long" });
  }
  const client = new Anthropic({ apiKey });
  const productList = products.slice(0, 100).map((p) => ({ id: p.id, name: p.name, category: p.category, price: p.price }));
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    tools: [
      {
        name: "recommend_products",
        description: "Return up to 4 product IDs that best match the user context",
        input_schema: {
          type: "object",
          properties: {
            recommendationIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of up to 4 product IDs from the provided list"
            }
          },
          required: ["recommendationIds"]
        }
      }
    ],
    tool_choice: { type: "tool", name: "recommend_products" },
    messages: [
      {
        role: "user",
        content: `Based on this user context: "${userContext}"

Return up to 4 product IDs from this list that best match:
${JSON.stringify(productList)}`
      }
    ]
  });
  const toolUse = response.content.find((b) => b.type === "tool_use");
  const recommendationIds = (_b = (_a = toolUse == null ? void 0 : toolUse.input) == null ? void 0 : _a.recommendationIds) != null ? _b : [];
  return { recommendationIds };
});

export { recommend_post as default };
