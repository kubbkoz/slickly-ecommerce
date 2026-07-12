// Maintenance-mode state + page. Toggled at runtime via a Redis KV flag (no
// rebuild/redeploy needed), read by server/middleware/00.maintenance.ts on every
// request and flipped by server/api/maintenance.get.ts (password-protected).
//
// A short in-memory TTL cache keeps the per-request gate from hitting Redis on
// every request: when maintenance is OFF the middleware just reads a boolean.
// A toggle takes effect on the toggling instance immediately and on any other
// instance within CACHE_TTL_MS.

const CACHE_TTL_MS = 10_000;
let cache = { value: false, at: 0 };

const STORAGE = 'db'; // Redis on VPS, filesystem on dev — same store used elsewhere
const KEY = 'maintenance:enabled';

// Baked-in toggle password (no env/webhook setup needed). Overridable at deploy
// time via MAINTENANCE_PASSWORD if you ever want to rotate it without a code edit.
// NOTE: this literal is committed in plaintext — it only gates the maintenance
// on/off switch, nothing sensitive.
export const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD || 'Fmhpx8g8@#';

/** Cheap, cached read for the per-request middleware gate. */
export async function isMaintenanceEnabled(): Promise<boolean> {
  const now = Date.now();
  if (now - cache.at < CACHE_TTL_MS) return cache.value;
  const v = await useStorage(STORAGE).getItem(KEY).catch(() => null);
  cache = { value: !!v, at: now };
  return cache.value;
}

/** Uncached read — for the admin status endpoint. */
export async function readMaintenanceRaw(): Promise<boolean> {
  const v = await useStorage(STORAGE).getItem(KEY).catch(() => null);
  return !!v;
}

/** Flip maintenance on/off and reflect it on this instance immediately. */
export async function setMaintenanceEnabled(on: boolean): Promise<void> {
  const storage = useStorage(STORAGE);
  if (on) await storage.setItem(KEY, true);
  else await storage.removeItem(KEY).catch(() => {});
  cache = { value: on, at: Date.now() };
}

/**
 * Self-contained maintenance page — black background, centred SLICKLY wordmark
 * (matches app/components/layout/navbar/Logo.vue: "SL" + amber-dotted "I" +
 * "CKLY"), and an indeterminate amber loader bar beneath it. No external assets
 * or fonts so it renders even if the app/CDN is unavailable.
 */
export function maintenancePageHtml(): string {
  return `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>SLICKLY — Údržba</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#000;color:#fff;
    font-family:'Space Grotesk','Arial Black',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
    display:flex;align-items:center;justify-content:center;
    min-height:100dvh;padding:24px;text-align:center;-webkit-font-smoothing:antialiased;
  }
  .box{display:flex;flex-direction:column;align-items:center}
  .wordmark{
    display:flex;align-items:baseline;
    font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;line-height:1;
    font-size:clamp(2.75rem,11vw,5rem);color:#fff;
  }
  .i-wrap{position:relative;display:inline-block}
  .i-dot{
    position:absolute;top:-0.32em;left:50%;transform:translateX(-50%);
    width:0.16em;height:0.16em;border-radius:9999px;background:#FFBF00;
  }
  .loader{
    position:relative;overflow:hidden;
    width:min(320px,72vw);height:4px;margin-top:2.75rem;
    background:rgba(255,255,255,0.12);border-radius:6px;
  }
  .loader .bar{
    position:absolute;top:0;height:100%;width:40%;border-radius:6px;
    background:#FFBF00;animation:slide 1.3s cubic-bezier(0.65,0,0.35,1) infinite;
  }
  @keyframes slide{0%{left:-42%}100%{left:100%}}
  .note{
    margin-top:1.75rem;color:#8a8a8a;
    font-size:0.72rem;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;
  }
  @media (prefers-reduced-motion:reduce){
    .loader .bar{animation:none;left:0;width:100%;opacity:.5}
  }
</style>
</head>
<body>
  <main class="box">
    <div class="wordmark" aria-label="SLICKLY">
      <span>SL</span><span class="i-wrap"><span class="i-dot"></span>I</span><span>CKLY</span>
    </div>
    <div class="loader" role="progressbar" aria-label="Načítava sa"><span class="bar"></span></div>
    <div class="note">Čoskoro späť</div>
  </main>
</body>
</html>`;
}
