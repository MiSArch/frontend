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
                <div class="d-flex flex-column ga-4">
                    <v-card title="Nikon F2" text="Product Summary">
                        <div class="d-flex flex-wrap mx-4 mb-4 ga-2">
                            <v-chip>Photography</v-chip>
                            <v-chip>Cameras</v-chip>
                            <v-chip>Film Cameras</v-chip>
                        </div>
                        <v-select class="mx-4"
                            label="Product Variant"
                            :items="['Nikon F2 50BK', 'Nikon F2 24S', 'Nikon F2 50S']"
                            variant="underlined"
                        ></v-select>
                        <div class="d-flex flex-wrap mx-4 mb-4 ga-2">
                            <v-chip>Lens: 50 mm F/1.8</v-chip>
                            <v-chip>Color: Black</v-chip>
                        </div>
                    </v-card>
                </div>
                <v-card class="align-self-start">
                    <ProductPrice :price="90" :retail-price="100" />
                    <v-select
                        class="ma-2"
                        :items="['1', '2', '3', '4', '5']"
                        density="compact"
                        hint="Choose how many to add to the cart."
                        label="Amount"
                        persistent-hint
                        variant="solo"
                    ></v-select>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn disabled prepend-icon="mdi-cart">Add To Cart</v-btn>
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
