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

const RATE_OPTS = { key: "claude-analyze", limit: 10, windowMs: 10 * 60 * 1e3 };
const analyze_post = defineEventHandler(async (event) => {
  var _a, _b;
  await checkRateLimit(event, RATE_OPTS);
  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey;
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "AI service not configured" });
  }
  const body = await readBody(event);
  const { image } = body;
  if (!(image == null ? void 0 : image.data) || !(image == null ? void 0 : image.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Image data and mimeType are required" });
  }
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedMimeTypes.includes(image.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported image type" });
  }
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: image.mimeType,
              data: image.data
            }
          },
          {
            type: "text",
            text: 'Analyze this image and extract the most relevant search terms for a car care and detailing e-shop. Return only a short comma-separated list of keywords in Slovak language (e.g. "le\u0161tenie, ochrana karos\xE9rie, vosk").'
          }
        ]
      }
    ]
  });
  const result = (_b = (_a = response.content.find((b) => b.type === "text")) == null ? void 0 : _a.text) != null ? _b : "Produkt";
  return { result };
});

export { analyze_post as default };
