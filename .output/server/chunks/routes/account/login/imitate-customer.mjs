import { d as defineEventHandler, l as checkRateLimit, g as getQuery, c as createError, N as setCookie, E as sendRedirect, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const imitateCustomer = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  await checkRateLimit(event, { key: "imitate-customer", limit: 10, windowMs: 5 * 60 * 1e3 });
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const query = getQuery(event);
  const customerId = query.customerId;
  const token = query.token;
  const userId = query.userId;
  if (!customerId || !token || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing impersonation params (customerId, token, userId)"
    });
  }
  try {
    const base = endpoint.replace(/\/$/, "");
    const res = await $fetch.raw(`${base}/account/login/imitate-customer`, {
      method: "POST",
      headers: {
        "sw-access-key": accessToken,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: { customerId, token, userId }
    });
    const contextToken = (_b = res.headers.get("sw-context-token")) != null ? _b : (_a = res._data) == null ? void 0 : _a.contextToken;
    if (!contextToken) {
      throw new Error("No sw-context-token in Shopware response");
    }
    setCookie(event, "sw-context-token", contextToken, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      secure: true
    });
    console.log(`[imitate-customer] Success \u2014 customerId=${customerId}, userId=${userId}, token=${contextToken.slice(0, 8)}...`);
    const redirectUrl = ((_c = res._data) == null ? void 0 : _c.redirectUrl) || "/account";
    return sendRedirect(event, redirectUrl, 302);
  } catch (err) {
    console.error("[imitate-customer] FAILED:", ((_d = err == null ? void 0 : err.data) == null ? void 0 : _d.errors) || (err == null ? void 0 : err.message) || err);
    const errMsg = ((_g = (_f = (_e = err == null ? void 0 : err.data) == null ? void 0 : _e.errors) == null ? void 0 : _f[0]) == null ? void 0 : _g.detail) || "Imitation token invalid or expired";
    throw createError({
      statusCode: 401,
      statusMessage: `Imitate customer failed: ${errMsg}`
    });
  }
});

export { imitateCustomer as default };
