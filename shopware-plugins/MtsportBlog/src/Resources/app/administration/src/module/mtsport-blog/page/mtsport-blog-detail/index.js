import template from './mtsport-blog-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register("mtsport-blog-detail", {
  template,
  inject: ["repositoryFactory", "acl"],
  mixins: [Mixin.getByName("notification"), Mixin.getByName("placeholder")],
  shortcuts: { "SYSTEMKEY+S": "onSave", ESCAPE: "onCancel" },

  props: { articleId: { type: String, required: false, default: null } },

  data() {
    return { article: null, isLoading: false, isSaveSuccessful: false, processSuccess: false, isCreatingCmsPage: false };
  },

  metaInfo() { return { title: this.$createTitle(this.identifier) }; },

  computed: {
    identifier() { return this.article?.title || this.$tc("mtsport-blog.detail.textHeadlineCreate"); },
    repository() { return this.repositoryFactory.create("mtsport_article"); },
    cmsPageRepository() { return this.repositoryFactory.create("cms_page"); },
    isCreating() { return !this.articleId; },
    tooltipSave() { return { message: this.$device.getSystemKey() + " + S", appearance: "light" }; },
    typeOptions() {
      return [
        { value: "blog", label: this.$tc("mtsport-blog.detail.typeBlog") },
        { value: "page", label: this.$tc("mtsport-blog.detail.typePage") },
      ];
    },
  },

  created() { this.createdComponent(); },
  watch: { articleId() { this.createdComponent(); } },

  methods: {
    async createdComponent() {
      if (this.isCreating) {
        this.article = this.repository.create(Shopware.Context.api);
        Object.assign(this.article, {
          active: true, featured: false, featuredBadgeText: "", type: "blog",
          title: "", slug: "", teaser: "", content: "",
          metaTitle: "", metaDescription: "", author: "", category: "",
        });
        return;
      }
      await this.loadArticle();
    },

    async loadArticle() {
      this.isLoading = true;
      try {
        const criteria = new Criteria();
        criteria.addAssociation("cover");
        criteria.addAssociation("heroCover");
        criteria.addAssociation("cmsPage");
        this.article = await this.repository.get(this.articleId, Shopware.Context.api, criteria);
        if (this.article) {
          this.article.teaser            = this.article.teaser            ?? "";
          this.article.content           = this.article.content           ?? "";
          this.article.metaTitle         = this.article.metaTitle         ?? "";
          this.article.metaDescription   = this.article.metaDescription   ?? "";
          this.article.author            = this.article.author            ?? "";
          this.article.category          = this.article.category          ?? "";
          this.article.featured          = this.article.featured          ?? false;
          this.article.featuredBadgeText = this.article.featuredBadgeText ?? "";
          this.article.type              = this.article.type              ?? "blog";
        }
      } catch (e) { this.createNotificationError({ message: e.message || "" }); }
      finally { this.isLoading = false; }
    },

    async onSave() {
      if (!this.article?.title || !this.article?.slug) {
        this.createNotificationError({ message: this.$tc("mtsport-blog.notification.saveError") });
        return;
      }
      this.isLoading = true;
      this.isSaveSuccessful = false;
      try {
        const wasCreating = this.isCreating;
        const newId = this.article.id;
        await this.repository.save(this.article, Shopware.Context.api);
        this.isSaveSuccessful = true;
        this.createNotificationSuccess({ message: this.$tc("mtsport-blog.notification.saveSuccess") });
        if (wasCreating) this.$router.push({ name: "mtsport.blog.detail", params: { id: newId } });
        else await this.loadArticle();
      } catch (e) {
        this.createNotificationError({ message: e.message || this.$tc("mtsport-blog.notification.saveError") });
      } finally { this.isLoading = false; }
    },

    onCancel() { this.$router.push({ name: "mtsport.blog.list" }); },
    onSaveFinish() { this.processSuccess = false; },

    async onDelete() {
      if (this.isCreating || !this.article?.id) return;
      if (!window.confirm(this.$tc("mtsport-blog.notification.deleteConfirm"))) return;
      this.isLoading = true;
      try {
        await this.repository.delete(this.article.id, Shopware.Context.api);
        this.createNotificationSuccess({ message: this.$tc("mtsport-blog.notification.deleteSuccess") });
        this.$router.push({ name: "mtsport.blog.list" });
      } catch (e) {
        this.createNotificationError({ message: e.message || this.$tc("mtsport-blog.notification.deleteError") });
      } finally { this.isLoading = false; }
    },

    async onCreateCmsPage() {
      if (!this.article?.id) { this.createNotificationError({ message: "Najprv ulozteclick clanok." }); return; }
      this.isCreatingCmsPage = true;
      try {
        const cmsPage = this.cmsPageRepository.create(Shopware.Context.api);
        cmsPage.name   = (this.article.type === "page" ? "Page" : "Blog") + ": " + (this.article.title || "Article");
        cmsPage.type   = "page";
        cmsPage.locked = false;
        await this.cmsPageRepository.save(cmsPage, Shopware.Context.api);
        this.article.cmsPageId = cmsPage.id;
        await this.repository.save(this.article, Shopware.Context.api);
        this.$router.push({ name: "sw.cms.detail", params: { id: cmsPage.id } });
      } catch (e) {
        this.createNotificationError({ message: e.message || "Chyba." });
      } finally { this.isCreatingCmsPage = false; }
    },

    onEditCmsPage() {
      if (this.article?.cmsPageId) this.$router.push({ name: "sw.cms.detail", params: { id: this.article.cmsPageId } });
    },

    async onRemoveCmsPage() {
      if (!window.confirm(this.$tc("mtsport-blog.notification.layoutRemoveConfirm"))) return;
      this.article.cmsPageId = null;
      try {
        await this.repository.save(this.article, Shopware.Context.api);
        this.createNotificationSuccess({ message: this.$tc("mtsport-blog.notification.layoutRemoved") });
        await this.loadArticle();
      } catch (e) { this.createNotificationError({ message: e.message || "Chyba." }); }
    },

    onSlugSuggest() {
      if (!this.article?.title || this.article?.slug) return;
      this.article.slug = this.slugify(this.article.title);
    },

    slugify(text) {
      return String(text || "").toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    },
  },
});
