<template>
    <div class="d-flex flex-column">
        <ProductSummary
            :product-id="orderItem.shoppingCartItem.productId"
            :product-variant-id="orderItem.shoppingCartItem.productVariantId"
            :id-of-shopping-cart-item="orderItem.shoppingCartItem.id"
            :name="orderItem.shoppingCartItem.nameOfProductVariant"
            :price="orderItem.shoppingCartItem.retailPrice"
            :retail-price="orderItem.shoppingCartItem.retailPrice"
            :count="orderItem.shoppingCartItem.count"
            :readonly="true"
        />
        <slot name="shipmentMethod"></slot>
    </div>
</template>

<script lang="ts" setup>
import { OrderItemImpl } from '@/model/classes/orderItemImpl'
import ProductSummary from './ProductSummary.vue'

defineProps({
    orderItem: {
        type: OrderItemImpl,
        required: true,
    },
})
</script>
