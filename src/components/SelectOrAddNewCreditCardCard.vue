<template>
    <v-card>
        <v-card-item>
            <v-card-title class="text-capitalize">credit card</v-card-title>
            <v-card-subtitle class="text-capitalize"
                >chosen payment method</v-card-subtitle
            >
        </v-card-item>
        <v-card-text v-if="selectedCreditCard" class="text-body-2">
            {{ selectedCreditCard?.publicMethodDetails }}<br />
            {{ selectedCreditCard?.secretMethodDetails }}<br />
        </v-card-text>
        <v-card-text>
            <v-select
                clearable
                hint="Select one of your previously saved credit cards."
                item-title="publicMethodDetails"
                item-value="id"
                :items="creditCards"
                label="Credit Card"
                :persistent-hint="!selectedCreditCard"
                return-object
                v-model="selectedCreditCard"
            ></v-select>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                prepend-icon="mdi-home-plus"
                @click="userWantsToAddNewCreditCard"
                >use different credit card</v-btn
            >
        </v-card-actions>
        <v-expand-transition>
            <div v-show="showExpansion">
                <v-divider></v-divider>
                <v-card-text>Enter your credit card information.</v-card-text>
                <v-card-text>
                    <v-form v-model="newCreditCardIsValid">
                        <v-container>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="owner"
                                        prepend-icon="mdi-account"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="creditCardHolder"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="number"
                                        prepend-icon="mdi-credit-card"
                                        required
                                        :rules="[
                                            inputIsRequired,
                                            isValidCreditCardNumber,
                                        ]"
                                        type="input"
                                        variant="underlined"
                                        v-model="creditCardNumber"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="expiration date"
                                        prepend-icon="mdi-timer-sand-complete"
                                        required
                                        :rules="[
                                            inputIsRequired,
                                            isValidCreditCardExpirationDate,
                                        ]"
                                        type="input"
                                        variant="underlined"
                                        v-model="creditCardExpirationDate"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :disabled="!newCreditCardIsValid"
                        prepend-icon="mdi-content-save"
                        @click="saveCreditCard"
                        >save credit card</v-btn
                    >
                </v-card-actions>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import {
    CreateCreditCardInformationInput,
    CreateCreditCardPaymentInformationMutation,
} from '@/graphql/generated'
import { getPaymentInformationOfCurrentUser } from '@/graphql/user'
import { PaymentInformationImpl } from '@/model/classes/PaymentInformationImpl'
import { PaymentMethod } from '@/model/enums/paymentMethod'
import { PaymentInformation } from '@/model/interfaces/PaymentInformation'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import { awaitActionAndPushErrorIfNecessary } from '@/util/errorHandler'
import {
    inputIsRequired,
    isValidCreditCardNumber,
    isValidCreditCardExpirationDate,
} from '@/util/rules'
import { asyncComputed } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps({
    creditCard: {
        type: [PaymentInformationImpl],
        validator(value: PaymentInformationImpl) {
            return value.paymentMethod === PaymentMethod.CreditCard
        },
    },
})

/**
 * Watches the creditCard prop for changes.
 * Calls the event handler if changes are detected.
 */
watch(
    () => props.creditCard,
    () => onCreditCardChanged()
)

/**
 * The emits of this component:
 * update:creditCard -- Says that the v-model:creditCard has been updated.
 * newCreditCardSaved -- Says that a new credit card has been saved for the current user.
 */
const emits = defineEmits(['update:creditCard', 'newCreditCardSaved'])

const store = useAppStore()

const client = useClient()

/**
 * The credit card selected by the user.
 */
const selectedCreditCard = ref<PaymentInformation | undefined>(props.creditCard)

/**
 * Watches the selectedCreditCard ref:
 * Calls the event handler if the ref's value changes.
 */
watch(
    () => selectedCreditCard.value,
    () => onSelectedCreditCardChanged()
)

/**
 * The ID of the credit card that has been selected by the user.
 */
const idOfSelectedCreditCard = ref<string | undefined>(props.creditCard?.id)

/**
 * A trigger for reevaluating the ref getCreditCardsQuery.
 */
const triggerForQueryingOfCreditCards = ref<number>(0)

/**
 * The query for the credit cards of the current user.
 */
const getCreditCardsQuery = asyncComputed(
    async () => {
        triggerForQueryingOfCreditCards.value
        return await getPaymentInformationOfCurrentUser(
            PaymentMethod.CreditCard
        )
    },
    null,
    {
        shallow: false,
    }
)

/**
 * Watches the value of the getCreditCardsQuery ref:
 * Calls the event handler if the ref's value changes.
 */
