import template from './mtsport-badge-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;

function parseIds(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && x.length > 0) : [];
  } catch {
    return [];
  }
}

function stringifyIds(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return JSON.stringify(arr);
}

function emptyCollection(entityRoute, entityName) {
  return new EntityCollection(`/${entityRoute}`, entityName, Shopware.Context.api, new Criteria());
}

/**
 * Konfigurácia pre 5 entít — centrálna mapa pre fallback UUID systém.
 * Každá entita má: collection key, badge field, repository getter, snake_case route.
 */
const ENTITY_MAP = {
  category:       { collection: 'categoryCollection',      badgeField: 'applyCategoryIds',      repo: 'categoryRepository',     entityName: 'category',             route: 'category' },
  product:        { collection: 'productCollection',       badgeField: 'applyProductIds',       repo: 'productRepository',      entityName: 'product',              route: 'product' },
  manufacturer:   { collection: 'manufacturerCollection',  badgeField: 'applyManufacturerIds',  repo: 'manufacturerRepository', entityName: 'product_manufacturer', route: 'product-manufacturer' },
  productStream:  { collection: 'productStreamCollection', badgeField: 'applyProductStreamIds', repo: 'productStreamRepository',entityName: 'product_stream',       route: 'product-stream' },
  tag:            { collection: 'tagCollection',           badgeField: 'applyTagIds',           repo: 'tagRepository',          entityName: 'tag',                  route: 'tag' },
};

