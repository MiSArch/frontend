<template>
    <div class="d-flex flex-column pa-4">
        <v-radio-group
            label="Choose a payment method"
            v-model="selectedPaymentMethod"
        >
            <v-radio
                v-if="singleInvoicePaymentInformation"
                label="Invoice"
                :value="PaymentMethod.Invoice"
            ></v-radio>
            <v-radio
                v-if="singlePrepaymentPaymentInformation"
                label="Prepayment"
                :value="PaymentMethod.Prepayment"
            ></v-radio>
            <v-radio
                label="Credit Card"
                :value="PaymentMethod.CreditCard"
            ></v-radio>
        </v-radio-group>
        <SelectOrAddNewCreditCardCard
            v-show="selectedPaymentMethodIsCreditCard"
            v-model:credit-card="selectedCreditCard"
        />
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
const { orderInformation } = storeToRefs(store)

/**
 * The payment method selected by the user.
 */
const selectedPaymentMethod = ref<PaymentMethod | undefined>(
    orderInformation.value.paymentInformation?.paymentMethod
)

/**
 * Watches the selected payment method.
 */
watch(
    () => selectedPaymentMethod.value,
    () => onSelectedPaymentMethodChanged()
)

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
    orderInformation.value.paymentInformation?.paymentMethod ===
        PaymentMethod.CreditCard
        ? orderInformation.value.paymentInformation
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
        orderInformation.value.paymentInformation =
            singleInvoicePaymentInformation.value
    }
}

/**
 * Handles the event when the user selects the prepayment payment method:
 * Sets the payment information for the order if prepayment payment information is actually available.
 */
function onUserSelectedPrepayment(): void {
    if (singlePrepaymentPaymentInformation.value) {
        orderInformation.value.paymentInformation =
            singlePrepaymentPaymentInformation.value
    }
}

/**
 * Handles the event when the user selects the credit card payment method:
 * Sets the payment information for the order to the selected credit card.
 */
function onUserSelectedCreditCard(): void {
    orderInformation.value.paymentInformation = selectedCreditCard.value
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
