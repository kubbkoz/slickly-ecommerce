import { d as defineEventHandler, r as readBody, c as createError, b as useStorage } from '../../../nitro/nitro.mjs';
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

const history_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sid, messages, topicId } = body;
  if (!sid || sid.length < 10 || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, statusMessage: "sid and messages required" });
  }
  const storage = useStorage("redis");
  const TTL = 30 * 24 * 60 * 60;
  await storage.setItem(
    `chat:history:${sid}`,
    { messages: messages.slice(-60), topicId: topicId != null ? topicId : null },
    { ttl: TTL }
  ).catch(() => null);
  return { ok: true };
});

export { history_post as default };
