<template>
    <v-toolbar class="bg-grey-lighten-3">
        <v-toolbar-title
            >Shopping Cart{{ ': ' + total + ' EUR' }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn
            prepend-icon="mdi-cash-register"
            @click="emit('checkout-initiated')"
        >
            proceed to checkout
        </v-btn>
    </v-toolbar>
</template>

<script lang="ts" setup>
/**
 * Props of this component:
 *
 * @prop total - The total of the shopping cart.
 */
defineProps({
    total: {
        type: Number,
        required: true,
    },
})

/**
 * The emitted events of this component:
 *
 * @event checkout-initiated - The user wants to proceed to checkout.
 */
const emit = defineEmits<{
    (event: 'checkout-initiated'): void
}>()
</script>
