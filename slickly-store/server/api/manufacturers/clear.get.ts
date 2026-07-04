import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig, useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = (config.webhookSecret ?? config.public?.webhookSecret) as string;
  const { secret: provided } = getQuery(event);

  if (!provided || provided !== secret) {
    return { error: 'Unauthorized' };
  }

  // Key format matches Nitro's internal defineCachedFunction convention:
  // [base, group, name, key + '.json'].join(':') — see server/api/manufacturers/index.get.ts
  // (name: 'manufacturers-list', getKey: () => 'all'). No public API exposes this directly.
  const storage = useStorage();
  await storage.removeItem('/cache:nitro/functions:manufacturers-list:all.json');

  return { cleared: true };
});
