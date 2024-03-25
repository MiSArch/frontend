<template>
    <v-app>
        <TheAppBar />
        <v-main>
            <v-toolbar>
                <v-btn
                    :disabled="backButtonDisabled"
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
                    :disabled="backButtonDisabled"
                    prepend-icon="mdi-arrow-left"
                    @click="back"
                    >back</v-btn
                >
                <v-btn
                    v-if="!proceedButtonInvisible"
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
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useAppStore()
const { orderInformation } = storeToRefs(store)

const addressInformationComplete = computed(() => {
    return (
        orderInformation.value.billingAddress != undefined &&
        orderInformation.value.deliveryAddress != undefined
    )
})

const paymentInformationComplete = computed(() => {
    return true
})

const userHasArrivedAtCheckoutSummary = computed(() => {
    return route.name === routeNames.checkoutSummary
})

const userCannotCancel = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

const backButtonDisabled = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

const proceedButtonDisabled = computed(() => {
    if (route.name === routeNames.checkoutAddress) {
        return !addressInformationComplete.value
    } else if (route.name === routeNames.checkoutPayment) {
        return !paymentInformationComplete.value
    } else {
        return userHasArrivedAtCheckoutSummary.value
    }
})

const proceedButtonInvisible = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

const checkoutAddressDisabled = computed(() => {
    return userHasArrivedAtCheckoutSummary.value
})

const checkoutPaymentDisabled = computed(() => {
    return (
        userHasArrivedAtCheckoutSummary.value ||
        !addressInformationComplete.value
    )
})

const checkoutSummaryDisabled = computed(() => {
    return !userHasArrivedAtCheckoutSummary.value
})

const checkoutStages = ref([
    {
        title: 'Address',
        disabled: checkoutAddressDisabled,
        to: {
            name: routeNames.checkoutAddress,
        },
    },
    {
        title: 'Payment',
        disabled: checkoutPaymentDisabled,
        to: {
            name: routeNames.checkoutPayment,
        },
    },
    {
        title: 'Summary',
        disabled: checkoutSummaryDisabled,
        to: {
            name: routeNames.checkoutSummary,
        },
    },
])

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
    store.resetOrderInformationToUndefined()
}

/**
 * Proceeds to the next step of the checkout process if conditions are met.
 * If the user has arrived at the checkout summary, returns early.
 * If the user is at the checkout address step and the address information is complete, proceeds to the checkout payment step.
 * If the user is at the checkout payment step and the payment information is complete, proceeds to the checkout summary step.
 */
function proceed(): void {
    if (userHasArrivedAtCheckoutSummary.value) {
        return
    }

    var whereToPushTo: string | null = null
    if (route.name === routeNames.checkoutAddress) {
        if (addressInformationComplete.value) {
            whereToPushTo = routeNames.checkoutPayment
        } else {
            return
        }
    } else if (route.name === routeNames.checkoutPayment) {
        if (paymentInformationComplete.value) {
            // TODO: Make the order

            whereToPushTo = routeNames.checkoutSummary
        } else {
            return
        }
    }

    if (whereToPushTo != undefined) {
        router.push({
            name: whereToPushTo,
        })
    }
}
</script>
