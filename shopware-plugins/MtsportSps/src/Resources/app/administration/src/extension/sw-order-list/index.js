import template from './sw-order-list.html.twig';

const { Component } = Shopware;

/**
 * Override `sw-order-list` — 3 stĺpce v zozname objednávok:
 *   - Kuriér     (customFields.mtsport_sps_courier — SPS / TOPTRANS), text
 *   - Štítok     (odklik „Štítok" → PDF; customFields.mtsport_sps_label_url)
 *   - Sledovanie (klikateľné číslo zásielky → T&T; mtsport_sps_tracking + _tracking_url)
 *
 * Stĺpce sú definované cez property-path (customFields sa načítajú s objednávkou),
 * takže DÁTA sa zobrazia vždy; slot šablóny (twig) ich premenia na klikateľné odkazy.
 */
Component.override('sw-order-list', {
  template,

  methods: {
    getOrderColumns() {
      const columns = this.$super('getOrderColumns');
      columns.push(
        {
          property: 'customFields.mtsport_sps_courier',
          label: this.$tc('mtsport-sps.order.colCourier'),
          allowResize: true,
          visible: true,
          sortable: false,
        },
        {
          property: 'customFields.mtsport_sps_label_url',
          label: this.$tc('mtsport-sps.order.colLabel'),
          allowResize: true,
          visible: true,
          sortable: false,
        },
        {
          property: 'customFields.mtsport_sps_tracking',
          label: this.$tc('mtsport-sps.order.colTracking'),
          allowResize: true,
          visible: true,
          sortable: false,
        },
      );
      return columns;
    },
  },
});
