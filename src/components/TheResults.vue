<template>
    <div class="d-flex flex-column">
        <v-list v-for="product in products">
            <v-list-item>
                <ProductSummary
                    :product-i-d="product.productID"
                    :internal-name="product.internalName"
                    :price="product.price"
                    :retail-price="product.retailPrice"
                />
            </v-list-item>
        </v-list>
        <v-pagination :length="5" rounded="circle"></v-pagination>
    </div>
</template>

<script lang="ts" setup>
import ProductSummary from './ProductSummary.vue'
import { ref } from 'vue'

const products = ref([
    { productID: '0001', internalName: 'New York T-Shirt', price: 45, retailPrice: 45 },
    { productID: '0002', internalName: 'Berlin Pants', price: 180, retailPrice: 200 },
    { productID: '0003', internalName: 'Paris Hoodie', price: 85, retailPrice: 100 },
])
</script>
