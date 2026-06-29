/**
 * Shopware Store API — centralized operation string constants.
 *
 * Usage:
 *   import { SW_OP } from '~/utils/shopware-api-ops';
 *   apiClient.invoke(SW_OP.product.list, body);
 *   apiClient.invoke(SW_OP.product.crossSelling(productId));
 *
 * When switching backends, this file is the single place to update
 * all API operation identifiers.
 */

export const SW_OP = {
  // ── Context ──────────────────────────────────────────────────────────────
  context: {
    read:   'readContext get /context' as const,
    update: 'updateContext patch /context' as const,
  },

  // ── Products ─────────────────────────────────────────────────────────────
  product: {
    list:        'readProduct post /product' as const,
    crossSelling: (productId: string) =>
      `readProductCrossSelling get /product/${productId}/cross-selling` as any,
    findVariant: 'readProductVariant post /product/{productId}/find-variant' as const,
    saveReview:  (productId: string) =>
      `saveProductReview post /product/${productId}/review` as any,
    listReviews: (productId: string) =>
      `readProductReviews post /product/${productId}/reviews` as any,
  },

  // ── Categories ───────────────────────────────────────────────────────────
  category: {
    list:              'readCategoryList post /category' as const,
    read:              'readCategory post /category/{categoryId}' as const,
    readById:          (categoryId: string) =>
      `readCategory post /category/${categoryId}` as any,
    productListing:    'readProductListing post /product-listing/{categoryId}' as const,
    productListingById: (categoryId: string) =>
      `readProductListing post /product-listing/${categoryId}` as any,
  },

  // ── Search ───────────────────────────────────────────────────────────────
  search: {
    page:    'searchPage post /search' as const,
    suggest: 'searchSuggest post /search-suggest' as const,
  },

  // ── Cart & Checkout ──────────────────────────────────────────────────────
  cart: {
    addLineItem:  'addLineItem post /checkout/cart/line-item' as const,
    createOrder:  'createOrder post /checkout/order' as const,
  },

  // ── Shipping ─────────────────────────────────────────────────────────────
  shipping: {
    list: 'readShippingMethod post /shipping-method' as const,
  },

  // ── Account ──────────────────────────────────────────────────────────────
  account: {
    register:         'register post /account/register' as const,
    confirmEmail:     'confirmNewsletter post /account/register-confirm' as const,
    changeEmail:      'changeEmail post /account/change-email' as const,
    changePassword:   'changePassword post /account/change-password' as const,
    listAddress:      'listAddress post /account/list-address' as const,
    updateAddress:    'updateCustomerAddress patch /account/address/{addressId}' as const,
    passwordRecovery: 'sendRecoveryMail post /account/recovery-password' as const,
  },

  // ── Wishlist ─────────────────────────────────────────────────────────────
  wishlist: {
    read:   'readCustomerWishlist post /customer/wishlist' as const,
    add:    (productId: string) =>
      `addToWishlist post /customer/wishlist/add/${productId}` as any,
    remove: (productId: string) =>
      `removeWishlistProduct delete /customer/wishlist/delete/${productId}` as any,
  },

  // ── Newsletter ───────────────────────────────────────────────────────────
  newsletter: {
    subscribe: 'subscribeToNewsletter post /newsletter/subscribe' as const,
    confirm:   'confirmNewsletter post /newsletter/confirm' as const,
  },

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    url:        'readSeoUrl post /seo-url' as const,
    breadcrumb: (id: string) => `readBreadcrumb get /breadcrumb/${id}` as any,
  },

  // ── Misc ─────────────────────────────────────────────────────────────────
  salutation: {
    list: 'readSalutation post /salutation' as const,
  },
} as const;
