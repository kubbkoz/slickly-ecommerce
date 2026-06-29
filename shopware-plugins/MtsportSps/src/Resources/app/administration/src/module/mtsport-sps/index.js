import './page/mtsport-sps-list';
import './acl';

import skSK from './snippet/sk-SK.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('mtsport-sps', {
  type: 'plugin',
  name: 'mtsport-sps.general.mainMenuItemGeneral',
  title: 'mtsport-sps.general.mainMenuItemGeneral',
  description: 'mtsport-sps.general.descriptionTextModule',
  version: '1.0.0',
  targetVersion: '1.0.0',
  color: '#B60005',
  icon: 'regular-shipping-fast',

  snippets: {
    'sk-SK': skSK,
    'en-GB': enGB,
  },

  routes: {
    list: {
      component: 'mtsport-sps-list',
      path: 'list',
      meta: {
        parentPath: 'sw.order.index',
        privilege: 'mtsport_sps_shipment:read',
      },
    },
  },

  navigation: [
    {
      id: 'mtsport-sps',
      label: 'mtsport-sps.general.mainMenuItemGeneral',
      color: '#B60005',
      path: 'mtsport.sps.list',
      icon: 'regular-shipping-fast',
      parent: 'sw-order',
      position: 80,
      privilege: 'mtsport_sps_shipment:read',
    },
  ],
});
