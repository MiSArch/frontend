// Composables
import { createRouter, createWebHistory } from 'vue-router'

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
                path: 'products/:productid/:productvariantid',
                name: 'Product',
                component: () => import('@/views/ProductView.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
