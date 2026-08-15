import { d as defineEventHandler, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

function pick(cf, ...keys) {
  for (const k of keys) {
    const v = cf[k];
    if (v !== void 0 && v !== null && v !== false && v !== "") return v;
  }
  const tail = keys[0].split("_").pop();
  for (const [cfKey, val] of Object.entries(cf)) {
    if (cfKey.endsWith(`_${tail}`) && val !== void 0 && val !== null && val !== false && val !== "") return val;
  }
  return void 0;
}
const hours_get = defineEventHandler(async () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint;
  const salesChannelId = (_a = config.public.shopware.ids) == null ? void 0 : _a.salesChannel;
  try {
    const token = await getAdminToken();
    const sc = await $fetch(`${adminEndpoint}sales-channel/${salesChannelId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });
    const cf = (_d = (_c = (_b = sc == null ? void 0 : sc.data) == null ? void 0 : _b.customFields) != null ? _c : sc == null ? void 0 : sc.customFields) != null ? _d : {};
    if (!Object.keys(cf).length) {
      console.warn("[store/hours] customFields pr\xE1zdne \u2014 skontroluj Sales Channel ID alebo Admin API credentials");
    }
    const rawDovolenka = (_f = (_e = cf["otvaracie_hodiny_dovolenka"]) != null ? _e : cf["otvaracie_hodiny_predajna_dovolenka"]) != null ? _f : false;
    const hours = {
      od: (_g = pick(cf, "otvaracie_hodiny_od", "otvaracie_hodiny_predajna_od")) != null ? _g : "07:00",
      do: (_h = pick(cf, "otvaracie_hodiny_do", "otvaracie_hodiny_predajna_do")) != null ? _h : "17:00",
      denOd: (_i = pick(cf, "otvaracie_hodiny_den_od", "otvaracie_hodiny_predajna_den_od")) != null ? _i : "Pondelok",
      denDo: (_j = pick(cf, "otvaracie_hodiny_den_do", "otvaracie_hodiny_predajna_den_do")) != null ? _j : "Sobota",
      zatvorene: (_k = pick(cf, "otvaracie_hodiny_zatvorene", "otvaracie_hodiny_predajna_zatvorene")) != null ? _k : "",
      oznam: (_l = pick(cf, "otvaracie_hodiny_oznam", "otvaracie_hodiny_predajna_oznam")) != null ? _l : "",
      dovolenka: rawDovolenka === true || rawDovolenka === "1" || rawDovolenka === "true",
      _cfKeys: Object.keys(cf)
    };
    return hours;
  } catch (e) {
    console.error("[store/hours] Admin API failed:", (_m = e == null ? void 0 : e.message) != null ? _m : e);
    return { od: "07:00", do: "17:00", denOd: "Pondelok", denDo: "Sobota", zatvorene: "", oznam: "", _cfKeys: [] };
  }
});

export { hours_get as default };
