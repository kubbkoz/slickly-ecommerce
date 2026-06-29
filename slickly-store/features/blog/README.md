# Blog Feature — SLICKLY

> Headless blog cez **vlastný Shopware plugin** (`MtsportBlog`) + Nuxt Layer.
> Backend: Custom DAL Entity `mtsport_article` (definovaná v plugin `entities.xml`).
> Frontend: feature priečinok v Nuxt layeri.

---

## Štruktúra layeru (frontend)

```
mtsport-store/features/blog/
├── nuxt.config.ts                  ← layer marker
├── README.md                       ← tento súbor
├── types.ts                        ← BlogPost, BlogPostDetail
├── pages/blog/
│   ├── index.vue                   ← /blog (listing)
│   └── [slug].vue                  ← /blog/{slug} (detail)
├── server/api/blog/
│   ├── listing.get.ts              ← GET /api/blog/listing → Store API mtsport-article
│   ├── [slug].get.ts               ← GET /api/blog/{slug} → filter by slug
│   └── refresh.post.ts             ← POST /api/blog/refresh (cache bust)
└── components/blog/
    ├── BlogCard.vue
    └── BlogHero.vue
```

## Súvisiace komponenty (backend)

```
d:/mtstore-nuxt/shopware-plugins/MtsportBlog/   ← Shopware plugin (zdrojový kód)
├── composer.json
├── src/MtsportBlog.php
└── src/Resources/config/entities.xml           ← DAL entity schema
```

---

## Aktivácia layeru

V hlavnom `mtsport-store/nuxt.config.ts`:

```ts
extends: ["../vue-starter-template", "./features/blog"],
```

Žiaden ďalší config. Layer sa zlúči pri builde.

---

## Setup (jednorazovo)

### 1. Nainštalovať Shopware plugin na VPS

Podľa `shopware-plugins/MtsportBlog/README.md`:
```bash
# kopírovať plugin na VPS, potom:
php bin/console plugin:refresh
php bin/console plugin:install --activate MtsportBlog
php bin/console cache:clear
```

### 2. Vytvoriť prvý článok v SW Admin

- **Content → SLICKLY Blog → Create new article**
- Vyplniť: title, slug, teaser, content, cover, author, category, published_at, meta.

### 3. (Voliteľné) Premazať starý `blog_meta` custom field group

Ak ostal z predošlých pokusov (Landing Pages / Categories variant):
- `Settings → System → Custom fields → blog_meta → Delete`

### 4. Reštart Nuxt dev servera

```bash
cd mtsport-store && npm run dev
```

---

## Architektúra — 3 vrstvy

### Vrstva 1: Shopware backend (`MtsportBlog` plugin)

- Vlastná DAL entita `mtsport_article` (DB tabuľky `mtsport_article` + `mtsport_article_translation`).
- Polia: `title`, `slug`, `teaser`, `content` (HTML), `published_at`, `author`, `category`, `meta_title`, `meta_description`, `cover` (many-to-one → media).
- Translations natívne (cez SW translation system).
- Admin UI auto-generovaná z `entities.xml` — žiadny Vue kód v plugin.
- Store API endpoint **automaticky exposed**: `POST /store-api/mtsport-article`.
- Public access cez `sw-access-key` (žiadne OAuth, žiadny Admin token).

### Vrstva 2: Nitro server API (Nuxt proxy + Redis cache)

**`GET /api/blog/listing[?category=X]`** — `server/api/blog/listing.get.ts`
1. Redis cache check (`blog:listing:{category|all}`, TTL 30 min).
2. Cache miss → `POST {STORE_API}/mtsport-article` s filtrami:
   - `range publishedAt lte NOW` (publikované)
   - Voliteľne: `equals category {X}`
3. Sort DESC podľa `publishedAt`.
4. Map na clean `BlogPost[]` (translated title/teaser, cover URL z `cover.url`).
5. Cache + return.

**`GET /api/blog/{slug}`** — `server/api/blog/[slug].get.ts`
1. Redis cache check (`blog:post:{slug}`).
2. Cache miss → POST s filtrami `equals slug + range publishedAt lte NOW`, `limit 1`.
3. Map na `BlogPostDetail` s plným HTML obsahom + SEO meta.
4. 404 ak nenájdený, 502 pri chybe Store API.

