<template>
    <div
        class="d-flex flex-column"
    >
        <v-list>
            <v-list-item
                class="mb-2"
            >
                <ProductSummary />
            </v-list-item>
            <v-list-item
                class="mb-2"
            >
                <ProductSummary />
            </v-list-item>
            <v-list-item>
                <ProductSummary />
            </v-list-item>
        </v-list>
        <v-pagination
            :length="5"
            rounded="circle"
        ></v-pagination>
    </div>
</template>

<script lang="ts" setup>
    import ProductSummary from './ProductSummary.vue';
</script>