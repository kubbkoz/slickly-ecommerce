# Nasadenie na HostCreators

Tento dokument popisuje, ako je projekt nasadený na shared hostingu **HostCreators**
(doména `https://www.slickly.sk`) cez Git deploy ("GIT aplikácia") a aké nastavenia
sú potrebné, aby appka po `git push` naozaj nabehla.

## Princíp

HostCreators "GIT aplikácia" pri každom push-i na sledovaný branch:

1. naklonuje repo do nového `release_<timestamp>` priečinka pod
   `/slickly.sk/web/current/`
2. spustí `04_deploy_build-2.0` — `npm install` + nakonfigurovaný build krok
3. prepne symlink `current` na nový release

Doména `www.slickly.sk` je nakonfigurovaná ako **reverse proxy na bežiaci Node
proces** tejto appky (nie ako statický web server) — preto musí appka po builde
bežať ako server (`nuxt build` → Nitro `node-server` preset), **nie** ako
`nuxt generate` (statický výstup spôsoboval `502 Bad Gateway`, lebo proxy
nemala kam smerovať).

## Build & deploy nastavenia (panel HostCreators)

- **Build krok**: `npm run build` (NIE `npm run generate`)
- **Start krok**: `npm run start` → spúšťa `node .output/server/index.mjs`
  (skript `start` je definovaný v `package.json`)
- **Premenné prostredia** ("Premenné prostredia"):
  ```
  PORT=3000
  HOST=0.0.0.0
  ```
  Bez `HOST=0.0.0.0` Nitro server počúva len na `localhost` a proxy sa naň
  nedostane.
- **Cesta k web adresáru**: nechať na default `/slickly.sk/web/current/`
  (výsledná cesta `/slickly.sk/web/current/current/`). Pri proxy režime sa
  táto cesta priamo nepoužíva na servovanie obsahu.
- **Relatívna public cesta k webu** (v "Viac o aplikácii"): nechať **prázdne**.

## Po každom deployi

Build pipeline (`npm install` + `npm run build`) sa spustí automaticky po
push-i, ale **bežiaci Node proces sa nemusí automaticky reštartovať** na nový
release. Po dokončení deployu (sekcia "Aplikácia bola úspešne aktualizovaná")
je potrebné v "Viac o aplikácii" kliknúť na:

```
Spustiť aplikáciu
```

Tým sa proces reštartuje a začne servovať z najnovšieho `current` releasu.

## Diagnostika chýb

| Chyba | Príčina | Riešenie |
|---|---|---|
| `403 Forbidden` | Chýba `npm run start` skript, alebo doc root smeruje na priečinok bez `index.html`/bežiaceho procesu | Skontrolovať `package.json` skript `start`, build = `npm run build` |
| `502 Bad Gateway` | Proxy nemá kam smerovať — appka beží zo statického (`nuxt generate`) releasu bez servera, alebo proces nebeží/nepočúva na správnom hoste/porte | Build = `npm run build`, nastaviť `PORT=3000` + `HOST=0.0.0.0`, kliknúť "Spustiť aplikáciu" |
| Stránka ukazuje starý obsah po deployi | Bežiaci proces nebol reštartovaný | Kliknúť "Spustiť aplikáciu" v "Viac o aplikácii" |

## Lokálny build/preview

```bash
npm run build     # SSR build (Nitro node-server) — rovnaké ako na hostingu
PORT=3000 HOST=0.0.0.0 node .output/server/index.mjs
```
