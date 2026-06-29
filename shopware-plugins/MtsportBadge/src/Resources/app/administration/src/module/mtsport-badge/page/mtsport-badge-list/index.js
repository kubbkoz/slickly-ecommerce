import template from './mtsport-badge-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-badge-list', {
  template,

  inject: ['repositoryFactory', 'acl'],

  mixins: [
    Mixin.getByName('listing'),
    Mixin.getByName('notification'),
  ],

  data() {
    return {
      badges: null,
      isLoading: false,
      total: 0,
      sortBy: 'sort',
      sortDirection: 'ASC',
    };
  },

  metaInfo() {
    return { title: this.$createTitle() };
  },

  computed: {
    repository() {
      return this.repositoryFactory.create('mtsport_badge');
    },

    columns() {
      return [
        {
          property: 'name',
          dataIndex: 'name',
          label: this.$tc('mtsport-badge.list.columnName'),
          routerLink: 'mtsport.badge.detail',
          inlineEdit: 'string',
          allowResize: true,
          primary: true,
        },
        {
          property: 'text',
          dataIndex: 'text',
          label: this.$tc('mtsport-badge.list.columnText'),
          allowResize: true,
        },
        {
          property: 'position',
          dataIndex: 'position',
          label: this.$tc('mtsport-badge.list.columnPosition'),
          allowResize: true,
        },
        {
          property: 'sort',
          dataIndex: 'sort',
          label: this.$tc('mtsport-badge.list.columnSort'),
          allowResize: true,
          align: 'center',
        },
        {
          property: 'active',
          dataIndex: 'active',
          label: this.$tc('mtsport-badge.list.columnActive'),
          allowResize: true,
          align: 'center',
        },
      ];
    },
  },

  methods: {
    async getList() {
      this.isLoading = true;

      const criteria = new Criteria(this.page, this.limit);
      criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));

      if (this.term) {
        criteria.setTerm(this.term);
      }

      try {
        const result = await this.repository.search(criteria);
        this.badges = result;
        this.total = result.total;
      } catch (e) {
        this.createNotificationError({ message: this.$tc('mtsport-badge.notification.saveError') });
      } finally {
        this.isLoading = false;
      }
    },

    onAdd() {
      this.$router.push({ name: 'mtsport.badge.create' });
    },

    onEdit(item) {
      if (item?.id) {
        this.$router.push({ name: 'mtsport.badge.detail', params: { id: item.id } });
      }
    },

    onColumnSort(column) {
      this.sortBy = column.dataIndex;
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      this.getList();
    },
  },
});
