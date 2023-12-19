<template>
    <div class="d-flex flex-column">
        <v-list>
            <v-list-item class="">
                <ProductSummary />
            </v-list-item>
            <v-list-item class="pa-8">
                <ProductSummary />
            </v-list-item>
            <v-list-item class="pa-4">
                <ProductSummary />
            </v-list-item>
            <v-list-item class="pa-2">
                <ProductSummary />
            </v-list-item>
        </v-list>
        <v-pagination :length="5" rounded="circle"></v-pagination>
    </div>
</template>

<script lang="ts" setup>
import ProductSummary from './ProductSummary.vue'
</script>
