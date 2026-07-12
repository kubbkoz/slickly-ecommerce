// Hard maintenance override for the whole site.
//
// While MAINTENANCE_ON is true, every request is covered by the maintenance page
// (server/middleware/00.maintenance.ts) EXCEPT:
//   - the admin login endpoint (server/api/maintenance-login.post.ts), and
//   - browsers that have logged in through the form on the maintenance page.
// There is NO url-parameter toggle or bypass.
//
// To bring the site back online for everyone, set MAINTENANCE_ON = false and
// redeploy (or ask Claude to flip it).
export const MAINTENANCE_ON = true;

// Admin login (baked; overridable via env). Correct credentials set an httpOnly
// session cookie that lets that browser through to the real site.
export const MAINTENANCE_LOGIN_EMAIL = (process.env.MAINTENANCE_EMAIL || 'hello@slickly.sk').trim().toLowerCase();
export const MAINTENANCE_LOGIN_PASSWORD = process.env.MAINTENANCE_PASSWORD || 'Fmhpx8g8@#';
export const MAINTENANCE_COOKIE = 'slickly_maint_session';
export const MAINTENANCE_SESSION_TOKEN = process.env.MAINTENANCE_TOKEN || 'slk-maint-ok-1f3c9a7d';

/**
 * Self-contained maintenance page — black background, centred SLICKLY wordmark
 * (matches app/components/layout/navbar/Logo.vue: "SL" + amber-dotted "I" +
 * "CKLY"), an indeterminate amber loader bar, and a click-to-open admin login
 * (e-mail + password) at the bottom that posts to /api/maintenance-login and,
 * on success, drops the session cookie and enters the site. No external assets.
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
  .box{display:flex;flex-direction:column;align-items:center;width:100%;max-width:360px}
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
  .login-toggle{
    margin-top:3.5rem;background:none;border:0;cursor:pointer;
    color:#5a5a5a;font-family:inherit;font-size:0.68rem;font-weight:600;
    letter-spacing:0.22em;text-transform:uppercase;
    padding:8px;transition:color .2s ease;
  }
  .login-toggle:hover{color:#FFBF00}
  .login{display:none;flex-direction:column;gap:10px;width:100%;margin-top:1.25rem}
  .login.open{display:flex}
  .login input{
    width:100%;height:46px;padding:0 14px;
    background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);
    border-radius:6px;color:#fff;font-family:inherit;font-size:0.95rem;outline:none;
    transition:border-color .2s ease;
  }
  .login input:focus{border-color:#FFBF00}
  .login input::placeholder{color:#6b6b6b}
  .login button[type=submit]{
    height:46px;margin-top:2px;cursor:pointer;
    background:#FFBF00;border:0;border-radius:6px;
    color:#000;font-family:inherit;font-weight:700;font-size:0.82rem;
    letter-spacing:0.14em;text-transform:uppercase;transition:opacity .2s ease;
  }
  .login button[type=submit]:hover{opacity:.9}
  .login button[disabled]{opacity:.5;cursor:default}
  .err{min-height:1rem;color:#ff6b6b;font-size:0.75rem;font-weight:600}
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
    <div class="note">Čoskoro online</div>

    <button type="button" class="login-toggle" id="loginToggle" aria-expanded="false">Prihlásenie</button>
    <form class="login" id="loginForm" autocomplete="on">
      <input id="email" name="email" type="email" placeholder="E-mail" autocomplete="username" required>
      <input id="password" name="password" type="password" placeholder="Heslo" autocomplete="current-password" required>
      <button type="submit">Vstúpiť</button>
      <div class="err" id="err" role="alert"></div>
    </form>
  </main>
  <script>
    (function(){
      var toggle=document.getElementById('loginToggle');
      var form=document.getElementById('loginForm');
      var err=document.getElementById('err');
      toggle.addEventListener('click',function(){
        var open=form.classList.toggle('open');
        toggle.setAttribute('aria-expanded',open?'true':'false');
        if(open){document.getElementById('email').focus();}
      });
      form.addEventListener('submit',async function(e){
        e.preventDefault();err.textContent='';
        var btn=form.querySelector('button[type=submit]');
        btn.disabled=true;btn.textContent='…';
        try{
          var res=await fetch('/api/maintenance-login',{
            method:'POST',headers:{'content-type':'application/json'},
            body:JSON.stringify({
              email:document.getElementById('email').value,
              password:document.getElementById('password').value
            })
          });
          if(res.ok){window.location.href='/';return;}
          err.textContent='Nesprávny e-mail alebo heslo.';
        }catch(_){err.textContent='Chyba pripojenia. Skúste znova.';}
        btn.disabled=false;btn.textContent='Vstúpiť';
      });
    })();
  </script>
</body>
</html>`;
}