Component.register('mtsport-badge-detail', {
  template,
  inject: ['repositoryFactory', 'acl'],
  mixins: [Mixin.getByName('notification'), Mixin.getByName('placeholder')],
  shortcuts: { 'SYSTEMKEY+S': 'onSave', ESCAPE: 'onCancel' },

  props: { badgeId: { type: String, required: false, default: null } },

  data() {
    return {
      badge: null,
      isLoading: false,
      isSaveSuccessful: false,

      // EntityCollections
      categoryCollection: null,
      productCollection: null,
      manufacturerCollection: null,
      productStreamCollection: null,
      tagCollection: null,

      // Fallback UUID textarey (per entita)
      rawInputs: {
        category: '',
        product: '',
        manufacturer: '',
        productStream: '',
        tag: '',
      },

      // Toggle viditeľnosti fallback textarey (per entita)
      showRaw: {
        category: false,
        product: false,
        manufacturer: false,
        productStream: false,
        tag: false,
      },
    };
  },

  metaInfo() {
    return { title: this.$createTitle(this.identifier) };
  },

  computed: {
    identifier() {
      return this.badge?.name || this.$tc('mtsport-badge.detail.textHeadlineCreate');
    },
    isCreating() {
      return !this.badgeId;
    },
    tooltipSave() {
      return { message: this.$device.getSystemKey() + ' + S', appearance: 'light' };
    },

    repository()              { return this.repositoryFactory.create('mtsport_badge'); },
    categoryRepository()      { return this.repositoryFactory.create('category'); },
    productRepository()       { return this.repositoryFactory.create('product'); },
    manufacturerRepository()  { return this.repositoryFactory.create('product_manufacturer'); },
    productStreamRepository() { return this.repositoryFactory.create('product_stream'); },
    tagRepository()           { return this.repositoryFactory.create('tag'); },

    productCriteria() {
      const c = new Criteria(1, 25);
      c.addFilter(Criteria.equals('product.parentId', null));
      return c;
    },

    positionOptions() {
      return [
        { value: 'both', label: this.$tc('mtsport-badge.detail.positionBoth') },
        { value: 'card', label: this.$tc('mtsport-badge.detail.positionCard') },
        { value: 'pdp',  label: this.$tc('mtsport-badge.detail.positionPdp') },
      ];
    },
    pdpPositionOptions() {
      return [
        { value: 'top',   label: this.$tc('mtsport-badge.detail.pdpPositionTop') },
        { value: 'image', label: this.$tc('mtsport-badge.detail.pdpPositionImage') },
      ];
    },
    sizeOptions() {
      return [
        { value: 'sm', label: this.$tc('mtsport-badge.detail.sizeSm') },
        { value: 'md', label: this.$tc('mtsport-badge.detail.sizeMd') },
        { value: 'lg', label: this.$tc('mtsport-badge.detail.sizeLg') },
      ];
    },

    previewStyle() {
      if (!this.badge) return {};
      const size = this.badge.size || 'md';
      const sizeMap = {
        sm: { padding: '2px 7px',  fontSize: '10px' },
        md: { padding: '4px 10px', fontSize: '12px' },
        lg: { padding: '6px 14px', fontSize: '14px' },
      };
      return {
        backgroundColor: this.badge.bgColor || '#22c55e',
        color: this.badge.textColor || '#ffffff',
        display: 'inline-block',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        ...sizeMap[size],
      };
    },
  },

  created() {
    this.createdComponent();
  },
  watch: {
    badgeId() {
      this.createdComponent();
    },
  },

  methods: {
    async createdComponent() {
      if (this.isCreating) {
        this.badge = this.repository.create(Shopware.Context.api);
        Object.assign(this.badge, {
          name: '',
          text: '',
          bgColor: '#22c55e',
          textColor: '#ffffff',
          position: 'both',
          pdpPosition: 'top',
          size: 'md',
          active: true,
          sort: 0,
          applyProductIds: null,
          applyCategoryIds: null,
          applyTagIds: null,
          applyManufacturerIds: null,
          applyProductStreamIds: null,
          applyIsNewDays: null,
          applyHasDiscount: false,
        });
        this.initEmptyCollections();
        return;
      }
      await this.loadBadge();
    },

    initEmptyCollections() {
      for (const cfg of Object.values(ENTITY_MAP)) {
        this[cfg.collection] = emptyCollection(cfg.route, cfg.entityName);
      }
    },

    async loadBadge() {
      this.isLoading = true;
      try {
        const criteria = new Criteria();
        criteria.addAssociation('products');
        this.badge = await this.repository.get(this.badgeId, Shopware.Context.api, criteria);
        if (this.badge) {
          this.badge.bgColor          = this.badge.bgColor          ?? '#22c55e';
          this.badge.textColor        = this.badge.textColor        ?? '#ffffff';
          this.badge.position         = this.badge.position         ?? 'both';
          this.badge.pdpPosition      = this.badge.pdpPosition      ?? 'top';
          this.badge.size             = this.badge.size             ?? 'md';
          this.badge.sort             = this.badge.sort             ?? 0;
          this.badge.applyHasDiscount = this.badge.applyHasDiscount ?? false;
        }

        await Promise.all(
          Object.entries(ENTITY_MAP).map(([key, cfg]) =>
            this.loadEntityCollection(cfg.collection, this[cfg.repo], cfg.entityName, parseIds(this.badge?.[cfg.badgeField])),
          ),
        );

        // Sync raw textareas (predvyplníme aktuálne uložené UUIDs)
        for (const key of Object.keys(ENTITY_MAP)) {
          this.syncRawFromCollection(key);
        }
      } catch (e) {
        this.createNotificationError({ message: e.message || '' });
        this.initEmptyCollections();
      } finally {
        this.isLoading = false;
      }
    },

    async loadEntityCollection(stateKey, repository, entityName, ids) {
      const route = entityName.replace(/_/g, '-');
      if (!ids?.length) {
        this[stateKey] = emptyCollection(route, entityName);
        return;
      }
      try {
        const criteria = new Criteria(1, Math.max(ids.length, 25));
        criteria.setIds(ids);
        this[stateKey] = await repository.search(criteria, Shopware.Context.api);
      } catch (e) {
        console.error(`[badge] Failed to load ${entityName}:`, e);
        this[stateKey] = emptyCollection(route, entityName);
      }
    },

    // ── sw-entity-multi-select — vracia celú EntityCollection ────────────────
    onCategoriesChange(collection)      { this.applyCollectionChange('category',      collection); },
    onProductsChange(collection)        { this.applyCollectionChange('product',       collection); },
    onManufacturersChange(collection)   { this.applyCollectionChange('manufacturer',  collection); },
    onProductStreamsChange(collection)  { this.applyCollectionChange('productStream', collection); },
    onTagsChange(collection)            { this.applyCollectionChange('tag',           collection); },

    applyCollectionChange(key, collection) {
      const cfg = ENTITY_MAP[key];
      this[cfg.collection] = collection;
      this.badge[cfg.badgeField] = stringifyIds(collection?.getIds?.() ?? []);
      this.syncRawFromCollection(key);
    },

    // ── Generický fallback UUID systém pre všetkých 5 entít ──────────────────
    /** Skopíruje aktuálne UUID z collection do raw textarey (preview / export). */
    syncRawFromCollection(key) {
      const cfg = ENTITY_MAP[key];
      const ids = this[cfg.collection]?.getIds?.() ?? [];
      this.rawInputs[key] = ids.join('\n');
    },

    /** Parsuje text (čiarka / newline / medzera) → pole UUIDs (32-hex, lowercase, dedup). */
    parseRawUuids(raw) {
      if (!raw) return [];
      const UUID_RE = /[0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
      const matches = String(raw).match(UUID_RE) || [];
      const seen = new Set();
      const out = [];
      for (const m of matches) {
        const id = m.replace(/-/g, '').toLowerCase();
        if (id.length === 32 && !seen.has(id)) {
          seen.add(id);
          out.push(id);
        }
      }
      return out;
    },

    /** Aplikuje raw textareu na danú entitu — fetchne entity a nahradí collection. */
    async applyRawIds(key) {
      const cfg = ENTITY_MAP[key];
      const ids = this.parseRawUuids(this.rawInputs[key]);

      if (!ids.length) {
        this[cfg.collection] = emptyCollection(cfg.route, cfg.entityName);
        this.badge[cfg.badgeField] = null;
        this.createNotificationInfo({ message: this.$tc('mtsport-badge.detail.notifyIdsCleared') });
        return;
      }

      try {
        await this.loadEntityCollection(cfg.collection, this[cfg.repo], cfg.entityName, ids);
        const loadedIds = this[cfg.collection]?.getIds?.() ?? [];
        this.badge[cfg.badgeField] = stringifyIds(loadedIds);

        const missing = ids.length - loadedIds.length;
        if (missing > 0) {
          this.createNotificationWarning({
            message: this.$tc('mtsport-badge.detail.notifyIdsPartial', 0, { loaded: loadedIds.length, total: ids.length }),
          });
        } else {
          this.createNotificationSuccess({
            message: this.$tc('mtsport-badge.detail.notifyIdsApplied', 0, { count: loadedIds.length }),
          });
        }
        this.syncRawFromCollection(key);
      } catch (e) {
        this.createNotificationError({ message: e.message || 'Failed to apply IDs' });
      }
    },

    async onSave() {
      if (!this.badge?.name || !this.badge?.text) {
        this.createNotificationError({ message: this.$tc('mtsport-badge.notification.saveError') });
        return;
      }
      this.isLoading = true;

      // DIAGNOSTIKA — čo posielame (pre porovnanie po save)
      const sent = {
        size:                  this.badge.size,
        pdpPosition:           this.badge.pdpPosition,
        position:              this.badge.position,
        sort:                  this.badge.sort,
        applyCategoryIds:      this.badge.applyCategoryIds,
        applyProductIds:       this.badge.applyProductIds,
        applyManufacturerIds:  this.badge.applyManufacturerIds,
        applyProductStreamIds: this.badge.applyProductStreamIds,
        applyTagIds:           this.badge.applyTagIds,
      };
      console.log('[badge SAVE → request]', sent);

      try {
        const wasCreating = this.isCreating;
        const newId = this.badge.id;

        await this.repository.save(this.badge, Shopware.Context.api);

        this.isSaveSuccessful = true;
        this.createNotificationSuccess({ message: this.$tc('mtsport-badge.notification.saveSuccess') });

        if (wasCreating) {
          this.$router.push({ name: 'mtsport.badge.detail', params: { id: newId } });
          return;
        }

        // Refresh entity (bez collection reloadu) + porovnaj čo prišlo
        try {
          const fresh = await this.repository.get(this.badgeId, Shopware.Context.api, new Criteria());
          if (fresh) {
            const got = {
              size:                  fresh.size,
              pdpPosition:           fresh.pdpPosition,
              position:              fresh.position,
              sort:                  fresh.sort,
              applyCategoryIds:      fresh.applyCategoryIds,
              applyProductIds:       fresh.applyProductIds,
              applyManufacturerIds:  fresh.applyManufacturerIds,
              applyProductStreamIds: fresh.applyProductStreamIds,
              applyTagIds:           fresh.applyTagIds,
            };
            console.log('[badge SAVE ← response]', got);

            const lost = [];
            for (const k of Object.keys(sent)) {
              const a = sent[k];
              const b = got[k];
              const sentNonEmpty = a !== null && a !== undefined && a !== '';
              if (sentNonEmpty && JSON.stringify(a) !== JSON.stringify(b)) {
                lost.push(`${k}: sent=${JSON.stringify(a)} got=${JSON.stringify(b)}`);
              }
            }
            if (lost.length) {
              console.error('[badge SAVE ✗ lost fields]', lost);
              this.createNotificationWarning({
                message:
                  'Niektoré polia neboli uložené (' + lost.length + '). ' +
                  'Skontroluj BadgeDefinition.php na VPS + cache:clear. Detail v console.',
              });
            }

            // Sync scalary z čerstvého stavu (collections nedotýkame)
            this.badge.name             = fresh.name;
            this.badge.text             = fresh.text;
            this.badge.bgColor          = fresh.bgColor          ?? '#22c55e';
            this.badge.textColor        = fresh.textColor        ?? '#ffffff';
            this.badge.position         = fresh.position         ?? 'both';
            this.badge.pdpPosition      = fresh.pdpPosition      ?? 'top';
            this.badge.size             = fresh.size             ?? 'md';
            this.badge.sort             = fresh.sort             ?? 0;
            this.badge.active           = fresh.active           ?? true;
            this.badge.applyIsNewDays   = fresh.applyIsNewDays   ?? null;
            this.badge.applyHasDiscount = fresh.applyHasDiscount ?? false;
          }
        } catch (e) {
          console.warn('[badge] post-save refresh failed:', e);
        }
      } catch (e) {
        console.error('[badge SAVE error]', e);
        this.createNotificationError({ message: e.message || this.$tc('mtsport-badge.notification.saveError') });
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$router.push({ name: 'mtsport.badge.list' });
    },

    async onDelete() {
      if (this.isCreating || !this.badge?.id) return;
      if (!window.confirm(this.$tc('mtsport-badge.notification.deleteConfirm'))) return;
      this.isLoading = true;
      try {
        await this.repository.delete(this.badge.id, Shopware.Context.api);
        this.createNotificationSuccess({ message: this.$tc('mtsport-badge.notification.deleteSuccess') });
        this.$router.push({ name: 'mtsport.badge.list' });
      } catch (e) {
        this.createNotificationError({ message: e.message || this.$tc('mtsport-badge.notification.deleteError') });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
