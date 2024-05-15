<template>
    <v-app>
        <TheAppBar />
        <v-main>
            <v-toolbar>
                <v-btn
                    :disabled="backButtonIsDisabled"
                    icon="mdi-arrow-left"
                    @click="back"
                ></v-btn>
                <v-breadcrumbs :items="checkoutStages" />
                <v-spacer></v-spacer>
                <v-btn
                    :disabled="userCannotCancel"
                    prepend-icon="mdi-close"
                    @click="onUserWantsToCancel"
                    >cancel</v-btn
                >
                <v-btn
                    :disabled="backButtonIsDisabled"
                    prepend-icon="mdi-arrow-left"
                    @click="back"
                    >back</v-btn
                >
                <v-btn
                    v-if="!proceedButtonIsInvisible"
                    :disabled="proceedButtonDisabled"
                    prepend-icon="mdi-arrow-right"
                    @click="proceed"
                    >{{
                        route.name === routeNames.checkoutPayment
                            ? 'create order'
                            : 'proceed'
                    }}</v-btn
                >
            </v-toolbar>
            <router-view class="pa-4" />
            <ConfirmOrCancelDialog
                v-model="dialogToConfirmCancelationIsOpen"
                message="Click confirm to cancel the checkout."
                @canceled="closeDialogToConfirmCancelation"
                @confirmed="onUserConfirmedCancellation"
            />
            <Notifications />
            <v-overlay
                class="d-flex align-center justify-center"
                v-model="isAwaitingOrderCreation"
                persistent
            >
                <v-progress-circular
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-overlay>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import TheAppBar from '../default/TheAppBar.vue'
import Notifications from '@/components/Notifications.vue'
import { routeNames } from '@/router/routeNames'
import { useAppStore } from '@/store/app'
import { createOrder } from '@/store/orderManagement'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmOrCancelDialog from '@/components/ConfirmOrCancelDialog.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const {
    addressInformationIsComplete,
    currentUserId,
    order,
    paymentInformationIsComplete,
    shipmentInformationIsComplete,
} = storeToRefs(store)

/**
 * Whether this component is awaiting the order service's creation of the order right now.
 */
const isAwaitingOrderCreation = ref(false)

/**
 * Whether the user has arrived at the checkout summary page.
 */
const userHasArrivedAtCheckoutSummary = computed(() => {
    return route.name === routeNames.checkoutSummary
})

/**
 * Whether the user cannot cancel the checkout process.
 */
const userCannotCancel = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

/**
 * Whether the back button is disabled.
 */
const backButtonIsDisabled = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

/**
 * Whether the proceed button is invisible.
 */
const proceedButtonIsInvisible = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

/**
 * Whether the stage for the address information is disabled.
 */
const addressStageIsDisabled = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

/**
 * Whether the stage for the shipment information is disabled.
 */
const shipmentStageIsDisabled = computed(() => {
    return (
        userHasArrivedAtCheckoutSummary.value ||
        !addressInformationIsComplete.value
    )
})

/**
 * Whether the stage for the payment information is disabled.
 */
const paymentStageIsDisabled = computed(() => {
    return (
        userHasArrivedAtCheckoutSummary.value ||
        !addressInformationIsComplete.value ||
        !shipmentInformationIsComplete.value
    )
})

/**
 * The stages (or steps) of the checkout process for the v-breadcrumbs component.
 */
const checkoutStages = ref([
    {
        title: 'Address',
        disabled: addressStageIsDisabled,
        to: {
            name: routeNames.checkoutAddress,
        },
    },
    {
        title: 'Shipment',
        disabled: shipmentStageIsDisabled,
        to: {
            name: routeNames.checkoutShipment,
        },
    },
    {
        title: 'Payment',
        disabled: paymentStageIsDisabled,
        to: {
            name: routeNames.checkoutPayment,
        },
    },
])

/**
 * Whether the proceed button is disabled.
 */
