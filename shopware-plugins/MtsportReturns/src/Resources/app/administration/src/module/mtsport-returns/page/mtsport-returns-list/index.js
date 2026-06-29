import template from './mtsport-returns-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-returns-list', {
  template,

  inject: ['repositoryFactory', 'acl'],

  mixins: [
    Mixin.getByName('listing'),
    Mixin.getByName('notification'),
  ],

  data() {
    return {
      requests: null,
      isLoading: false,
      total: 0,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      filterFormType: '',
      filterStatus: '',
    };
  },

  metaInfo() {
    return { title: this.$createTitle() };
  },

  computed: {
    repository() {
      return this.repositoryFactory.create('mtsport_return_request');
    },

    columns() {
      return [
        {
          property: 'referenceNumber',
          dataIndex: 'referenceNumber',
          label: this.$tc('mtsport-returns.list.columnReference'),
          routerLink: 'mtsport.returns.detail',
          allowResize: true,
          primary: true,
        },
        {
          property: 'formType',
          dataIndex: 'formType',
          label: this.$tc('mtsport-returns.list.columnFormType'),
          allowResize: true,
        },
        {
          property: 'orderNumber',
          dataIndex: 'orderNumber',
          label: this.$tc('mtsport-returns.list.columnOrderNumber'),
          allowResize: true,
        },
        {
          property: 'customerName',
          dataIndex: 'customerName',
          label: this.$tc('mtsport-returns.list.columnCustomer'),
          allowResize: true,
        },
        {
          property: 'customerEmail',
          dataIndex: 'customerEmail',
          label: this.$tc('mtsport-returns.list.columnEmail'),
          allowResize: true,
        },
        {
          property: 'status',
          dataIndex: 'status',
          label: this.$tc('mtsport-returns.list.columnStatus'),
          allowResize: true,
        },
        {
          property: 'createdAt',
          dataIndex: 'createdAt',
          label: this.$tc('mtsport-returns.list.columnCreatedAt'),
          allowResize: true,
        },
      ];
    },

    formTypeOptions() {
      return [
        { value: '', label: this.$tc('mtsport-returns.list.filterAll') },
        { value: 'vratenie', label: this.$tc('mtsport-returns.detail.formTypeVratenie') },
        { value: 'reklamacia', label: this.$tc('mtsport-returns.detail.formTypeReklamacia') },
      ];
    },

    statusOptions() {
      return [
        { value: '', label: this.$tc('mtsport-returns.list.filterAll') },
        { value: 'received', label: this.$tc('mtsport-returns.detail.statusReceived') },
        { value: 'processing', label: this.$tc('mtsport-returns.detail.statusProcessing') },
        { value: 'approved', label: this.$tc('mtsport-returns.detail.statusApproved') },
        { value: 'rejected', label: this.$tc('mtsport-returns.detail.statusRejected') },
      ];
    },
  },

  methods: {
    async getList() {
      this.isLoading = true;
      const criteria = new Criteria(this.page, this.limit);
      criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));

      if (this.filterFormType) {
        criteria.addFilter(Criteria.equals('formType', this.filterFormType));
      }
      if (this.filterStatus) {
        criteria.addFilter(Criteria.equals('status', this.filterStatus));
      }
      if (this.term) {
        criteria.setTerm(this.term);
      }

      try {
        const result = await this.repository.search(criteria);
        this.requests = result;
        this.total = result.total;
      } catch (e) {
        this.createNotificationError({ message: e.message || '' });
      } finally {
        this.isLoading = false;
      }
    },

    onEdit(item) {
      if (item?.id) {
        this.$router.push({ name: 'mtsport.returns.detail', params: { id: item.id } });
      }
    },

    onColumnSort(column) {
      this.sortBy = column.dataIndex;
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      this.getList();
    },

    onFilterChange() {
      this.page = 1;
      this.getList();
    },

    statusVariant(status) {
      switch (status) {
        case 'received':   return 'neutral';
        case 'processing': return 'info';
        case 'approved':   return 'success';
        case 'rejected':   return 'danger';
        default:           return 'neutral';
      }
    },
  },
});
