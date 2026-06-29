# MtsportBlog — Native EntityDefinition + Admin Vue Module + Store API Route

Vlastný Shopware plugin pre headless blog. **Verzia 2.2** — natívna PHP `EntityDefinition`
+ plne interaktívne **Admin Vue UI** v sidebar "Content" + explicitný **Store API endpoint**
`POST /store-api/mtsport-article`.

> **Prečo PHP plugin a nie XML Custom Entity:**
> SW 6.7.8 má bug v custom entity XML loader-i (`DynamicEntityDefinition::ENTITY_NAME undefined`).
> Plný PHP plugin obchádza celý XML mechanism — používa štandardný EntityDefinition pattern
> aký používa samotný Shopware pre svoje built-in entity (product, order, customer, ...).

---

## Štruktúra

```
MtsportBlog/
├── composer.json
├── README.md
├── .gitignore                                 ← vendor/ (lokálne IDE deps)
└── src/
    ├── MtsportBlog.php                        ← plugin kernel (prázdny)
    ├── Resources/
    │   ├── config/services.xml                ← DI registration ArticleDefinition
    │   └── app/administration/                ← Admin Vue SPA
    │       └── src/
    │           ├── main.js                    ← entry import
    │           └── module/mtsport-blog/
    │               ├── index.js               ← module + routes + sidebar nav
    │               ├── snippet/{sk-SK,cs-CZ,en-GB}.json
    │               ├── page/
    │               │   ├── mtsport-blog-list/
    │               │   │   ├── index.js              ← list component
    │               │   │   └── mtsport-blog-list.html.twig
    │               │   └── mtsport-blog-detail/
    │               │       ├── index.js              ← detail/create form
    │               │       └── mtsport-blog-detail.html.twig
    │               └── acl/index.js           ← privileges
    ├── Migration/
    │   └── Migration1763424000Article.php     ← CREATE TABLE mtsport_article
    └── Content/Article/
        ├── ArticleDefinition.php              ← DAL entity schema
        ├── ArticleEntity.php                  ← DTO
        └── ArticleCollection.php              ← typed collection
```

## Polia entity `mtsport_article`

| Pole | Type | API | Note |
|------|------|-----|------|
| `id` | UUID (PK) | ✅ | auto-generated |
| `title` | string, required | ✅ | Nadpis článku |
| `slug` | string, required, **unique** | ✅ | URL slug (napr. `test-clanok`) |
| `teaser` | longtext | ✅ | Krátky popis pre kartu |
| `content` | longtext | ✅ | HTML obsah |
| `publishedAt` | datetime | ✅ | Publikácia (Nuxt filtruje `<= NOW`) |
| `author` | string | ✅ | Meno autora |
| `category` | string | ✅ | Filter tag (bicykle, ebike, ...) |
| `metaTitle` | string | ✅ | SEO title |
| `metaDescription` | longtext | ✅ | SEO meta description |
| `active` | bool (default `true`) | ✅ | Publikované/draft toggle |
| `coverId` | FK → media | ✅ | Titulný obrázok |
| `cover` | many-to-one media | ✅ | Resolved media entity |

Všetky polia majú `ApiAware` flag → exposed v **Store API** (`/store-api/mtsport-article`) aj **Admin API** (`/api/mtsport-article`).

---

## Inštalácia na VPS

### Prvá inštalácia (čistý SW)

```bash
# 1. Skopíruj plugin (z localhostu)
scp -r d:/mtstore-nuxt/shopware-plugins/MtsportBlog/ user@vps:/var/www/<SW_DIR>/custom/plugins/

# 2. Na VPS
cd /var/www/<SW_DIR>

# 3. Cleanup eventual XML zvyškov
mysql -u <user> -p<pass> <db> <<SQL
DELETE FROM custom_entity WHERE name LIKE '%mtsport%';
DROP TABLE IF EXISTS ce_mtsport_article, ce_mtsport_article_translation;
SQL

# 4. Autoload + cache reset
rm -rf var/cache/*
composer dump-autoload -o
php8.3 bin/console cache:clear

# 5. Install + activate
php8.3 bin/console plugin:refresh
php8.3 bin/console plugin:install --activate MtsportBlog -vvv 2>&1 | tail -20

# 6. BUILD ADMIN SPA (kritické pre Admin UI!)
./bin/build-administration.sh
# alebo:
composer run build:js:admin

# 7. Final cache clear
php8.3 bin/console cache:clear

# 8. Verifikácia
php8.3 bin/console debug:container | grep mtsport_article
mysql -u <user> -p<pass> <db> -e "SHOW TABLES LIKE 'mtsport%'"
```

### Update existujúcej inštalácie (z v2.0 → v2.1)

```bash
# Re-upload + admin rebuild (entity backend ostáva, len pribudol admin module)
scp -r d:/mtstore-nuxt/shopware-plugins/MtsportBlog/ user@vps:/var/www/<SW_DIR>/custom/plugins/

cd /var/www/<SW_DIR>
composer dump-autoload -o
php8.3 bin/console plugin:update MtsportBlog
./bin/build-administration.sh
php8.3 bin/console cache:clear
```

