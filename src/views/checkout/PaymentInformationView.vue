<template>
    <div class="d-flex justify-center">
        <div class="d-flex flex-column w-75 ga-4">
            <div class="text-h5">Total: {{ total }} EUR</div>
            <v-radio-group
                label="Choose a payment method"
                v-model="selectedPaymentMethod"
            >
                <v-radio
                    v-if="singleInvoicePaymentInformation"
                    class="text-capitalize"
                    :label="PaymentMethod.Invoice"
                    :value="PaymentMethod.Invoice"
                ></v-radio>
                <v-radio
                    v-if="singlePrepaymentPaymentInformation"
                    class="text-capitalize"
                    :label="PaymentMethod.Prepayment"
                    :value="PaymentMethod.Prepayment"
                ></v-radio>
                <v-radio
                    class="text-capitalize"
                    :label="PaymentMethod.CreditCard"
                    :value="PaymentMethod.CreditCard"
                ></v-radio>
            </v-radio-group>
            <div
                v-if="selectedPaymentMethod != undefined"
                class="d-flex flex-column w-50 ga-2 mb-4"
            >
                <div class="text-body-2">
                    What the chosen payment method implies:
                </div>
                <div class="text-body-1">
                    {{ paymentMethodDescription.get(selectedPaymentMethod) }}
                </div>
            </div>
            <SelectOrAddNewCreditCardCard
                v-show="selectedPaymentMethodIsCreditCard"
                v-model:credit-card="selectedCreditCard"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import SelectOrAddNewCreditCardCard from '@/components/SelectOrAddNewCreditCardCard.vue'
import { getPaymentInformationOfCurrentUser } from '@/graphql/user'
import { PaymentInformationImpl } from '@/model/classes/PaymentInformationImpl'
import { PaymentMethod } from '@/model/enums/paymentMethod'
import { useAppStore } from '@/store/app'
import { computed } from '@vue/reactivity'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const store = useAppStore()
const { order } = storeToRefs(store)

/**
 * The total value of the order -- what the user would have to pay.
 */
const total = computed(() => {
    return order.value.calculateTotalCost()
})

/**
 * The payment method selected by the user.
 */
const selectedPaymentMethod = ref<PaymentMethod | undefined>(
    order.value.paymentInformation?.paymentMethod
)

/**
 * Watches the selected payment method.
 */
watch(
    () => selectedPaymentMethod.value,
    () => onSelectedPaymentMethodChanged()
)

/**
 * Map containing descriptions for each order status.
 */
const paymentMethodDescription = new Map<PaymentMethod, string>([
    [
        PaymentMethod.Invoice,
        'Receive now, pay later. With an invoice, you can get your item before paying, with the flexibility to settle the bill within a specified timeframe after delivery.',
    ],
    [
        PaymentMethod.Prepayment,
        'Pay upfront for peace of mind. With prepayment, you settle the bill before your items are shipped, ensuring a smooth transaction without any payment concerns upon delivery.',
    ],
    [
        PaymentMethod.CreditCard,
        "Instant convenience with your card. When you choose credit card payment, you can buy your item right away, and the amount is charged to your card. It's a quick and hassle-free way to shop online.",
    ],
])

/**
 * Whether the selected payment method is a credit card.
 */
const selectedPaymentMethodIsCreditCard = computed(() => {
    return selectedPaymentMethod.value === PaymentMethod.CreditCard
})

/**
 * Query for the invoice payment information of the current user.
 */
const getInvoicePaymentInformationQuery = asyncComputed(
    async () => {
        return await getPaymentInformationOfCurrentUser(PaymentMethod.Invoice)
    },
    null,
    {
        shallow: false,
    }
)

/**
 * The single (first) payment information entity for the payment method invoice
 * taken from the corresponding query.
 */
const singleInvoicePaymentInformation = computed(() => {
    const firstInvoicePaymentInformation =
        getInvoicePaymentInformationQuery.value?.currentUser?.paymentInformations?.nodes?.at(
            0
        )
    if (firstInvoicePaymentInformation) {
        return new PaymentInformationImpl(
            firstInvoicePaymentInformation.id,
            PaymentMethod.Invoice,
            firstInvoicePaymentInformation.publicMethodDetails
        )
    }
})

/**
 * Query for the prepayment payment information of the current user.
 */
const getPrepaymentPaymentInformationQuery = asyncComputed(
    async () => {
        return await getPaymentInformationOfCurrentUser(
            PaymentMethod.Prepayment
        )
    },
    null,
    {
        shallow: false,
    }
)

/**
 * The single (first) payment information entity for the payment method prepayment
 * taken from the corresponding query.
 */
const singlePrepaymentPaymentInformation = computed(() => {
    const firstPrepaymentPaymentInformation =
        getPrepaymentPaymentInformationQuery.value?.currentUser?.paymentInformations?.nodes?.at(
            0
        )
    if (firstPrepaymentPaymentInformation) {
        return new PaymentInformationImpl(
            firstPrepaymentPaymentInformation.id,
            PaymentMethod.Prepayment,
            firstPrepaymentPaymentInformation.publicMethodDetails
        )
    }
})

/**
 * The credit card selected by the user.
 */
const selectedCreditCard = ref(
    order.value.paymentInformation?.paymentMethod === PaymentMethod.CreditCard
        ? order.value.paymentInformation
        : undefined
)

/**
 * Watches the selected credit card.
 */
watch(
    () => selectedCreditCard.value,
    () => onSelectedCreditCardChanged()
)

/**
 * Handles the event when the selected payment method is changed.
 * Calls appropriate functions based on the selected payment method.
 * @returns {void} - This function does not return a value.
 */
function onSelectedPaymentMethodChanged() {
    switch (selectedPaymentMethod.value) {
        case PaymentMethod.Invoice:
            onUserSelectedInvoice()
            break
        case PaymentMethod.Prepayment:
            onUserSelectedPrepayment()
            break
        case PaymentMethod.CreditCard:
            onUserSelectedCreditCard()
            break
        default:
            break
    }
}

/**
 * Handles the event when the user selects the invoice payment method:
 * Sets the payment information for the order if invoice payment information is actually available.
 */
function onUserSelectedInvoice(): void {
    if (singleInvoicePaymentInformation.value) {
        order.value.paymentInformation = singleInvoicePaymentInformation.value
    }
}

/**
 * Handles the event when the user selects the prepayment payment method:
 * Sets the payment information for the order if prepayment payment information is actually available.
 */
function onUserSelectedPrepayment(): void {
    if (singlePrepaymentPaymentInformation.value) {
        order.value.paymentInformation =
            singlePrepaymentPaymentInformation.value
    }
}

/**
 * Handles the event when the user selects the credit card payment method:
 * Sets the payment information for the order to the selected credit card.
 */
function onUserSelectedCreditCard(): void {
    order.value.paymentInformation = selectedCreditCard.value
}

/**
 * Handles the event when the selection of the credit card changes:
 * Calls the function onUserSelectedCreditCard() if the selected payment method is actually credit card.
 */
function onSelectedCreditCardChanged(): void {
    if (selectedPaymentMethodIsCreditCard.value) {
        onUserSelectedCreditCard()
    }
}
</script>
