<template>
    <div class="d-flex flex-column ma-4">
        <div class="text-h4 pa-4">{{ category?.category.name }}</div>
        <div class="text-body-1 pa-4">{{ category?.category.description }}</div>
    </div>
    <TheResults :category-id="id" />
</template>

<script lang="ts" setup>
import TheResults from '@/components/TheResults.vue'
import { useClient } from '@/graphql/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { asyncComputed } from '@vueuse/core'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The current route (location).
 */
const route = useRoute()

/**
 * The category id (taken from the route params).
 */
const id = computed(() => {
    return route.params.categoryid.toString()
})

/**
 * Gets the category.
 */
const category = asyncComputed(
    async () => {
        return client.getCategoryWithCharacteristicsAndDefaultProductVariants({
            id: id.value,
        })
    },
    null,
    { shallow: false }
)
</script>
