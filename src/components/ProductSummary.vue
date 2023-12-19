<!-- TODO Refine component -->

<template>
    <router-link to="/products/foo/bar">
        <v-sheet class="d-flex" :elevation="1">
            <div class="d-inline-flex ma-2">
                <v-img
                    :width="240"
                    aspect-ratio="4/3"
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                ></v-img>
            </div>
            <div class="d-flex flex-column ma-2">
                <span class="text-body-1"> Foo </span>
                <ProductPrice :price="90" :retail-price="100" />
            </div>
        </v-sheet>
    </router-link>
</template>

<script lang="ts" setup>
import ProductPrice from './ProductPrice.vue'
</script>
