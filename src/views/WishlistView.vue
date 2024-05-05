<template>
    <div class="d-flex flex-column ma-4">
        <div class="text-h4 pa-4">{{ wishlist?.wishlist.name }}</div>
        <v-list
            v-if="
                wishlist?.wishlist &&
                wishlist.wishlist.productVariants.totalCount > 0
            "
            class="mx-2"
        >
            <v-list-item
                v-for="productVariant in wishlist.wishlist.productVariants
                    .nodes"
            >
                <ProductSummary
                    :product-id="productVariant.product.id"
                    :product-variant-id="productVariant.id"
                    :name="productVariant.currentVersion.name"
                    :price="productVariant.currentVersion.retailPrice"
                    :retail-price="productVariant.currentVersion.retailPrice"
                    :image-path="
                        productVariant.currentVersion.medias.nodes[0]?.path
                            ?? ''
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
import ProductSummary from '@/components/ProductSummary.vue'
import { useClient } from '@/graphql/client'
import { CommonOrderField, OrderDirection } from '@/graphql/generated'
import { errorMessages } from '@/strings/errorMessages'
import { pushErrorNotification } from '@/util/errorHandler'
import { computed, ref } from 'vue'
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
 * The ID of the wishlist (taken from the route params).
 */
const id = computed(() => {
    return route.params.wishlistid.toString()
})

/**
 * The page of product variants that is displayed currently.
 */
const currentPage = ref(1)

/**
 * The maximum number of product variants a page can contain.
 */
const perPage = ref(5)

/**
 * This prop is used for triggering a reevaluation
 * of the async computed prop 'wishlist'.
 */
const trigger = ref(0)

/**
 * The wishlist that should be displayed.
 */
const wishlist = asyncComputed(
    async () => {
        trigger.value

        return await client.getWishlist({
            id: id.value,
            firstProductVariants: perPage.value,
            skipProductVariants: (currentPage.value - 1) * perPage.value,
            orderProductVariantsBy: {
                direction: OrderDirection.Desc,
                field: CommonOrderField.Id,
            },
        })
    },
    null,
    {
        onError: (e) => pushErrorNotification(errorMessages.getWishlist, e),
        shallow: false,
    }
)

/**
 * Computes how many pages there are
 * depending on the maximum number of product variants a page can contain.
 */
const pageCount = computed(() => {
    const totalCount = wishlist.value?.wishlist.productVariants.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})
</script>
