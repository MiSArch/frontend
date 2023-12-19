<!-- TODO Remove "bg-surface-variant" from div for product summary row -->

<!-- TODO Make category chips clickable -> route to category -->
<!-- TODO Extract ShippingInformation component -->

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
                        <v-card-title>{{ internalName }}</v-card-title>
                        <v-card-subtitle>{{
                            productVariantName
                        }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip>Clothing</v-chip>
                            <v-chip>T-Shirts</v-chip>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <div class="pa-4">
                        <v-select
                            :items="['Black', 'White']"
                            density="compact"
                            label="Color"
                            variant="outlined"
                        ></v-select>
                        <v-select
                            :items="['S', 'M', 'L']"
                            density="compact"
                            label="Size"
                            variant="outlined"
                        ></v-select>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn>Reset To Default</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card class="align-self-start">
                    <v-card-item>
                        <v-card-title>{{ price }} EUR</v-card-title>
                        <v-card-subtitle
                            class="text-decoration-line-through"
                            v-if="price != retailPrice"
                        >
                            {{ retailPrice }} EUR
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
                text="This T-Shirt is the single most amazing T-Shirt on earth."
            >
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProductPrice from '@/components/ProductPrice.vue'
import { ref } from 'vue'

const internalName = ref('New York T-Shirt')
const productVariantName = ref('New York T-Shirt Black Medium')
const price = ref(90)
const retailPrice = ref(100)
</script>
