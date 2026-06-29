import template from './mtsport-sps-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-sps-list', {
  template,

  inject: ['repositoryFactory', 'acl'],

  mixins: [
    Mixin.getByName('listing'),
    Mixin.getByName('notification'),
  ],

  data() {
    return {
      shipments: null,
      isLoading: false,
      total: 0,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      selectedIds: [],
      isBulkRunning: false,
      isPrintRunning: false,
      isEndOfDayRunning: false,
    };
  },

  metaInfo() {
    return { title: this.$createTitle() };
  },

  computed: {
    repository() {
      return this.repositoryFactory.create('mtsport_sps_shipment');
    },

    httpClient() {
      return Shopware.Application.getContainer('init').httpClient;
    },

    columns() {
      return [
        { property: 'order.orderNumber', label: this.$tc('mtsport-sps.list.colOrder'), allowResize: true, primary: true },
        { property: 'mode', label: this.$tc('mtsport-sps.list.colMode'), allowResize: true },
        { property: 'pickupPointName', label: this.$tc('mtsport-sps.list.colPickup'), allowResize: true },
        { property: 'webshipStatus', label: this.$tc('mtsport-sps.list.colStatus'), allowResize: true },
        { property: 'trackingNumber', label: this.$tc('mtsport-sps.list.colTracking'), allowResize: true },
        { property: 'labelUrl', label: this.$tc('mtsport-sps.list.colLabel'), allowResize: true },
      ];
    },
  },

  methods: {
    async getList() {
      this.isLoading = true;
      const criteria = new Criteria(this.page, this.limit);
      criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));
      criteria.addAssociation('order');
      if (this.term) {
        criteria.setTerm(this.term);
      }
      try {
        const result = await this.repository.search(criteria);
        this.shipments = result;
        this.total = result.total;
      } catch (e) {
        this.createNotificationError({ message: e.message || '' });
      } finally {
        this.isLoading = false;
      }
    },

    onSelectionChange(selection) {
      const items = Object.values(selection || {});
      this.selectedIds = items.map((i) => i.orderId).filter(Boolean);
    },

    authHeaders() {
      return {
        Authorization: `Bearer ${Shopware.Service('loginService').getToken()}`,
        'Content-Type': 'application/json',
      };
    },

    async onGenerateLabels() {
      if (!this.selectedIds.length) {
        this.createNotificationWarning({ message: this.$tc('mtsport-sps.list.noSelection') });
        return;
      }
      this.isBulkRunning = true;
      try {
        const { data } = await this.httpClient.post(
          '_action/mtsport-sps/generate-labels',
          { orderIds: this.selectedIds },
          { headers: this.authHeaders() },
        );
        const msg = this.$tc('mtsport-sps.list.bulkResult', 0, {
          created: data.created, duplicate: data.duplicate, failed: data.failed,
        });
        if (data.failed > 0) {
          this.createNotificationWarning({ message: msg });
        } else {
          this.createNotificationSuccess({ message: msg });
        }
        this.getList();
      } catch (e) {
        this.createNotificationError({ message: e?.response?.data?.error || e.message || '' });
      } finally {
        this.isBulkRunning = false;
      }
    },

    async onPrintLabels() {
      this.isPrintRunning = true;
      try {
        const { data } = await this.httpClient.post(
          '_action/mtsport-sps/print-labels', {}, { headers: this.authHeaders() },
        );
        if (data.success && data.documentUrl) {
          window.open(data.documentUrl, '_blank');
          this.createNotificationSuccess({ message: this.$tc('mtsport-sps.list.printOk') });
        } else {
          this.createNotificationError({ message: data.error || this.$tc('mtsport-sps.list.printErr') });
        }
      } catch (e) {
        this.createNotificationError({ message: e?.response?.data?.error || e.message || '' });
      } finally {
        this.isPrintRunning = false;
      }
    },

    async onEndOfDay() {
      this.isEndOfDayRunning = true;
      try {
        const { data } = await this.httpClient.post(
          '_action/mtsport-sps/end-of-day', {}, { headers: this.authHeaders() },
        );
        if (data.success && data.documentUrl) {
          window.open(data.documentUrl, '_blank');
          this.createNotificationSuccess({ message: this.$tc('mtsport-sps.list.endOfDayOk') });
        } else {
          this.createNotificationError({ message: data.error || this.$tc('mtsport-sps.list.endOfDayErr') });
        }
      } catch (e) {
        this.createNotificationError({ message: e?.response?.data?.error || e.message || '' });
      } finally {
        this.isEndOfDayRunning = false;
      }
    },

    modeLabel(item) {
      return item.pickupPointId
        ? this.$tc('mtsport-sps.list.modeBalikovo')
        : this.$tc('mtsport-sps.list.modeCourier');
    },

    trackingUrl(item) {
      return item.order?.customFields?.mtsport_sps_tracking_url || null;
    },

    statusVariant(status) {
      switch (status) {
        case 'created': return 'success';
        case 'error':   return 'danger';
        case 'pending': return 'neutral';
        default:        return 'neutral';
      }
    },

    onColumnSort(column) {
      this.sortBy = column.dataIndex || column.property;
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      this.getList();
    },
  },
});
