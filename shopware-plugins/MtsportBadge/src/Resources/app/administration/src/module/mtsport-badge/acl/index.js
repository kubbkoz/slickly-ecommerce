Shopware.Service('privileges').addPrivilegeMappingEntry({
  category: 'permissions',
  parent: 'content',
  key: 'mtsport_badge',
  roles: {
    viewer: {
      privileges: ['mtsport_badge:read'],
      dependencies: [],
    },
    editor: {
      privileges: ['mtsport_badge:update'],
      dependencies: ['mtsport_badge.viewer'],
    },
    creator: {
      privileges: ['mtsport_badge:create'],
      dependencies: ['mtsport_badge.editor'],
    },
    deleter: {
      privileges: ['mtsport_badge:delete'],
      dependencies: ['mtsport_badge.viewer'],
    },
  },
});
