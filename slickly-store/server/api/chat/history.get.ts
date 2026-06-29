// GET /api/chat/history?sid=xxx
export default defineEventHandler(async (event) => {
  const { sid } = getQuery(event) as { sid?: string };
  if (!sid || sid.length < 10) return { messages: [], topicId: null };

  const storage = useStorage('redis');
  const data = await storage.getItem<any>(`chat:history:${sid}`).catch(() => null);
  return data ?? { messages: [], topicId: null };
});
