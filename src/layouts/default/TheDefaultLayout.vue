<template>
    <v-app>
        <TheAppBar />
        <v-navigation-drawer location="start" floating>
            <v-list density="compact" nav>
                <v-list-item
                    title="All Products"
                    :to="{ name: 'Products' }"
                ></v-list-item>
                <v-divider class="mb-1"></v-divider>
                <v-list-group value="Categories">
                    <template v-slot:activator="{ props }">
                        <v-list-item
                            v-bind="props"
                            title="Categories"
                        ></v-list-item>
                    </template>
                    <v-list-item
                        v-for="category in allCategories"
                        :title="category.name"
                        :to="{
                            name: 'Category',
                            params: { categoryid: category.id },
                        }"
                    ></v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-navigation-drawer class="bg-grey-lighten-4" expand-on-hover floating location="right" rail>
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
import { computed } from 'vue'
import { asyncComputed } from '@vueuse/core'

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
const getAllCategoriesResult = asyncComputed(
    async () => {
        return client.getAllCategories({
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
 * Gets only the categories -- the entities -- from getAllCategoriesResult.
 */
const allCategories = computed(
    () => getAllCategoriesResult.value?.categories?.nodes ?? []
)
</script>
