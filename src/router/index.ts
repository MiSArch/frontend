// Composables
import { useAppStore } from '@/store/app'
import { createRouter, createWebHistory } from 'vue-router'
import { canAccess, getAccessRights } from './accessRights'
import { routeNames } from './routeNames'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/default/TheDefaultLayout.vue'),
        children: [
            {
                path: '',
                name: routeNames.storefront,
                // route level code-splitting
                // this generates a separate chunk (Storefront-[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('@/views/StorefrontView.vue'),
            },
            {
                path: 'products',
                name: routeNames.products,
                component: () => import('@/views/ProductsView.vue'),
            },
            {
                path: 'products/:productid/:productvariantid?',
                name: routeNames.product,
                component: () => import('@/views/ProductView.vue'),
            },
            {
                path: 'categories/:categoryid',
                name: routeNames.category,
                component: () => import('@/views/CategoryView.vue'),
            },
            {
                path: 'wishlists',
                name: routeNames.wishlists,
                component: () => import('@/views/WishlistsView.vue'),
            },
            {
                path: 'wishlists/:wishlistid',
                name: routeNames.wishlist,
                component: () => import('@/views/WishlistView.vue'),
            },
            {
                path: 'manage-products',
                name: routeNames.manageProducts,
                component: () => import('@/views/ManageProductsView.vue'),
            },
            {
                path: 'manage-categories',
                name: routeNames.manageCategories,
                component: () => import('@/views/ManageCategoriesView.vue'),
            },
            {
                path: 'manage-tax-rates',
                name: routeNames.manageTaxRates,
                component: () => import('@/views/ManageTaxRatesView.vue'),
            },
            {
                path: 'tax-rates/:taxrateid',
                name: routeNames.taxRate,
                component: () => import('@/views/TaxRateView.vue'),
            },
            {
                path: 'shopping-cart',
                name: routeNames.shoppingCart,
                component: () => import('@/views/ShoppingCartView.vue'),
            },
        ],
    },
    {
        path: '/checkout',
        children: [
            {
                path: 'address',
                name: routeNames.checkoutAddress,
                component: () =>
                    import('@/views/checkout/AddressInformationView.vue'),
            },
            {
                path: 'shipment',
                name: routeNames.checkoutShipment,
                component: () =>
                    import('@/views/checkout/ShipmentInformationView.vue'),
            },
            {
                path: 'payment',
                name: routeNames.checkoutPayment,
                component: () =>
                    import('@/views/checkout/PaymentInformationView.vue'),
            },
            {
                path: 'summary',
                name: routeNames.checkoutSummary,
                component: () =>
                    import('@/views/checkout/OrderSummaryView.vue'),
            },
        ],
        component: () => import('@/layouts/checkout/TheCheckoutLayout.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

/**
 * As of now, this only ensures that a user
 * without the required access rights to a given route,
 * cannot access that page.
 */
router.beforeEach((to) => {
    const appStore = useAppStore()
    const accessRights = getAccessRights(appStore.activeUserRole)

    if (typeof to.name === 'string' && accessRights !== null) {
        const userCanAccess = canAccess(to.name, accessRights)
        if (process.env.NODE_ENV === 'development') {
            console.log(
                'User can access the route to:',
                to.name,
                ' -- ',
                userCanAccess
            )
        }
        return userCanAccess
    }

    return false
})

export default router
