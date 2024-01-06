<template>
    <div class="d-flex flex-column">
        <v-list v-for="product in products">
            <v-list-item>
                <ProductSummary
                    :product-id="product.id"
                    :internal-name="product.defaultVariant.currentVersion.name"
                    :price="product.defaultVariant.currentVersion.retailPrice"
                    :retail-price="
                        product.defaultVariant.currentVersion.retailPrice
                    "
                />
            </v-list-item>
        </v-list>
        <v-pagination
            v-model="currentPage"
            :length="pageCount"
            rounded="circle"
        ></v-pagination>
    </div>
</template>

<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
import ProductSummary from './ProductSummary.vue'
import { ref } from 'vue'
import { useClient } from '@/graphql/client'
import { computed } from 'vue'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The page of products that is displayed currently.
 */
const currentPage = ref(1)

/**
 * The maximum number of products a page can contain.
 */
const perPage = ref(5)

/**
 * Gets the products of the current page and
 * the total count of all products.
 */
const productAndCount = asyncComputed(
    async () => {
        return client.getProductsList({
            first: perPage.value,
            skip: (currentPage.value - 1) * perPage.value,
        })
    },
    null,
    { shallow: false }
)

/**
 * Computes how many pages there are
 * depending on the maximum number of products a page can contain.
 */
const pageCount = computed(() => {
    const totalCount = productAndCount.value?.products?.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})

/**
 * Gets the products received via productAndCount.
 */
const products = computed(() => productAndCount.value?.products?.nodes ?? [])
</script>
