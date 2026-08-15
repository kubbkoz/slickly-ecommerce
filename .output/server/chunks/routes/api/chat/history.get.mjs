import { d as defineEventHandler, g as getQuery, b as useStorage } from '../../../nitro/nitro.mjs';
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

const history_get = defineEventHandler(async (event) => {
  const { sid } = getQuery(event);
  if (!sid || sid.length < 10) return { messages: [], topicId: null };
  const storage = useStorage("redis");
  const data = await storage.getItem(`chat:history:${sid}`).catch(() => null);
  return data != null ? data : { messages: [], topicId: null };
});

export { history_get as default };
