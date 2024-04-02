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
                    @click="cancel"
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
                    >proceed</v-btn
                >
            </v-toolbar>
            <router-view />
            <Notifications />
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
 * If the current route is checkout address and the proceed button is enabled, navigates to checkout shipment.
 * If the current route is checkout shipment and the proceed button is enabled, navigates to checkout payment.
 * If the current route is checkout payment and the proceed button is enabled, makes the order and navigates to the order summary.
 */
async function proceed(): Promise<void> {
    if (userHasArrivedAtCheckoutSummary.value) {
        return
    }

    var whereToPushTo: string | null = null
    if (route.name === routeNames.checkoutAddress) {
        if (!proceedButtonDisabled.value) {
            whereToPushTo = routeNames.checkoutShipment
        } else {
            return
        }
    } else if (route.name === routeNames.checkoutShipment) {
        if (!proceedButtonDisabled.value) {
            whereToPushTo = routeNames.checkoutPayment
        } else {
            return
        }
    } else if (route.name === routeNames.checkoutPayment) {
        if (!proceedButtonDisabled.value) {
            await createOrderAndNavigateToOrderSummary()
        }

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
 * @returns - A promise that resolves after the order is created and the navigation to the order summary page is completed.
 */
async function createOrderAndNavigateToOrderSummary(): Promise<void> {
    if (currentUserId.value == undefined) {
        return
    }
    const idOfCreatedOrder = await createOrder(order.value, currentUserId.value)
    router.push({
        name: routeNames.checkoutSummary,
        params: {
            orderId: idOfCreatedOrder,
        },
    })
}
</script>
