// Registers the minimal installability-only service worker (public/sw.js).
// Deferred to an idle moment so it doesn't compete with initial render/hydration
// for the main thread — installability doesn't need to happen in the first frame.
export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return;

  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[PWA] Service worker registration failed:', err);
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(register, { timeout: 5000 });
  } else {
    setTimeout(register, 2000);
  }
});
