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

const client = useClient()

// The page that gets loaded initially.
const currentPage = ref(1)

// How many products a single page can contain at max.
const perPage = ref(5)

// This async operation is supposed to load the first five (see perPage) products
// of all of the products. Also it "computes" the count of returned products.
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

// This computes how many pages there are
// depending on the amount of products received via productAndCount.
const pageCount = computed(() => {
    const totalCount = productAndCount.value?.products?.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})

// These are the actual products received via productAndCount.
const products = computed(() => productAndCount.value?.products?.nodes ?? [])
</script>
