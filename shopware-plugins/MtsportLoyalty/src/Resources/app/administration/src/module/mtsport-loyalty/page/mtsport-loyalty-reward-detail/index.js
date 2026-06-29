import template from './mtsport-loyalty-reward-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-loyalty-reward-detail', {
    template,

    inject: ['repositoryFactory', 'acl'],

    mixins: [Mixin.getByName('notification')],

    props: {
        rewardId: { type: String, required: false, default: null },
    },

    data() {
        return {
            reward: null,
            isLoading: false,
            typeOptions: [
                { value: 'percentage', label: this.$tc('mtsport-loyalty.reward.typePercentage') },
                { value: 'fixed', label: this.$tc('mtsport-loyalty.reward.typeFixed') },
                { value: 'free_shipping', label: this.$tc('mtsport-loyalty.reward.typeFreeShipping') },
                { value: 'gift', label: this.$tc('mtsport-loyalty.reward.typeGift') },
            ],
        };
    },

    computed: {
        repository() { return this.repositoryFactory.create('loyalty_reward'); },
        identifier() { return this.reward?.name || this.$tc('mtsport-loyalty.reward.titleNew'); },
    },

    created() {
        if (this.rewardId) {
            this.loadReward();
        } else {
            this.reward = this.repository.create(Shopware.Context.api);
            this.reward.type = 'percentage';
            this.reward.pointsRequired = 1000;
            this.reward.discountValue = 5;
            this.reward.validDays = 30;
            this.reward.maxUsesPerCustomer = 1;
            this.reward.isActive = true;
        }
    },

    methods: {
        async loadReward() {
            this.isLoading = true;
            try {
                this.reward = await this.repository.get(this.rewardId, Shopware.Context.api, new Criteria());
            } catch (e) {
                this.createNotificationError({ message: e.message || '' });
            } finally {
                this.isLoading = false;
            }
        },
        async onSave() {
            this.isLoading = true;
            try {
                await this.repository.save(this.reward, Shopware.Context.api);
                this.createNotificationSuccess({ message: this.$tc('mtsport-loyalty.reward.saveSuccess') });
                this.$router.push({ name: 'mtsport.loyalty.dashboard' });
            } catch (e) {
                this.createNotificationError({ message: e.message || this.$tc('mtsport-loyalty.reward.saveError') });
            } finally {
                this.isLoading = false;
            }
        },
        onCancel() {
            this.$router.push({ name: 'mtsport.loyalty.dashboard' });
        },
    },
});