const proceedButtonDisabled = computed(() => {
    if (route.name === routeNames.checkoutAddress) {
        return shipmentStageIsDisabled.value
    } else if (route.name === routeNames.checkoutShipment) {
        return paymentStageIsDisabled.value
    } else if (route.name === routeNames.checkoutPayment) {
        return !paymentInformationIsComplete.value
    } else {
        return userHasArrivedAtCheckoutSummary.value
    }
})

/**
 * Navigates back to the previous page using the router.
 */
function back(): void {
    router.back()
}

/**
 * Whether the dialog that lets the user confirm (or cancel)
 * the cancelation of the checkout is open or not.
 */
const dialogToConfirmCancelationIsOpen = ref(false)

/**
 * Opens the the dialog that lets the user confirm (or cancel)
 * the cancelation of the checkout.
 */
function openDialogToConfirmCancelation(): void {
    dialogToConfirmCancelationIsOpen.value = true
}

/**
 * Closes the the dialog that lets the user confirm (or cancel)
 * the cancelation of the checkout.
 */
function closeDialogToConfirmCancelation(): void {
    dialogToConfirmCancelationIsOpen.value = false
}

/**
 * Closes the the dialog that lets the user confirm (or cancel)
 * the cancelation of the checkout and
 * initiates the cancellation of the checkout.
 */
function onUserConfirmedCancellation(): void {
    closeDialogToConfirmCancelation()
    cancel()
}

/**
 * Opens the the dialog that lets the user confirm (or cancel)
 * the cancelation of the checkout if the user has not arrived at
 * the checkout summary. If the user has actually already arrived at
 * the checkout summary, the function simply initiates the cancellation of the checkout.
 */
function onUserWantsToCancel(): void {
    if (userHasArrivedAtCheckoutSummary.value) {
        cancel()
    } else {
        openDialogToConfirmCancelation()
    }
}

/**
 * Navigates to the shopping cart page using the router and resets the order information.
 */
function cancel(): void {
    router.push({
        name: routeNames.shoppingCart,
    })
    store.resetOrderToUndefined()
}

/**
 * Proceeds to the next step in the checkout process based on the current route and button state.
 * If the user has already arrived at the checkout summary, the function does nothing.
 * If the proceed button is disabled, the function does nothing.
 * If the current route is checkout address, navigates to checkout shipment.
 * If the current route is checkout shipment, navigates to checkout payment.
 * If the current route is checkout payment,
 * requests the creation of the order and navigates to the order summary.
 */
async function proceed(): Promise<void> {
    if (userHasArrivedAtCheckoutSummary.value || proceedButtonDisabled.value) {
        return
    }

    var whereToPushTo: string | null = null
    if (route.name === routeNames.checkoutAddress) {
        whereToPushTo = routeNames.checkoutShipment
    } else if (route.name === routeNames.checkoutShipment) {
        whereToPushTo = routeNames.checkoutPayment
    } else if (route.name === routeNames.checkoutPayment) {
        await createOrderAndNavigateToOrderSummary()

        return
    }

    if (whereToPushTo) {
        router.push({
            name: whereToPushTo,
        })
    }
}

/**
 * Creates an order based on the current order details and user ID, then navigates to the order summary page.
 * Additionally "clears" or resets the order information of the app store to undefined.
 * @returns - A promise that resolves after the order is created and the navigation to the order summary page is completed.
 */
async function createOrderAndNavigateToOrderSummary(): Promise<void> {
    if (currentUserId.value == undefined) {
        return
    }
    isAwaitingOrderCreation.value = true
    try {
        var idOfCreatedOrder = await createOrder(
            order.value,
            currentUserId.value
        )
    } catch (error) {
        throw error
    } finally {
        isAwaitingOrderCreation.value = false
    }
    store.resetOrderToUndefined()
    router.push({
        name: routeNames.checkoutSummary,
        params: {
            orderId: idOfCreatedOrder,
        },
    })
}
</script>
