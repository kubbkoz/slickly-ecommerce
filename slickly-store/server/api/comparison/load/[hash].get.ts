import { defineEventHandler, getRouterParam, createError } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash') as string;
  if (!hash) throw createError({ statusCode: 400, message: 'Hash required' });

  const storage = useStorage('redis');
  const data = await storage.getItem<any>(`comparison:${hash}`).catch(() => null);

  if (!data) throw createError({ statusCode: 404, message: 'Porovnanie nenájdené alebo vypršalo' });

  return data;
});