watch(
    () => getCreditCardsQuery.value,
    () => onGetCreditCardsQueryChanged()
)

/**
 * The credit cards of the current user.
 */
const creditCards = computed(() => {
    const nodes =
        getCreditCardsQuery.value?.currentUser?.paymentInformations?.nodes
    if (!nodes) {
        return
    }

    return nodes.map(
        (paymentInformation) =>
            new PaymentInformationImpl(
                paymentInformation.id,
                PaymentMethod.CreditCard,
                paymentInformation.publicMethodDetails
            )
    )
})

/**
 * Whether the expansion for adding a new credit card is shown.
 */
const showExpansion = ref<boolean>(false)

/**
 * The name of the owner (holder) of the credit card that is to be added.
 */
const creditCardHolder = ref<string | null | undefined>(null)

/**
 * The number of the credit card that is to be added.
 */
const creditCardNumber = ref<string | null | undefined>(null)

/**
 * The expiration date of the credit card that is to be added.
 */
const creditCardExpirationDate = ref<string | null | undefined>(null)

/**
 * Whether the new credit card is valid.
 */
const newCreditCardIsValid = ref<boolean | null | undefined>(null)

/**
 * Whether the new credit card is not valid.
 */
const newCreditCardIsNotValid = computed(() => {
    return (
        newCreditCardIsValid.value == undefined ||
        newCreditCardIsValid.value === false
    )
})

/**
 * Resets the selected credit card to undefined and shows the expansion.
 */
function userWantsToAddNewCreditCard(): void {
    selectedCreditCard.value = undefined
    showExpansion.value = true
}

/**
 * Asynchronously saves the credit card information if it is valid.
 * If the credit card is not valid or if any required input is missing, the function returns without saving.
 * @returns - A promise that resolves after the credit card information is saved or rejects if an error occurs.
 */
async function saveCreditCard(): Promise<void> {
    if (newCreditCardIsNotValid.value) {
        return
    }

    if (
        creditCardHolder.value == undefined ||
        creditCardNumber.value == undefined ||
        creditCardExpirationDate.value == undefined
    ) {
        return
    }

    const input: CreateCreditCardInformationInput = {
        cardHolder: creditCardHolder.value,
        cardNumber: creditCardNumber.value,
        expirationDate: creditCardExpirationDate.value,
    }

    const response: CreateCreditCardPaymentInformationMutation =
        await awaitActionAndPushErrorIfNecessary(() => {
            return client.createCreditCardPaymentInformation({
                input: input,
            })
        }, errorMessages.createCreditCardPaymentInformation)

    store.pushNotification({
        text: 'The credit card was saved.',
        title: 'Credit Card Saved',
        type: 'success',
    })
    emits('newCreditCardSaved')
    idOfSelectedCreditCard.value =
        response.createCreditCardPaymentInformation.id
    queryCreditCardsOnceAgain()
    clearInputForm()
}

/**
 * Triggers querying of credit cards once again:
 * Increments the internal trigger count for querying of credit cards.
 */
function queryCreditCardsOnceAgain(): void {
    triggerForQueryingOfCreditCards.value++
}

/**
 * Clears the input fields of the form.
 */
function clearInputForm(): void {
    creditCardHolder.value = null
    creditCardNumber.value = null
    creditCardExpirationDate.value = null
}

/**
 * Applies the value of the creditCard prop to the refs selectedCreditCard and idOfSelectedCreditCard.
 */
function onCreditCardChanged(): void {
    selectedCreditCard.value = props.creditCard
    idOfSelectedCreditCard.value = props.creditCard?.id
}

/**
 * Emits the update event for the creditCard prop and closes the expansion if a credit card has been selected.
 */
function onSelectedCreditCardChanged(): void {
    emits('update:creditCard', selectedCreditCard.value)

    if (selectedCreditCard.value) {
        showExpansion.value = false
    }
}

/**
 * If the idOfSelectedCreditCard ref is different from the selected credit card, triggers selection of that credit card.
 */
function onGetCreditCardsQueryChanged(): void {
    if (
        idOfSelectedCreditCard.value &&
        idOfSelectedCreditCard.value !== selectedCreditCard.value?.id
    ) {
        selectCreditCard(idOfSelectedCreditCard.value)
    }
}

/**
 * Selects a credit card by its ID.
 * @param id - The ID of the credit card to select.
 */
function selectCreditCard(id: string): void {
    if (typeof id !== 'string') {
        return
    }
    const foundCreditCard =
        creditCards.value?.find((creditCard) => creditCard.id === id) ??
        undefined
    console.log(foundCreditCard)
    selectedCreditCard.value = foundCreditCard
}
</script>
