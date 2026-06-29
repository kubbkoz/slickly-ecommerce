import './page/mtsport-badge-list';
import './page/mtsport-badge-detail';
import './acl';

import skSK from './snippet/sk-SK.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('mtsport-badge', {
  type: 'plugin',
  name: 'mtsport-badge.general.mainMenuItemGeneral',
  title: 'mtsport-badge.general.mainMenuItemGeneral',
  description: 'mtsport-badge.general.descriptionTextModule',
  version: '1.0.0',
  targetVersion: '1.0.0',
  color: '#B60005',
  icon: 'regular-tag',

  snippets: {
    'sk-SK': skSK,
    'en-GB': enGB,
  },

  routes: {
    list: {
      component: 'mtsport-badge-list',
      path: 'list',
      meta: {
        parentPath: 'sw.catalogue.index',
        privilege: 'mtsport_badge:read',
      },
    },
    detail: {
      component: 'mtsport-badge-detail',
      path: 'detail/:id',
      meta: {
        parentPath: 'mtsport.badge.list',
        privilege: 'mtsport_badge:read',
      },
      props: {
        default: (route) => ({ badgeId: route.params.id }),
      },
    },
    create: {
      component: 'mtsport-badge-detail',
      path: 'create',
      meta: {
        parentPath: 'mtsport.badge.list',
        privilege: 'mtsport_badge:create',
      },
    },
  },

  navigation: [
    {
      id: 'mtsport-badge',
      label: 'mtsport-badge.general.mainMenuItemGeneral',
      color: '#B60005',
      path: 'mtsport.badge.list',
      icon: 'regular-tag',
      parent: 'sw-catalogue',
      position: 60,
      privilege: 'mtsport_badge:read',
    },
  ],
});
