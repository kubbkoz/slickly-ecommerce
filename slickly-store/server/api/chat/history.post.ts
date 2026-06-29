// POST /api/chat/history
// { sid, messages, topicId }
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sid, messages, topicId } = body as {
    sid: string;
    messages: any[];
    topicId: string | null;
  };

  if (!sid || sid.length < 10 || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, statusMessage: 'sid and messages required' });
  }

  const storage = useStorage('redis');
  const TTL = 30 * 24 * 60 * 60; // 30 dní

  await storage.setItem(
    `chat:history:${sid}`,
    { messages: messages.slice(-60), topicId: topicId ?? null },
    { ttl: TTL }
  ).catch(() => null);

  return { ok: true };
});
