<template>
    <div class="d-flex flex-column ma-4">
        <div class="text-h4 pa-4">{{ category?.category.name }}</div>
        <div class="text-body-1 pa-4">{{ category?.category.description }}</div>
    </div>
    <TheResults />
</template>

<script lang="ts" setup>
import TheResults from '@/components/TheResults.vue'
import { asyncComputed } from '@vueuse/core'
import { useClient } from '@/graphql/client'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

/**
 * A Category represents a simplified product category.
 */
interface Category {
    id: any
    name: string
    description: string
}

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

const category = asyncComputed(
    async () => {
        return client.getCategory({
            id: id.value,
        })
    },
    null,
    { shallow: false }
)
</script>
