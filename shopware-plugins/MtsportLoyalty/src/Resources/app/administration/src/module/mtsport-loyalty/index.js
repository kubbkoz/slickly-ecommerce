import './page/mtsport-loyalty-dashboard';
import './page/mtsport-loyalty-reward-detail';
import './acl';

import skSK from './snippet/sk-SK.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('mtsport-loyalty', {
    type: 'plugin',
    name: 'mtsport-loyalty.general.mainMenuItemGeneral',
    title: 'mtsport-loyalty.general.mainMenuItemGeneral',
    description: 'mtsport-loyalty.general.descriptionTextModule',
    version: '1.0.0',
    color: '#B60005',
    icon: 'regular-gift',

    snippets: {
        'sk-SK': skSK,
        'en-GB': enGB,
    },

    routes: {
        dashboard: {
            component: 'mtsport-loyalty-dashboard',
            path: 'dashboard',
            meta: {
                parentPath: 'sw.customer.index',
                privilege: 'loyalty_reward:read',
            },
        },
        rewardDetail: {
            component: 'mtsport-loyalty-reward-detail',
            path: 'reward/:id',
            meta: {
                parentPath: 'mtsport.loyalty.dashboard',
                privilege: 'loyalty_reward:read',
            },
            props: {
                default: (route) => ({ rewardId: route.params.id }),
            },
        },
        rewardCreate: {
            component: 'mtsport-loyalty-reward-detail',
            path: 'reward/create',
            meta: {
                parentPath: 'mtsport.loyalty.dashboard',
                privilege: 'loyalty_reward:create',
            },
        },
    },

    navigation: [
        {
            id: 'mtsport-loyalty',
            label: 'mtsport-loyalty.general.mainMenuItemGeneral',
            path: 'mtsport.loyalty.dashboard',
            icon: 'regular-gift',
            parent: 'sw-customer',
            position: 70,
            privilege: 'loyalty_reward:read',
        },
    ],
});
