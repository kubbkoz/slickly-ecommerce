Shopware.Service('privileges').addPrivilegeMappingEntry({
  category: 'permissions',
  parent: 'orders',
  key: 'mtsport_sps_shipment',
  roles: {
    viewer: {
      privileges: ['mtsport_sps_shipment:read', 'order:read'],
      dependencies: [],
    },
    editor: {
      privileges: ['mtsport_sps_shipment:update'],
      dependencies: ['mtsport_sps_shipment.viewer'],
    },
  },
});
