// Diagnostic: capture the REAL underlying SSR/server error.
//
// Why this exists: error.vue only receives Nuxt's *sanitized* NuxtError, which
// in production collapses to a generic "Server Error" with no message — so the
// ?debug=1 reveal on the error page can't show what actually threw. Nitro's
// `error` hook fires with the ORIGINAL error (real message + stack) before that
// sanitization, so we stash the last one and expose it via /api/debug/last-error.
//
// Remove this plugin + the endpoint once the intermittent first-load 500 is fixed.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error: any, context: any) => {
    try {
      const event = context?.event;
      const payload = {
        message: error?.message ?? String(error),
        statusCode: error?.statusCode ?? error?.status ?? null,
        name: error?.name ?? null,
        // cause/data often carry the real upstream detail (e.g. Shopware API body)
        cause: error?.cause ? String(error.cause?.message ?? error.cause) : null,
        data: (() => { try { return JSON.stringify(error?.data ?? error?.response?._data ?? null); } catch { return null; } })(),
        stack: (error?.stack ?? '').split('\n').slice(0, 12).join('\n'),
        url: event?.path ?? null,
        at: new Date().toISOString(),
      };
      // Also to stdout (HostCreators logs) for anyone with log access
      console.error('[SLICKLY][capture-last-error]', payload.statusCode, payload.message, '\n', payload.stack);
      await useStorage().setItem('debug:last-error', payload).catch(() => {});
    } catch {
      // never let the diagnostic itself throw
    }
  });
});
