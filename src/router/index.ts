// Composables
import { useAppStore } from '@/store/app'
import { createRouter, createWebHistory } from 'vue-router'
import { canAccess, getAccessRights } from './accessRights'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/default/TheDefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'Storefront',
                // route level code-splitting
                // this generates a separate chunk (Storefront-[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('@/views/StorefrontView.vue'),
            },
            {
                path: 'products',
                name: 'Products',
                component: () => import('@/views/ProductsView.vue'),
            },
            {
                path: 'products/:productid/:productvariantid?',
                name: 'Product',
                component: () => import('@/views/ProductView.vue'),
            },
            {
                path: 'categories/:categoryid',
                name: 'Category',
                component: () => import('@/views/CategoryView.vue'),
            },
            {
                path: 'wishlists',
                name: 'Wishlists',
                component: () => import('@/views/WishlistsView.vue'),
            },
            {
                path: 'wishlists/:wishlistid',
                name: 'Wishlist',
                component: () => import('@/views/WishlistView.vue'),
            },
            {
                path: 'manage-products',
                name: 'Manage Products',
                component: () => import('@/views/ManageProductsView.vue'),
            },
            {
                path: 'manage-categories',
                name: 'Manage Categories',
                component: () => import('@/views/ManageCategoriesView.vue'),
            },
            {
                path: 'manage-tax-rates',
                name: 'Manage Tax Rates',
                component: () => import('@/views/ManageTaxRatesView.vue'),
            },
            {
                path: 'tax-rates/:taxrateid',
                name: 'Tax Rate',
                component: () => import('@/views/TaxRateView.vue'),
            },
        ],
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
router.beforeEach((to, from) => {
    const appStore = useAppStore()
    const accessRights = getAccessRights(appStore.activeUserRole)

    if (typeof to.name === 'string' && accessRights !== null) {
        const userCanAccess = canAccess(to.name, accessRights)
        if (process.env.NODE_ENV === 'development') {
            console.log('User can access the route to:', to.name, ' -- ', userCanAccess)
        }
        return userCanAccess
    }

    return false
})

export default router
