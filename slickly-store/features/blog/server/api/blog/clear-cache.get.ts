import { defineEventHandler, getQuery } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const { slug } = getQuery(event);

  if (slug && typeof slug === 'string') {
    await storage.removeItem(`blog:post:${slug}`).catch(() => null);
    return { cleared: [`blog:post:${slug}`] };
  }

  // Vymaž všetky blog:post:* kľúče
  const keys = await storage.getKeys('blog:post:').catch(() => [] as string[]);
  await Promise.all(keys.map(k => storage.removeItem(k).catch(() => null)));
  return { cleared: keys };
});