**`POST /api/blog/refresh`** — `server/api/blog/refresh.post.ts`
- Mazne všetky Redis kľúče `blog:*`.
- Auth: `X-Webhook-Secret: $WEBHOOK_SECRET`.
- Použitie: webhook z SW admin alebo manuálne `curl`.

### Vrstva 3: Nuxt pages (UI)

**`/blog`** — listing s `<BlogCard />` gridom, query `?category=X`.
**`/blog/{slug}`** — `<BlogHero />` + sanitized `v-html` content + SEO meta.

---

## Prečo Custom Entity (a nie OpenBlogware / Landing Pages / Categories)

| Vlastnosť | Custom Entity (`mtsport_article`) | OpenBlogware | Landing Pages | Categories type=page |
|---|---|---|---|---|
| Stabilita | ✅ Plný control | ❌ 3rd party bugs (assoc errors) | ✅ | ✅ |
| Sémantika dát | ✅ Clean: title/slug/content | ⚠️ Plugin schema | ⚠️ `url`/`name` = slug/title | ⚠️ Categories tree |
| Custom fields | ✅ Native (žiadne `customFields.x_y_z`) | ⚠️ Plugin specific | ❌ Custom field group | ❌ Custom field group |
| Store API | ✅ Auto (`/store-api/mtsport-article`) | ⚠️ `/store-api/blog` (header issues) | ❌ (len Admin API) | ✅ `/store-api/category` |
| Admin UI | ✅ Auto z entities.xml | ✅ Plugin module | ⚠️ Marketing context | ⚠️ Mixed s product tree |
| Maintenance | ✅ Iba pri major SW upgrade | ❌ Tied to plugin author | ✅ SW core | ✅ SW core |
| Performance | ✅ Indexed slug | ✅ | ⚠️ Admin API rate limits | ✅ |
| **Total** | ✅ **Najčistejšie pre headless** | ❌ | ⚠️ | ⚠️ |

---

## Cache flow (Redis)

| Kľúč | TTL | Obsah |
|------|-----|-------|
| `blog:listing:all` | 30 min | `BlogPost[]` všetkých publikovaných |
| `blog:listing:{category}` | 30 min | `BlogPost[]` filtrovaných |
| `blog:post:{slug}` | 30 min | `BlogPostDetail` |

**Invalidácia:**
- TTL fallback: 30 min.
- Manuálne: `curl -X POST http://localhost:3000/api/blog/refresh -H "X-Webhook-Secret: $WEBHOOK_SECRET"`.
- Pri Redis výpadku: `.catch(() => null)` → každý request priamo Store API (slow ale funkčné).

---

## Rozšírenia (TODO)

- **Pagination:** Listing limit 50. Pre väčší objem pridať `?page=` + `limit=`.
- **Multi-language:** Pridať `sw-language-id` header, zahrnúť `lang` do cache key.
- **Archív podľa roku/mesiaca:** Pridať `pages/blog/archiv/[year].vue` + endpoint s `range` filtrom na `publishedAt`.
- **RSS feed:** `server/routes/blog.xml.get.ts` → XML z listing dát.
- **n8n webhook:** SW admin trigger po save mtsport-article → POST na `/api/blog/refresh` (automatická invalidácia).
- **Tags / Author entity:** Pridať `many-to-many` v `entities.xml` ak treba structured filter.

---

## Debugging

**Empty listing:**
1. Skontrolovať že plugin `MtsportBlog` je aktivovaný v SW admin → Extensions.
2. Skontrolovať že článok má `published_at` <= dnes.
3. Test priamo: `curl http://localhost:3000/api/blog/listing`.
4. Test priamo SW: `curl -X POST https://mtsport.store/store-api/mtsport-article -H 'sw-access-key: XXX' -H 'Content-Type: application/json' -d '{}'`.

**404 na detail:**
- Slug v URL musí presne sedieť s `slug` poľom v SW (case-sensitive).
- `curl http://localhost:3000/api/blog/{slug}` → JSON alebo 404.

**Cache nevracia fresh dáta po edite:**
- Bust cache: `curl -X POST http://localhost:3000/api/blog/refresh -H "X-Webhook-Secret: ..."`.
- Alebo počkať 30 min (TTL).

**500 z Store API:**
- Skontrolovať že plugin je nainštalovaný + aktivovaný + cache:clear bol spustený.
- Skontrolovať v SW Admin → Extensions → MtsportBlog → status.
