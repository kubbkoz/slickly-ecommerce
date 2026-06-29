import { defineEventHandler, getQuery, sendRedirect } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const { pid, email } = getQuery(event);
  if (!pid || !email) return sendRedirect(event, '/?unsubscribed=error');

  const storage = useStorage('db');
  const key = `watchdog:${pid}:${String(email).toLowerCase().trim()}`;
  await storage.removeItem(key).catch(() => null);

  return sendRedirect(event, '/?unsubscribed=ok');
});
