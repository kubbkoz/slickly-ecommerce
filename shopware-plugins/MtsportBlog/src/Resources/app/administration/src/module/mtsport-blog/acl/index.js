/**
 * ACL Privilege Mapping pre MT-SPORT Blog.
 *
 * Registruje 4 role (viewer/editor/creator/deleter) v Shopware admin permissions.
 * Admin user musí mať tieto privileges aby videl/editoval/mazal články.
 *
 * Privileges sa zobrazia v: Settings → System → Users & permissions → Roles → Detail.
 */
Shopware.Service('privileges').addPrivilegeMappingEntry({
  category: 'permissions',
  parent: 'content',
  key: 'mtsport_article',
  roles: {
    viewer: {
      privileges: [
        'mtsport_article:read',
        'media:read',
      ],
      dependencies: [],
    },
    editor: {
      privileges: [
        'mtsport_article:update',
        'media:read',
      ],
      dependencies: [
        'mtsport_article.viewer',
      ],
    },
    creator: {
      privileges: [
        'mtsport_article:create',
        'media:read',
      ],
      dependencies: [
        'mtsport_article.viewer',
        'mtsport_article.editor',
      ],
    },
    deleter: {
      privileges: [
        'mtsport_article:delete',
      ],
      dependencies: [
        'mtsport_article.viewer',
      ],
    },
  },
});
