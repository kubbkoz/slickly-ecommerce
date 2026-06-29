Shopware.Service('privileges').addPrivilegeMappingEntry({
  category: 'permissions',
  parent: 'customer',
  key: 'mtsport_return_request',
  roles: {
    viewer: {
      privileges: ['mtsport_return_request:read'],
      dependencies: [],
    },
    editor: {
      privileges: ['mtsport_return_request:update'],
      dependencies: ['mtsport_return_request.viewer'],
    },
    creator: {
      privileges: ['mtsport_return_request:create'],
      dependencies: ['mtsport_return_request.editor'],
    },
    deleter: {
      privileges: ['mtsport_return_request:delete'],
      dependencies: ['mtsport_return_request.viewer'],
    },
  },
});
