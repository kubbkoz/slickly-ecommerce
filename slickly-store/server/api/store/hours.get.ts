import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

// Bez Redis cache — Admin API je rýchly (<300ms), zmeny propagujú okamžite
// Client-side sessionStorage (5 min TTL) je dostatočný buffer

function pick(cf: Record<string, any>, ...keys: string[]): any {
  for (const k of keys) {
    const v = cf[k];
    if (v !== undefined && v !== null && v !== false && v !== '') return v;
  }
  const tail = keys[0].split('_').pop()!;
  for (const [cfKey, val] of Object.entries(cf)) {
    if (cfKey.endsWith(`_${tail}`) && val !== undefined && val !== null && val !== false && val !== '') return val;
  }
  return undefined;
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const adminEndpoint  = config.shopwareAdminEndpoint as string;
  const salesChannelId = (config.public.shopware as any).ids?.salesChannel as string;

  try {
    const token = await getAdminToken();

    // Admin API — vracia kompletné custom fields
    const sc: any = await $fetch(`${adminEndpoint}sales-channel/${salesChannelId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    const cf: Record<string, any> = sc?.data?.customFields ?? sc?.customFields ?? {};

    if (!Object.keys(cf).length) {
      console.warn('[store/hours] customFields prázdne — skontroluj Sales Channel ID alebo Admin API credentials');
    }

    const rawDovolenka = cf['otvaracie_hodiny_dovolenka'] ?? cf['otvaracie_hodiny_predajna_dovolenka'] ?? false;

    const hours = {
      od:         pick(cf, 'otvaracie_hodiny_od',        'otvaracie_hodiny_predajna_od')        ?? '07:00',
      do:         pick(cf, 'otvaracie_hodiny_do',        'otvaracie_hodiny_predajna_do')        ?? '17:00',
      denOd:      pick(cf, 'otvaracie_hodiny_den_od',    'otvaracie_hodiny_predajna_den_od')    ?? 'Pondelok',
      denDo:      pick(cf, 'otvaracie_hodiny_den_do',    'otvaracie_hodiny_predajna_den_do')    ?? 'Sobota',
      zatvorene:  pick(cf, 'otvaracie_hodiny_zatvorene', 'otvaracie_hodiny_predajna_zatvorene') ?? '',
      oznam:      pick(cf, 'otvaracie_hodiny_oznam',     'otvaracie_hodiny_predajna_oznam')     ?? '',
      dovolenka:  rawDovolenka === true || rawDovolenka === '1' || rawDovolenka === 'true',
      _cfKeys:    Object.keys(cf),
    };

    return hours;
  } catch (e: any) {
    console.error('[store/hours] Admin API failed:', e?.message ?? e);
    return { od: '07:00', do: '17:00', denOd: 'Pondelok', denDo: 'Sobota', zatvorene: '', oznam: '', _cfKeys: [] };
  }
});
