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
                            <v-chip>Dummy Clothing</v-chip>
                            <v-chip>Dummy T-Shirts</v-chip>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <div class="pa-4">
                        <v-select
                            :items="['Dummy Black', 'Dummy White']"
                            density="compact"
                            label="Color"
                            variant="outlined"
                        ></v-select>
                        <v-select
                            :items="['Dummy S', 'Dummy M', 'Dummy L']"
                            density="compact"
                            label="Size"
                            variant="outlined"
                        ></v-select>
                    </div>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { asyncComputed } from '@vueuse/core'
import { useClient } from '@/graphql/client'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const client = useClient()
const route = useRoute()

const id = route.params.productid.toString()
const productVariantId = route.params.productvariantid?.toString()

const product = asyncComputed(
    async () => {
        return client.getProduct({
            id: route.params.productid.toString(),
        })
    },
    null,
    { shallow: false }
)

const productVariant = computed(() => {
    if (!productVariantId) {
        return product?.value?.product?.defaultVariant
    } else {
        return product?.value?.product?.variants?.nodes?.find(
            (v) => v.id == productVariantId
        )
    }
})
</script>
