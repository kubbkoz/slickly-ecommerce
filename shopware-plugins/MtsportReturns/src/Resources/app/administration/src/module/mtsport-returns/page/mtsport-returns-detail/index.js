import template from './mtsport-returns-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

function parseAttachments(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && x.length > 0) : [];
  } catch {
    return [];
  }
}

Component.register('mtsport-returns-detail', {
  template,
  inject: ['repositoryFactory', 'acl'],
  mixins: [Mixin.getByName('notification'), Mixin.getByName('placeholder')],
  shortcuts: { 'SYSTEMKEY+S': 'onSave', ESCAPE: 'onCancel' },

  props: { returnId: { type: String, required: false, default: null } },

  data() {
    return {
      request: null,
      isLoading: false,
      isSaveSuccessful: false,
    };
  },

  metaInfo() {
    return { title: this.$createTitle(this.identifier) };
  },

  computed: {
    identifier() {
      return this.request?.referenceNumber || this.$tc('mtsport-returns.detail.textHeadlineNew');
    },
    repository() {
      return this.repositoryFactory.create('mtsport_return_request');
    },
    tooltipSave() {
      return { message: this.$device.getSystemKey() + ' + S', appearance: 'light' };
    },

    formTypeOptions() {
      return [
        { value: 'vratenie', label: this.$tc('mtsport-returns.detail.formTypeVratenie') },
        { value: 'reklamacia', label: this.$tc('mtsport-returns.detail.formTypeReklamacia') },
      ];
    },

    statusOptions() {
      return [
        { value: 'received', label: this.$tc('mtsport-returns.detail.statusReceived') },
        { value: 'processing', label: this.$tc('mtsport-returns.detail.statusProcessing') },
        { value: 'approved', label: this.$tc('mtsport-returns.detail.statusApproved') },
        { value: 'rejected', label: this.$tc('mtsport-returns.detail.statusRejected') },
      ];
    },

    attachmentUuids() {
      return parseAttachments(this.request?.attachmentPaths);
    },

    warrantyUuids() {
      return parseAttachments(this.request?.warrantyPaths);
    },
  },

  created() {
    this.loadRequest();
  },
  watch: {
    returnId() { this.loadRequest(); },
  },

  methods: {
    async loadRequest() {
      if (!this.returnId) return;
      this.isLoading = true;
      try {
        this.request = await this.repository.get(this.returnId, Shopware.Context.api, new Criteria());
      } catch (e) {
        this.createNotificationError({ message: e.message || '' });
      } finally {
        this.isLoading = false;
      }
    },

    async onSave() {
      this.isLoading = true;
      try {
        await this.repository.save(this.request, Shopware.Context.api);
        this.isSaveSuccessful = true;
        this.createNotificationSuccess({ message: this.$tc('mtsport-returns.notification.saveSuccess') });
        await this.loadRequest();
      } catch (e) {
        this.createNotificationError({ message: e.message || this.$tc('mtsport-returns.notification.saveError') });
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$router.push({ name: 'mtsport.returns.list' });
    },

    async onDelete() {
      if (!this.request?.id) return;
      if (!window.confirm(this.$tc('mtsport-returns.notification.deleteConfirm'))) return;
      this.isLoading = true;
      try {
        await this.repository.delete(this.request.id, Shopware.Context.api);
        this.createNotificationSuccess({ message: this.$tc('mtsport-returns.notification.deleteSuccess') });
        this.$router.push({ name: 'mtsport.returns.list' });
      } catch (e) {
        this.createNotificationError({ message: e.message || '' });
      } finally {
        this.isLoading = false;
      }
    },

    onQuickStatusChange(status) {
      if (!this.request) return;
      this.request.status = status;
      this.onSave();
    },
  },
});
