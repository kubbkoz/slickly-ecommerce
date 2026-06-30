import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';

/**
 * Debug endpoint — vypíše Shopware kategórie (id → názov) zo Store API, aby sa
 * dali ľahko odčítať `NUXT_PUBLIC_SW_ID_*` hodnoty pre homepage sekcie.
 * Otvor `https://slickly.sk/api/debug/navigation`.
 *
 * Vráti: salesChannelId, rootCategoryId (z /context) + plochý zoznam kategórií
 * { id, name, level, parentId } zoradený podľa úrovne.
 */
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const sw = (config.public as any).shopware ?? {};
  const endpoint = String(sw.endpoint || '').replace(/\/+$/, '');
  const token = String(sw.accessToken || '');

  if (!endpoint || !token) {
    return { ok: false, error: 'Chýba endpoint/accessToken v runtimeConfig.' };
  }

  const headers = { 'sw-access-key': token, accept: 'application/json', 'content-type': 'application/json' };

  const out: any = { endpoint, salesChannelId: null, rootCategoryId: null, totalCategories: 0, categories: [] };

  // 1) /context → sales channel + navigation root category
  try {
    const ctx: any = await $fetch(`${endpoint}/context`, { headers, timeout: 8000 });
    out.salesChannelId = ctx?.salesChannel?.id ?? null;
    out.rootCategoryId =
      ctx?.salesChannel?.navigationCategoryId ?? ctx?.salesChannel?.navigationCategory?.id ?? null;
    out.currencyId = ctx?.currency?.id ?? null;
    out.languageId = ctx?.salesChannel?.languageId ?? null;
  } catch (e: any) {
    out.contextError = String(e?.message || e);
  }

  // 2) /category → zoznam kategórií (id, name, level, parentId)
  try {
    const res: any = await $fetch(`${endpoint}/category`, {
      method: 'POST',
      headers,
      timeout: 12000,
      body: {
        limit: 500,
        includes: { category: ['id', 'name', 'translated', 'level', 'parentId', 'type', 'active', 'visible'] },
        sort: [{ field: 'level', order: 'asc' }, { field: 'name', order: 'asc' }],
      },
    });
    const els: any[] = res?.elements ?? [];
    out.totalCategories = res?.total ?? els.length;
    out.categories = els.map((c) => ({
      id: c.id,
      name: c.translated?.name ?? c.name,
      level: c.level,
      parentId: c.parentId,
      type: c.type,
      active: c.active,
      visible: c.visible,
    }));
  } catch (e: any) {
    out.categoryError = String(e?.message || e);
    out.categoryStatus = e?.response?.status ?? e?.statusCode ?? null;
  }

  out.hint =
    'Skopíruj `id` kategórií do NUXT_PUBLIC_SW_ID_CAT_* (home slider, featured, flash sales…), ' +
    'salesChannelId → NUXT_PUBLIC_SW_ID_SALES_CHANNEL, rootCategoryId → NUXT_PUBLIC_SW_ID_ROOT_CATEGORY.';
  return out;
});
