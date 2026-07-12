import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

export default defineEventHandler(async (event) => {
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const adminEndpoint  = config.shopwareAdminEndpoint as string;
  const salesChannelId = (config.public.shopware as any).ids?.salesChannel as string;

  try {
    const token = await getAdminToken();
    const sc: any = await $fetch(`${adminEndpoint}sales-channel/${salesChannelId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    const cf = sc?.data?.customFields ?? sc?.customFields ?? null;

    return {
      salesChannelId,
      adminEndpoint,
      customFieldsFound: !!cf,
      customFieldKeys: cf ? Object.keys(cf) : [],
      customFieldValues: cf,
      rawTopLevelKeys: sc ? Object.keys(sc) : [],
    };
  } catch (e: any) {
    return {
      error: e?.message ?? String(e),
      salesChannelId,
      adminEndpoint,
    };
  }
});
