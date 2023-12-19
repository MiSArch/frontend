<!-- TODO Add category information -->
<!-- TODO Add characteristic values -->
<!-- TODO Extract ShippingInformation component -->

<template>
    <div class="d-flex flex-column">
        <div>
            <v-btn
                class="ml-4"
                prepend-icon="mdi-arrow-left"
                :to="{ name: 'Storefront' }"
            >
                Back
            </v-btn>
        </div>
        <v-divider class="my-4"></v-divider>
        <div>
            <div class="d-flex ma-4">
                <div>
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
                </div>
                <v-card
                    class="align-self-start flex-grow-1 mx-4"
                    title="Bar"
                    subtitle="Foo"
                >
                    <ProductPrice
                        class="ma-2"
                        :price="90"
                        :retail-price="100"
                    />
                    <v-select
                        class="ma-2"
                        clearable
                        density="compact"
                        label="Variant"
                        :items="['Bar', 'Baz', 'Zep']"
                        variant="solo"
                    ></v-select>
                    <v-select
                        class="ma-2"
                        clearable
                        density="compact"
                        label="Amount"
                        :items="['1', '2', '3', '4', '5']"
                        variant="solo"
                    ></v-select>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="mdi-cart">Add To Cart</v-btn>
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
                class="ma-4"
                title="Description"
                text="Foo is the single most amazing thing on earth."
            >
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProductPrice from '@/components/ProductPrice.vue'
</script>
