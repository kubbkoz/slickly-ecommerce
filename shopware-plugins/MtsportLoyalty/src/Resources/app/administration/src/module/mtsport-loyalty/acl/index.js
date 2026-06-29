Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions',
    parent: 'customer',
    key: 'loyalty_reward',
    roles: {
        viewer: {
            privileges: [
                'loyalty_reward:read',
                'loyalty_level:read',
                'loyalty_transaction:read',
                'loyalty_redemption:read',
            ],
            dependencies: [],
        },
        editor: {
            privileges: [
                'loyalty_reward:update',
                'loyalty_level:update',
            ],
            dependencies: ['loyalty_reward.viewer'],
        },
        creator: {
            privileges: [
                'loyalty_reward:create',
                'loyalty_level:create',
            ],
            dependencies: ['loyalty_reward.editor'],
        },
        deleter: {
            privileges: [
                'loyalty_reward:delete',
            ],
            dependencies: ['loyalty_reward.viewer'],
        },
    },
});
