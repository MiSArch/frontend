<template>
    <div class="d-flex justify-center">
        <OrderCard :order-id="orderId" purpose="summary" class="w-75 ma-6" />
    </div>
</template>

<script lang="ts" setup>
import OrderCard from '@/components/OrderCard.vue'

defineProps({
    /**
     * The ID of the order.
     */
    orderId: {
        type: String,
        required: true,
    },
})
</script>
