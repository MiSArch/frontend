<template>
    <div class="d-flex flex-column">
        <v-list v-for="product in products">
            <v-list-item>
                <ProductSummary
                    :product-id="product.id"
                    :product-variant-id="product.defaultVariant.id"
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
import ProductSummary from './ProductSummary.vue'
import { OrderDirection, ProductOrderField } from '@/graphql/generated'
import { useClient } from '@/graphql/client'
import { computed, ref } from 'vue'
import { asyncComputed } from '@vueuse/core'
import { pushErrorNotificationIfNecessary } from '@/util/errorHandler'
import { errorMessages } from '@/strings/errorMessages'

/**
 * The props of this SFC.
 */
const props = defineProps({
    categoryId: String,
})

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
 * If a categoryId has been passed to this SFC
 * then only the products of that category are queried.
 */
const productConnection = asyncComputed(
    async () => {
        if (props.categoryId) {
            var categoryWithAssociatedProducts =
                await pushErrorNotificationIfNecessary(() => {
                    return client.getCategoryWithCharacteristicsAndDefaultProductVariants(
                        {
                            id: props.categoryId,
                            firstProducts: perPage.value,
                            skipProducts:
                                (currentPage.value - 1) * perPage.value,
                            orderProductsBy: {
                                direction: OrderDirection.Asc,
                                field: ProductOrderField.InternalName,
                            },
                        }
                    )
                }, errorMessages.getCategoryWithCharacteristicsAndDefaultProductVariants)
            return categoryWithAssociatedProducts.category.products
        } else {
            var products = await pushErrorNotificationIfNecessary(() => {
                return client.getDefaultProductVariants({
                    first: perPage.value,
                    skip: (currentPage.value - 1) * perPage.value,
                    orderBy: {
                        direction: OrderDirection.Asc,
                        field: ProductOrderField.InternalName,
                    },
                })
            }, errorMessages.getDefaultProductVariants)
            return products.products
        }
    },
    null,
    {
        shallow: false,
    }
)

/**
 * Computes how many pages there are
 * depending on the maximum number of products a page can contain.
 */
const pageCount = computed(() => {
    const totalCount = productConnection.value?.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})

/**
 * Gets the products received via productConnection.
 */
const products = computed(() => productConnection.value?.nodes ?? [])
</script>
