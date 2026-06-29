import './page/mtsport-returns-list';
import './page/mtsport-returns-detail';
import './acl';

import skSK from './snippet/sk-SK.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('mtsport-returns', {
  type: 'plugin',
  name: 'mtsport-returns.general.mainMenuItemGeneral',
  title: 'mtsport-returns.general.mainMenuItemGeneral',
  description: 'mtsport-returns.general.descriptionTextModule',
  version: '1.0.0',
  targetVersion: '1.0.0',
  color: '#B60005',
  icon: 'regular-undo',

  snippets: {
    'sk-SK': skSK,
    'en-GB': enGB,
  },

  routes: {
    list: {
      component: 'mtsport-returns-list',
      path: 'list',
      meta: {
        parentPath: 'sw.customer.index',
        privilege: 'mtsport_return_request:read',
      },
    },
    detail: {
      component: 'mtsport-returns-detail',
      path: 'detail/:id',
      meta: {
        parentPath: 'mtsport.returns.list',
        privilege: 'mtsport_return_request:read',
      },
      props: {
        default: (route) => ({ returnId: route.params.id }),
      },
    },
  },

  navigation: [
    {
      id: 'mtsport-returns',
      label: 'mtsport-returns.general.mainMenuItemGeneral',
      color: '#B60005',
      path: 'mtsport.returns.list',
      icon: 'regular-undo',
      parent: 'sw-customer',
      position: 60,
      privilege: 'mtsport_return_request:read',
    },
  ],
});
