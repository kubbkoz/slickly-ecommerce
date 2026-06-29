import template from './mtsport-blog-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-blog-list', {
  template,

  inject: ['repositoryFactory', 'acl'],

  mixins: [
    Mixin.getByName('listing'),
    Mixin.getByName('notification'),
  ],

  data() {
    return {
      articles: null,
      isLoading: false,
      total: 0,
      sortBy: 'publishedAt',
      sortDirection: 'DESC',
    };
  },

  metaInfo() {
    return {
      title: this.$createTitle(),
    };
  },

  computed: {
    repository() {
      return this.repositoryFactory.create('mtsport_article');
    },

    columns() {
      return [
        {
          property: 'title',
          dataIndex: 'title',
          label: 'mtsport-blog.list.columnTitle',
          routerLink: 'mtsport.blog.detail',
          inlineEdit: 'string',
          allowResize: true,
          primary: true,
        },
        {
          property: 'slug',
          dataIndex: 'slug',
          label: 'mtsport-blog.list.columnSlug',
          allowResize: true,
        },
        {
          property: 'author',
          dataIndex: 'author',
          label: 'mtsport-blog.list.columnAuthor',
          allowResize: true,
        },
        {
          property: 'category',
          dataIndex: 'category',
          label: 'mtsport-blog.list.columnCategory',
          allowResize: true,
        },
        {
          property: 'publishedAt',
          dataIndex: 'publishedAt',
          label: 'mtsport-blog.list.columnPublishedAt',
          allowResize: true,
        },
        {
          property: 'active',
          dataIndex: 'active',
          label: 'mtsport-blog.list.columnActive',
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
      criteria.addAssociation('cover');
      criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));

      if (this.term) {
        criteria.setTerm(this.term);
      }

      try {
        const result = await this.repository.search(criteria);
        this.articles = result;
        this.total = result.total;
      } catch (e) {
        this.createNotificationError({
          message: this.$tc('mtsport-blog.notification.saveError'),
        });
      } finally {
        this.isLoading = false;
      }
    },

    onAdd() {
      this.$router.push({ name: 'mtsport.blog.create' });
    },

    onEdit(item) {
      if (item?.id) {
        this.$router.push({ name: 'mtsport.blog.detail', params: { id: item.id } });
      }
    },

    onColumnSort(column) {
      this.sortBy = column.dataIndex;
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      this.getList();
    },

    formatDate(value) {
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString('sk-SK', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch {
        return value;
      }
    },
  },
});
