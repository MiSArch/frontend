<template>
    <div
        class="d-flex flex-column pa-4"
    >
        <div
            class="d-flex mb-4"
        >
            <v-btn
                prepend-icon="mdi-arrow-left"
                :to="{name: 'Storefront'}"
            >
                Back
            </v-btn>
        </div>
        
        <div
            class="d-flex mb-4"
        >
            <v-sheet
                border
            >
                <v-carousel
                    cycle
                    show-arrows="hover"
                >
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

            <div
                class="ml-8 me-auto"
            >
                <v-card
                    title="Bar"
                    subtitle="Foo"
                >
                    <v-select
                        class="ma-2"
                        clearable
                        density="compact"
                        label="Variant"
                        :items="['Bar', 'Baz', 'Zep']"
                        variant="solo"
                    ></v-select>
                    <ProductPrice class="ma-2"/>
                    <v-select
                        class="ma-2"
                        clearable
                        density="compact"
                        label="Amount"
                        :items="['1', '2', '3', '4', '5']"
                        variant="solo"
                    ></v-select>
                    <v-card-actions>
                        <v-btn prepend-icon="mdi-cart">Add To Cart</v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <div
                class=""
            >
                <v-card
                    title="Shipping"
                    text="3 Working Days"
                ></v-card>
            </div>
        </div>

        <div
            class="mb-4"
        >
            <v-card
                title="Description"
                text="Foo is the most amazing thing on earth."
            >
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ProductPrice from '@/components/ProductPrice.vue';
</script>
