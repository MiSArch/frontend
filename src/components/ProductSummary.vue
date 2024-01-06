<template>
    <v-sheet class="d-flex" :elevation="1" border>
        <div class="d-inline-flex ma-2">
            <v-img
                :width="240"
                aspect-ratio="4/3"
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
            ></v-img>
        </div>
        <div class="d-flex flex-column ma-2">
            <router-link
                :to="{ name: 'Product', params: { productid: productId } }"
            >
                <span class="text-body-1">{{ internalName }}</span>
            </router-link>

            <ProductPrice :price="price" :retail-price="retailPrice" />
        </div>
    </v-sheet>
</template>

<script lang="ts" setup>
import ProductPrice from './ProductPrice.vue'

const props = defineProps({
    productId: {
        type: String,
        required: true,
    },
    internalName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
})
</script>
