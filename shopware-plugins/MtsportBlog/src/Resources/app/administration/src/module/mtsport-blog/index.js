import './page/mtsport-blog-list';
import './page/mtsport-blog-detail';
import './acl';

import skSK from './snippet/sk-SK.json';
import csCZ from './snippet/cs-CZ.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('mtsport-blog', {
  type: 'plugin',
  name: 'mtsport-blog.general.mainMenuItemGeneral',
  title: 'mtsport-blog.general.mainMenuItemGeneral',
  description: 'mtsport-blog.general.descriptionTextModule',
  version: '2.1.0',
  targetVersion: '2.1.0',
  color: '#B60005',
  icon: 'regular-content-blog',

  snippets: {
    'sk-SK': skSK,
    'cs-CZ': csCZ,
    'en-GB': enGB,
  },

  routes: {
    list: {
      component: 'mtsport-blog-list',
      path: 'list',
      meta: {
        parentPath: 'sw.content.index',
        privilege: 'mtsport_article:read',
      },
    },
    detail: {
      component: 'mtsport-blog-detail',
      path: 'detail/:id',
      meta: {
        parentPath: 'mtsport.blog.list',
        privilege: 'mtsport_article:read',
      },
      props: {
        default: (route) => ({ articleId: route.params.id }),
      },
    },
    create: {
      component: 'mtsport-blog-detail',
      path: 'create',
      meta: {
        parentPath: 'mtsport.blog.list',
        privilege: 'mtsport_article:create',
      },
    },
  },

  navigation: [
    {
      id: 'mtsport-blog',
      label: 'mtsport-blog.general.mainMenuItemGeneral',
      color: '#B60005',
      path: 'mtsport.blog.list',
      icon: 'regular-content-blog',
      parent: 'sw-content',
      position: 50,
      privilege: 'mtsport_article:read',
    },
  ],

  defaultSearchConfiguration: {
    _searchable: true,
    title: { _searchable: true, _score: 500 },
    slug: { _searchable: true, _score: 250 },
    author: { _searchable: true, _score: 100 },
  },
});
