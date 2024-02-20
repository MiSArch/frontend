<template>
    <v-app>
        <TheAppBar />
        <v-navigation-drawer
            v-if="activeUserRoleIsBuyer"
            location="start"
            floating
        >
            <v-list density="compact" nav>
                <v-list-item
                    title="All Products"
                    :to="{ name: 'Products' }"
                ></v-list-item>
                <v-divider class="mb-1"></v-divider>
                <v-list-group
                    v-if="hasAtLeastOneCategoryWithAtLeastOneVisibleProduct"
                    value="Categories"
                >
                    <template v-slot:activator="{ props }">
                        <v-list-item
                            v-bind="props"
                            title="Categories"
                        ></v-list-item>
                    </template>
                    <v-list-item
                        v-for="category in categoriesWithAtLeastOneVisibleProduct"
                        :title="category.name"
                        :to="{
                            name: 'Category',
                            params: { categoryid: category.id },
                        }"
                    ></v-list-item>
                </v-list-group>
                <v-list-item
                    title="Wishlists"
                    :to="{ name: 'Wishlists' }"
                ></v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-navigation-drawer
            v-if="activeUserRoleIsEitherAdminOrEmployee"
            class="bg-grey-lighten-3"
            expand-on-hover
            floating
            location="right"
            rail
        >
            <v-list density="default" nav>
                <v-list-item
                    prepend-icon="mdi-playlist-edit"
                    title="Manage Products"
                    :to="{ name: 'Manage Products' }"
                ></v-list-item>
                <v-list-item
                    prepend-icon="mdi-view-dashboard-edit"
                    title="Manage Categories"
                    :to="{ name: 'Manage Categories' }"
                ></v-list-item>
                <v-list-item
                    prepend-icon="mdi-file-percent"
                    title="Manage Tax Rates"
                    :to="{ name: 'Manage Tax Rates' }"
                ></v-list-item>
            </v-list>
        </v-navigation-drawer>
        <TheViewPlaceholder />
    </v-app>
</template>

<script lang="ts" setup>
import TheAppBar from './TheAppBar.vue'
import TheViewPlaceholder from './TheViewPlaceholder.vue'

import { useClient } from '@/graphql/client'
import { CategoryOrderField, OrderDirection } from '@/graphql/generated'
import { useAppStore } from '@/store/app'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { activeUserRoleIsBuyer, activeUserRoleIsEitherAdminOrEmployee } =
    storeToRefs(useAppStore())

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * Gets all available categories from the catalog service and
 * the total count of categories.
 * The returned categores are expected to be ordered by their names
 * in ascending order.
 */
const categoriesWithTotalCountOfProducts = asyncComputed(
    async () => {
        return client.getCategoriesWithTotalCountOfProducts({
            orderBy: {
                direction: OrderDirection.Asc,
                field: CategoryOrderField.Name,
            },
        })
    },
    null,
    { shallow: false }
)

/**
 * Filters the loaded categories (see the const categoriesWithTotalCountOfProducts)
 * to only include categories that have at least one visible product.
 * A product is considered visible if the product is publicly visible and
 * it has at least one visible product variant.
 */
const categoriesWithAtLeastOneVisibleProduct = computed(() => {
    if (categoriesWithTotalCountOfProducts.value == null) {
        return []
    }

    const totalCountOfCategories =
        categoriesWithTotalCountOfProducts.value.categories.totalCount
    if (totalCountOfCategories == 0) {
        return []
    }

    return categoriesWithTotalCountOfProducts.value.categories.nodes.filter(
        (category) =>
            category.products.nodes.filter(
                (product) =>
                    product.isPubliclyVisible &&
                    product.variants.nodes.filter(
                        (variant) => variant.isPubliclyVisible
                    ).length > 0
            ).length > 0
    )
})

/**
 * Whether or not there is at least one category
 * that has at least one visible product.
 */
const hasAtLeastOneCategoryWithAtLeastOneVisibleProduct = computed(() => {
    if (categoriesWithTotalCountOfProducts.value == null) {
        return false
    }

    const totalCountOfCategories =
        categoriesWithTotalCountOfProducts.value.categories.totalCount
    if (totalCountOfCategories == 0) {
        return false
    }

    return (
        categoriesWithAtLeastOneVisibleProduct &&
        categoriesWithAtLeastOneVisibleProduct.value.length > 0
    )
})
</script>
