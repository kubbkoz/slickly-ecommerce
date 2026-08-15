import { d as defineEventHandler, g as getQuery, E as sendRedirect, b as useStorage } from '../../../nitro/nitro.mjs';
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

const unsubscribe_get = defineEventHandler(async (event) => {
  const { pid, email } = getQuery(event);
  if (!pid || !email) return sendRedirect(event, "/?unsubscribed=error");
  const storage = useStorage("db");
  const key = `watchdog:${pid}:${String(email).toLowerCase().trim()}`;
  await storage.removeItem(key).catch(() => null);
  return sendRedirect(event, "/?unsubscribed=ok");
});

export { unsubscribe_get as default };
