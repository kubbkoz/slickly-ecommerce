import template from './sw-product-detail-badges.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

/**
 * Override `sw-product-detail-base` — pridá kartu "MT-SPORT Badges" v editácii produktu.
 *
 * Číta z product.extensions.mtsportBadges (ManyToMany asociácia z ProductExtension.php).
 * Zápis cez sw-entity-multi-select → automaticky update pivot tabuľky mtsport_badge_product.
 *
 * Zmena sa okamžite prejaví aj v MT-SPORT Badges admin (karta Priradené produkty).
 */
Component.override('sw-product-detail-base', {
  template,

  computed: {
    productBadgesRepository() {
      return this.repositoryFactory.create(
        // entity name + property — extensions.mtsportBadges
        this.product?.extensions?.mtsportBadges?.entity || 'mtsport_badge',
      );
    },

    badgesCriteria() {
      const c = new Criteria(1, 100);
      c.addFilter(Criteria.equals('active', true));
      c.addSorting(Criteria.sort('sort', 'ASC'));
      return c;
    },
  },

  methods: {
    onMtsportBadgesChange(collection) {
      if (!this.product) return;
      if (!this.product.extensions) this.product.extensions = {};
      this.product.extensions.mtsportBadges = collection;
    },
  },
});
