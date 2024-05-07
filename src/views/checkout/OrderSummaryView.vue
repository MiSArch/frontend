<template>
    <div class="d-flex justify-center">
        <OrderCard
            class="w-75 ma-6"
            :order-id="orderId"
            purpose="summary"
            :trigger-for-querying-of-order="triggerForQueryingOfOrder"
            has-actions
            @order-placement-requested="openConfirmOrCancelDialog"
        />
    </div>
    <ConfirmOrCancelDialog
        v-model="confirmOrCancelDialogIsOpen"
        message="Click confirm to place the order."
        @canceled="closeConfirmOrCancelDialog"
        @confirmed="onUserConfirmedOrderPlacement"
    />
    <v-overlay
        class="d-flex align-center justify-center"
        v-model="isAwaitingOrderPlacement"
        persistent
    >
        <v-progress-circular
            color="primary"
            indeterminate
        ></v-progress-circular>
    </v-overlay>
</template>

<script lang="ts" setup>
import ConfirmOrCancelDialog from '@/components/ConfirmOrCancelDialog.vue'
import OrderCard from '@/components/OrderCard.vue'
import { useAppStore } from '@/store/app'
import { placeOrder } from '@/store/orderManagement'
import { ref } from 'vue'

const props = defineProps({
    /**
     * The ID of the order.
     */
    orderId: {
        type: String,
        required: true,
    },
})

const store = useAppStore()

/**
 * A trigger for the querying of the order.
 */
const triggerForQueryingOfOrder = ref(0)

/**
 * Whether the confirmation dialog is open.
 */
const confirmOrCancelDialogIsOpen = ref(false)

/**
 * Opens the confirmation dialog.
 */
function openConfirmOrCancelDialog(): void {
    confirmOrCancelDialogIsOpen.value = true
}

/**
 * Closes the confirmation dialog.
 */
function closeConfirmOrCancelDialog(): void {
    confirmOrCancelDialogIsOpen.value = false
}

/**
 * Asynchronously handles the event when the user confirms the placement of an order.
 * This function closes the confirmation dialog and proceeds to place the order while updating the summary.
 * @returns A Promise that resolves once the order is placed and the summary is updated.
 */
async function onUserConfirmedOrderPlacement(): Promise<void> {
    closeConfirmOrCancelDialog()
    await placeOrderAndTriggerSummaryUpdate()
}

/**
 * Whether this component is awaiting the order service's placement of the order right now.
 */
const isAwaitingOrderPlacement = ref(false)

/**
 * Asynchronously places the order and triggers a summary update.
 * This function sets the state to indicate that an order placement is in progress,
 * places the order with the provided orderId, and then updates the state upon completion.
 * Additionally, it pushes a notification to the store indicating the success of the order placement
 * and triggers querying for updated order information.
 * @returns A Promise that resolves once the order is successfully placed and the summary is updated.
 */
async function placeOrderAndTriggerSummaryUpdate(): Promise<void> {
    isAwaitingOrderPlacement.value = true
    try {
        await placeOrder(props.orderId)
    } catch (error) {
        throw error
    } finally {
        isAwaitingOrderPlacement.value = false
        triggerForQueryingOfOrder.value++
    }
    store.upcomingOrder.hasBeenPlaced = true
    store.pushNotification({
        text: 'Your order has been placed.',
        title: 'Thank You!',
        type: 'success',
    })
}
</script>
