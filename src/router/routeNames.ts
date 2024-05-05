/**
 * The names of the routes of the Vue Router.
 * @constant
 */
export const routeNames = {
    category: 'category',
    checkout: 'checkout',
    checkoutAddress: 'checkout-address',
    checkoutPayment: 'checkout-payment',
    checkoutShipment: 'checkout-shipment',
    checkoutSummary: 'checkout-summary',
    manageCategories: 'manage-categories',
    manageProducts: 'manage-products',
    manageTaxRates: 'manage-tax-rates',
    product: 'product',
    products: 'products',
    shoppingCart: 'shopping-cart',
    storefront: 'storefront',
    taxRate: 'tax-rate',
    wishlist: 'wishlist',
    wishlists: 'wishlists',
    graphiql: 'graphiql',
} as const

/**
 * The names of the routes of the Vue Router.
 */
export type RouteName = (typeof routeNames)[keyof typeof routeNames]
