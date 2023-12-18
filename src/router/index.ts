// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/default/Default.vue'),
        children: [
            {
                path: '',
                name: 'Storefront',
                // route level code-splitting
                // this generates a separate chunk (Storefront-[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('@/views/TheStorefront.vue'),
            },
            {
                path: 'products',
                name: 'Products',
                component: () => import('@/views/TheProducts.vue'),
            },
            {
                path: 'products/:productid/:productvariantid',
                name: 'Product',
                component: () => import('@/views/TheProduct.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
