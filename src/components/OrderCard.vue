<template>
    <v-card>
        <v-card-item :prepend-icon="icon">
            <v-card-title class="text-capitalize">
                order {{ purpose }}
            </v-card-title>
            <v-card-subtitle>{{ order?.id }}</v-card-subtitle>
        </v-card-item>
        <v-card-item>
            <v-card-title class="text-capitalize">
                status: {{ orderStatus }}
            </v-card-title>
            <v-card-subtitle>
                Created <RelativeTime :time="order?.createdAt" />
            </v-card-subtitle>
            <v-card-subtitle v-if="orderStatus === OrderStatus.Placed">
                Placed <RelativeTime :time="order?.placedAt" />
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            {{ descriptionOfOrderStatus }}
        </v-card-text>
        <v-card-text v-if="orderStatus === OrderStatus.Rejected">
            {{ order?.rejectionReason }}
        </v-card-text>
        <v-card-text v-if="orderStatus === OrderStatus.Pending && hasActions">
            The order must be placed within one hour of its creation.
        </v-card-text>
        <v-card-actions v-if="hasActions">
            <v-spacer></v-spacer>
            <v-btn
                v-if="orderStatus == OrderStatus.Pending"
                class="text-capitalize"
                color="primary"
                variant="elevated"
                @click="emits('order-placement-requested', orderId)"
                >place order now</v-btn
            >
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import RelativeTime from './RelativeTime.vue'
import { useClient } from '@/graphql/client'
import { backendToFrontend } from '@/graphql/orderStatusMapping'
import { OrderStatus } from '@/model/enums/orderStatus'
import { errorMessages } from '@/strings/errorMessages'
import { pushErrorNotification } from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { computed } from 'vue'

/**
 * The Props of this component.
 */
const props = defineProps({
    /**
     * The ID of the order.
     */
    orderId: {
        type: String,
        required: true,
    },
    /**
     * The purpose of the visual order representation, e.g., 'Summary'.
     */
    purpose: {
        type: String,
        required: false,
    },
    /**
     * A trigger for the querying of the order.
     */
    triggerForQueryingOfOrder: {
        type: Number,
        required: false,
        default: 0,
    },
    /**
     * Whether the card should have card-actions enabled or not.
     */
    hasActions: {
        type: Boolean,
        required: false,
        default: false,
    },
})

/**
 * The events of this component:
 *
 * @event order-placement-requested - The user has requested the order to be placed.
 */
const emits = defineEmits<{
    (event: 'order-placement-requested', orderId: string): void
}>()

/**
 * Asynchronously gets the order from the order service based on the provided order ID.
 */
const getOrderQuery = asyncComputed(
    async () => {
        props.triggerForQueryingOfOrder
        return await useClient().getOrder({ id: props.orderId })
    },
    null,
    {
        onError: (e) => pushErrorNotification(errorMessages.getOrder, e),
        shallow: false,
    }
)

/**
 * Computed property that represents the order taken from the getOrderQuery.
 */
const order = computed(() => {
    if (getOrderQuery.value == undefined) {
        return
    }

    return getOrderQuery.value.order
})

/**
 * Computed property that represents the status of the order.
 */
const orderStatus = computed(() => {
    if (order.value?.orderStatus != undefined) {
        return backendToFrontend.get(order.value.orderStatus)
    }
})

/**
 * Computed property that represents the icon associated with the order status.
 */
const icon = computed(() => {
    switch (orderStatus.value) {
        case OrderStatus.Pending:
            return 'mdi-timer-sand'
        case OrderStatus.Placed:
            return 'mdi-package'
        case OrderStatus.Rejected:
            return 'mdi-close-box'
        default:
            return undefined
    }
})

/**
 * Map containing descriptions for each order status.
 */
const descriptionOfOrderStatusMap = new Map<OrderStatus, string>([
    [
        OrderStatus.Pending,
        'The order has been registered by the system but has not yet been confirmed. If the order could not be confirmed after one hour, it must be rejected.',
    ],
    [
        OrderStatus.Placed,
        'The order has been received and is now being processed.',
    ],
    [
        OrderStatus.Rejected,
        'The order could not be processed and must be canceled. Amounts paid will be refunded.',
    ],
])

/**
 * Computed property that represents the description of the order status.
 */
const descriptionOfOrderStatus = computed(() => {
    if (orderStatus.value != undefined) {
        return descriptionOfOrderStatusMap.get(orderStatus.value)
    }
})
</script>
