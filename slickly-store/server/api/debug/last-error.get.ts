// Diagnostic: reads back whatever server/plugins/capture-last-error.ts last
// stashed. Open https://slickly.sk/api/debug/last-error after a 500 to see the
// REAL underlying error (message/stack/upstream data) that error.vue's
// sanitized ?debug=1 reveal cannot show in production.
//
// Remove alongside capture-last-error.ts once the intermittent first-load 500
// is fixed.
export default defineEventHandler(async () => {
  const last = await useStorage().getItem('debug:last-error').catch(() => null);
  if (!last) {
    return { message: 'No error captured yet since last server start/deploy.' };
  }
  return last;
});