**Po inštalácii v Admin** (hard refresh `Ctrl+Shift+R`):
- Sidebar **Content → MT-SPORT Blog** (červená ikona) → klik
- Listing prázdny → **Pridať článok** → vyplniť → **Uložiť**
- Článok sa zobrazí v listingu, dá sa editovať/zmazať

## Test Store API

```bash
ACCESS_KEY="<sw-access-key z .env NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN>"

# Empty listing (žiadne články zatiaľ)
curl -X POST https://mtsport.store/store-api/mtsport-article \
  -H "sw-access-key: $ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
# Očakávané: {"elements":[],"total":0,...}
```

---

## Vytvorenie článku — odporúčaný spôsob (Admin UI)

**Sidebar Content → MT-SPORT Blog** → **Pridať článok** → vyplniť formulár → **Uložiť**.

Admin UI obsahuje:
- **Obsah card:** title, slug (auto-generated z title pri blur), teaser, rich-text content editor
- **Metadata card:** author, category (dropdown), publishedAt (datetime picker), active (toggle)
- **Cover card:** Media picker (file upload alebo Media manager)
- **SEO card:** metaTitle, metaDescription

Klávesové skratky: `Ctrl/Cmd + S` save, `Esc` cancel.

---

## Alternatíva — Admin API REST (programaticky)

Pre integrácie (n8n, externé tools, scripts) — REST API endpointy.

### 1. Get Admin token

```bash
curl -X POST https://mtsport.store/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "<ADMIN_CLIENT_ID>",
    "client_secret": "<ADMIN_CLIENT_SECRET>"
  }'
# Response: { "access_token": "Bearer ...", "expires_in": 600 }
```

### 2. Upload cover image (voliteľné)

```bash
# A) Vytvor media row
MEDIA_ID=$(curl -s -X POST https://mtsport.store/api/media \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r '.data.id')

# B) Upload file na to media id
curl -X POST "https://mtsport.store/api/_action/media/$MEDIA_ID/upload?fileName=test-cover&extension=jpg" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: image/jpeg" \
  --data-binary @/path/to/cover.jpg
```

### 3. Create article

```bash
curl -X POST https://mtsport.store/api/mtsport-article \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Testovací článok",
    "slug": "test-clanok",
    "teaser": "Krátky popis článku ktorý sa zobrazí v kartách.",
    "content": "<p>Plný HTML obsah článku s <strong>formátovaním</strong>.</p>",
    "publishedAt": "2026-05-16T00:00:00.000Z",
    "author": "Jakub Žiavka",
    "category": "bicykle",
    "metaTitle": "Testovací článok | MT-SPORT",
    "metaDescription": "Test SEO description.",
    "active": true,
    "coverId": "<MEDIA_ID alebo null>"
  }'
# Response: 204 No Content (success)
```

### 4. List/update/delete

```bash
# List
curl -X POST https://mtsport.store/api/search/mtsport-article \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}'

# Update
curl -X PATCH https://mtsport.store/api/mtsport-article/<ARTICLE_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Nový nadpis"}'

# Delete
curl -X DELETE https://mtsport.store/api/mtsport-article/<ARTICLE_ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

## Lokálny IDE setup (voliteľné — len pre VSCode/PhpStorm)

VSCode hlási *"Use of unknown class"* errors v PHP súboroch — sú to **false-positives** (kód funguje na VPS).
Príčina: lokálny IDE nemá Shopware classes v `vendor/`.

Fix (potrebuje PHP + composer lokálne):
```bash
cd shopware-plugins/MtsportBlog
composer install --ignore-platform-reqs --no-scripts
```

`vendor/` je v `.gitignore` — nezahrnie sa do gitu/deploy.

---

## Budúce rozšírenia (v2.2+)

- **Translations** — pridať `ArticleTranslationDefinition.php` + admin language switcher (built-in v `sw-page`)
- **Tags** — many-to-many na `tag` entitu pre flexible filtering
- **Comments** — vlastná `mtsport_article_comment` child entita
- **CMS layout integration** — `cms-aware="true"` v ArticleDefinition pre rich page builder

---

## Deinštalácia

```bash
# Zachová DB (články ostanú)
php8.3 bin/console plugin:uninstall --keep-user-data MtsportBlog

# Vymaže aj DB tabuľku
php8.3 bin/console plugin:uninstall MtsportBlog
php8.3 bin/console cache:clear
```

---

## Troubleshooting

| Problém | Riešenie |
|---|---|
| `Class Mtsport\Blog\... not found` | `composer dump-autoload -o` v SW root |
| `Table mtsport_article doesn't exist` | Plugin nainštalovaný ale migration nezbehol. `plugin:uninstall` + `plugin:install --activate` |
| Store API vracia 404 | `cache:clear` + skontroluj že entita je v `debug:container | grep mtsport_article` |
| 401 Unauthorized | Bad `sw-access-key` v Nuxt `.env` |
