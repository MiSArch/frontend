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

const currentPage = ref(1)
const perPage = ref(5)
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
const pageCount = computed(() => {
    const totalCount = productAndCount.value?.products?.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})
const products = computed(() => productAndCount.value?.products?.nodes ?? [])
</script>
