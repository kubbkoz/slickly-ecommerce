import template from './mtsport-loyalty-dashboard.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('mtsport-loyalty-dashboard', {
    template,

    inject: ['repositoryFactory', 'acl'],

    mixins: [Mixin.getByName('notification')],

    data() {
        return {
            activeTab: 'customers',
            customers: [],
            customersLoading: false,
            customerTerm: '',
            levels: null,
            rewards: null,
            redemptions: null,
            transactions: null,
            isLoading: false,
        };
    },

    computed: {
        levelRepository() { return this.repositoryFactory.create('loyalty_level'); },
        rewardRepository() { return this.repositoryFactory.create('loyalty_reward'); },
        redemptionRepository() { return this.repositoryFactory.create('loyalty_redemption'); },
        transactionRepository() { return this.repositoryFactory.create('loyalty_transaction'); },

        customerColumns() {
            return [
                { property: 'firstName', label: this.$tc('mtsport-loyalty.dashboard.colName') },
                { property: 'email', label: this.$tc('mtsport-loyalty.dashboard.colEmail') },
                { property: 'points', label: this.$tc('mtsport-loyalty.dashboard.colPoints') },
                { property: 'levelName', label: this.$tc('mtsport-loyalty.dashboard.colLevel') },
                { property: 'lastActivity', label: this.$tc('mtsport-loyalty.dashboard.colLastActivity') },
            ];
        },
        levelColumns() {
            return [
                { property: 'level', label: this.$tc('mtsport-loyalty.dashboard.colLevel') },
                { property: 'name', label: this.$tc('mtsport-loyalty.dashboard.colLevelName'), inlineEdit: 'string' },
                { property: 'minPoints', label: this.$tc('mtsport-loyalty.dashboard.colMinPoints'), inlineEdit: 'number' },
                { property: 'color', label: this.$tc('mtsport-loyalty.dashboard.colColor'), inlineEdit: 'string' },
            ];
        },
        rewardColumns() {
            return [
                { property: 'name', label: this.$tc('mtsport-loyalty.dashboard.colReward'), routerLink: 'mtsport.loyalty.rewardDetail', primary: true },
                { property: 'pointsRequired', label: this.$tc('mtsport-loyalty.dashboard.colPoints') },
                { property: 'type', label: this.$tc('mtsport-loyalty.dashboard.colType') },
                { property: 'discountValue', label: this.$tc('mtsport-loyalty.dashboard.colValue') },
                { property: 'isActive', label: this.$tc('mtsport-loyalty.dashboard.colActive') },
            ];
        },
        redemptionColumns() {
            return [
                { property: 'promotionCode', label: this.$tc('mtsport-loyalty.dashboard.colCode') },
                { property: 'rewardName', label: this.$tc('mtsport-loyalty.dashboard.colReward') },
                { property: 'pointsSpent', label: this.$tc('mtsport-loyalty.dashboard.colPoints') },
                { property: 'status', label: this.$tc('mtsport-loyalty.dashboard.colStatus') },
                { property: 'expiresAt', label: this.$tc('mtsport-loyalty.dashboard.colExpiry') },
            ];
        },
        activityColumns() {
            return [
                { property: 'points', label: this.$tc('mtsport-loyalty.dashboard.colPoints') },
                { property: 'type', label: this.$tc('mtsport-loyalty.dashboard.colType') },
                { property: 'description', label: this.$tc('mtsport-loyalty.dashboard.colDescription') },
                { property: 'createdAt', label: this.$tc('mtsport-loyalty.dashboard.colDate') },
            ];
        },
    },

    created() {
        this.loadCustomers();
        this.loadLevels();
        this.loadRewards();
        this.loadRedemptions();
        this.loadActivity();
    },

    methods: {
        async loadCustomers() {
            this.customersLoading = true;
            try {
                const httpClient = Shopware.Application.getContainer('init').httpClient;
                const headers = Shopware.Service('loginService').getBearerAuthentication
                    ? { Authorization: `Bearer ${Shopware.Service('loginService').getToken()}` }
                    : {};
                const res = await httpClient.get('/_action/mtsport-loyalty/customers', {
                    params: { term: this.customerTerm, limit: 50 },
                    headers,
                });
                this.customers = res.data.customers || [];
            } catch (e) {
                this.createNotificationError({ message: e.message || 'Chyba' });
            } finally {
                this.customersLoading = false;
            }
        },
        async loadLevels() {
            const c = new Criteria(1, 25);
            c.addSorting(Criteria.sort('minPoints', 'ASC'));
            this.levels = await this.levelRepository.search(c);
        },
        async loadRewards() {
            const c = new Criteria(1, 50);
            c.addSorting(Criteria.sort('pointsRequired', 'ASC'));
            this.rewards = await this.rewardRepository.search(c);
        },
        async loadRedemptions() {
            const c = new Criteria(1, 50);
            c.addSorting(Criteria.sort('createdAt', 'DESC'));
            this.redemptions = await this.redemptionRepository.search(c);
        },
        async loadActivity() {
            const c = new Criteria(1, 50);
            c.addSorting(Criteria.sort('createdAt', 'DESC'));
            this.transactions = await this.transactionRepository.search(c);
        },
        async onLevelInlineEditSave(item) {
            try {
                await this.levelRepository.save(item);
                this.createNotificationSuccess({ message: 'Úroveň uložená' });
                this.loadLevels();
            } catch (e) {
                this.createNotificationError({ message: e.message || 'Chyba' });
            }
        },
        onAddReward() {
            this.$router.push({ name: 'mtsport.loyalty.rewardCreate' });
        },
    },
});
