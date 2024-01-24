<template>
    <div class="d-flex flex-column ga-4">
        <div>
            <v-btn
                class="mx-4"
                prepend-icon="mdi-arrow-left"
                :to="{ name: 'Storefront' }"
            >
                Back
            </v-btn>
        </div>
        <v-divider></v-divider>
        <div class="d-flex flex-column ga-4">
            <div class="d-flex mx-4 ga-4">
                <v-sheet border>
                    <v-carousel cycle show-arrows="hover">
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                    </v-carousel>
                </v-sheet>
                <v-card class="align-self-start" elevation="4">
                    <v-card-item>
                        <v-card-title>{{
                            product?.product.internalName
                        }}</v-card-title>
                        <v-card-subtitle>{{
                            productVariant?.currentVersion.name
                        }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip
                                v-for="category in categories"
                                @click="navigateToCategory(category.id)"
                            >
                                {{ category.name }}
                            </v-chip>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text>
                        <div class="d-flex flex-column ga-2">
                            <div
                                v-if="
                                    numericalCategoryCharacteristicValues?.length >
                                    0
                                "
                                class="d-flex flex-column ga-2"
                            >
                                <div class="text-caption">
                                    Numerical Characteristics
                                </div>
                                <div class="d-flex flex-wrap ga-2">
                                    <v-chip
                                        v-for="v in numericalCategoryCharacteristicValues"
                                    >
                                        {{ v.characteristic.name }}:
                                        {{ v.numericalValue }}
                                    </v-chip>
                                </div>
                            </div>
                            <div
                                v-if="
                                    categoricalCategoryCharacteristicValues?.length >
                                    0
                                "
                                class="d-flex flex-column mt-2 ga-2"
                            >
                                <v-divider></v-divider>
                                <div class="text-caption">
                                    Categorical Characteristics
                                </div>
                                <div class="d-flex flex-wrap ga-2">
                                    <v-chip
                                        v-for="v in categoricalCategoryCharacteristicValues"
                                    >
                                        {{ v.characteristic.name }}:
                                        {{ v.categoricalValue }}
                                    </v-chip>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card class="align-self-start">
                    <v-card-item>
                        <v-card-title
                            >{{
                                productVariant?.currentVersion.retailPrice
                            }}
                            EUR</v-card-title
                        >
                        <v-card-subtitle
                            class="text-decoration-line-through"
                            v-if="false"
                        >
                            {{ productVariant?.currentVersion.retailPrice }}
                            EUR
                        </v-card-subtitle>
                    </v-card-item>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-select
                            class=""
                            :items="['1', '2', '3', '4', '5']"
                            density="compact"
                            hint="Choose how many to add to the cart."
                            label="Amount"
                            persistent-hint
                            variant="solo"
                        ></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn disabled prepend-icon="mdi-cart"
                            >Add To Cart</v-btn
                        >
                    </v-card-actions>
                </v-card>
                <v-spacer></v-spacer>
                <v-card
                    disabled
                    title="Shipping"
                    text="3 Working Days"
                ></v-card>
            </div>
            <v-card
                class="mx-4"
                elevation="4"
                title="Description"
                :text="productVariant?.currentVersion.description"
            >
            </v-card>
            <v-card class="mx-4 mb-4" elevation="4">
                <v-card-item>
                    <v-card-title> Other Product Variants </v-card-title>
                </v-card-item>
                <v-card-text>
                    <v-list v-for="v in otherProductVariants">
                        <v-list-item>
                            <ProductSummary
                                :product-id="product?.product.id"
                                :internal-name="v.currentVersion.name"
                                :price="v.currentVersion.retailPrice"
                                :retail-price="v.currentVersion.retailPrice"
                                :product-variant-id="v.id"
                            />
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProductSummary from '@/components/ProductSummary.vue'
import { useClient } from '@/graphql/client'
import { asyncComputed } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The current route (location).
 */
const route = useRoute()

/**
 * The router.
 */
const router = useRouter()

/**
 * The product id (taken from the route params).
 */
const id = computed(() => {
    return route.params.productid.toString()
})

/**
 * Gets the "entire" product from the catalog service.
 */
const product = asyncComputed(
    async () => {
        return client.getProduct({
            id: id.value,
        })
    },
    null,
    { shallow: false }
)

/**
 * Gets the product categories to which the product belongs.
 */
const categories = computed(() => {
    return product.value?.product.categories.nodes ?? []
})

/**
 * The id of the product variant that gets displayed on this view.
 */
const productVariantId = ref()

/**
 * Decides which product variant to display initially.
 */
const productVariant = computed(() => {
    if (route.params.productvariantid) {
        productVariantId.value = route.params.productvariantid
    } else {
        productVariantId.value = product.value?.product.defaultVariant.id
    }

    return product.value?.product.variants.nodes.find(
        (variant) => variant.id == productVariantId.value
    )
})

/**
 * The other product variants.
 * These are listed in the section 'Other Product Variants'.
 */
const otherProductVariants = computed(() => {
    return (
        product.value?.product.variants.nodes.filter(
            (variant) => variant.id != productVariantId.value
        ) ?? []
    )
})

/**
 * The categorical values of the product variant's CategoryCharacteristicValues.
 */
const categoricalCategoryCharacteristicValues = computed(() => {
    return (
        productVariant.value?.currentVersion.characteristicValues.nodes
            .filter(
                (characteristicValue) =>
                    characteristicValue.__typename ===
                    'CategoricalCategoryCharacteristicValue'
            )
            .map(
                (categoricalCategoryCharacteristicValue) =>
                    categoricalCategoryCharacteristicValue as any
            ) ?? []
    )
})

/**
 * The numerical values of the product variant's CategoryCharacteristicValues.
 */
const numericalCategoryCharacteristicValues = computed(() => {
    return (
        productVariant.value?.currentVersion.characteristicValues.nodes
            .filter(
                (characteristicValue) =>
                    characteristicValue.__typename ===
                    'NumericalCategoryCharacteristicValue'
            )
            .map(
                (numericalCategoryCharacteristicValue) =>
                    numericalCategoryCharacteristicValue as any
            ) ?? []
    )
})

/**
 * Navigates to the category to which the given id belongs.
 * The navigation is done via the Vue Router.
 * @param id The id of the category to navigate to.
 */
function navigateToCategory(id: any) {
    router.push({
        name: 'Category',
        params: {
            categoryid: id,
        },
    })
}
</script>
