<template>
    <v-dialog
        v-if="activeUserRoleIsEitherAdminOrEmployee"
        height="auto"
        max-width="500"
        persistent
    >
        <v-card>
            <v-card-item>
                <v-card-title>Restock Product Items</v-card-title>
            </v-card-item>
            <v-card-text>
                <v-select
                    hint="Select the product variant that is to be restocked."
                    item-title="currentVersion.name"
                    item-value="id"
                    :items="productVariants"
                    label="Product Variant"
                    persistent-hint
                    variant="solo"
                    v-model="selectedProductVariantId"
                ></v-select>
            </v-card-text>
            <v-card-text>
                <v-divider class="my-4"></v-divider>
                <v-combobox
                    density="comfortable"
                    :items="amountOptions"
                    hint="Choose how many items to add to the inventory."
                    label="Amount"
                    persistent-hint
                    :rules="[
                        inputIsNotNull,
                        inputIsNaturalNumber,
                        inputIsSmallerThanMaximumBatchSize,
                    ]"
                    variant="solo"
                    v-model="amount"
                ></v-combobox>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :disabled="!canRestock"
                    prepend-icon="mdi-playlist-plus"
                    @click="restock()"
                >
                    restock
                </v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    prepend-icon="mdi-close"
                    @click="cancel()"
                    variant="tonal"
                    >cancel</v-btn
                >
                <v-btn
                    :disabled="!canRestock"
                    prepend-icon="mdi-playlist-plus"
                    @click="restockAndClose()"
                    variant="tonal"
                >
                    restock and close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import {
    pushErrorNotification,
    pushErrorNotificationIfNecessary,
} from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Props definition for the component.
 *
 * @property productId - The ID of the product.
 * @property [preselectedProductVariantId] - The ID of the preselected product variant.
 * @property [maximumBatchSize] - The maximum batch size allowed for restocking.
 */
const props = defineProps({
    productId: {
        type: String,
        required: true,
    },
    preselectedProductVariantId: {
        type: String,
    },
    maximumBatchSize: {
        type: Number,
        default: 100,
    },
})

/**
 * Emits definition for the component.
 *
 * Event: close - The dialog should be closed.
 * Event: restocked - The selected product variant was successfully restocked.
 */
const emit = defineEmits<{
    (event: 'close'): void
    (event: 'restocked'): void
}>()

/**
 * Reactive references and values from the Pinia store.
 */
const { activeUserRoleIsEitherAdminOrEmployee } = storeToRefs(useAppStore())

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * Async computed property to fetch the product from the catalog service.
 * Note that the returned object essentially only contains the product's variants.
 */
const getProductWithItsVariantsOnlyQuery = asyncComputed(
    async () => {
        if (activeUserRoleIsEitherAdminOrEmployee.value) {
            return client.getProductWithItsVariantsOnly({
                id: props.productId,
            })
        }

        return null
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductWithItsVariantsOnly,
                e
            ),
        shallow: false,
    }
)

/**
 * Computed property for extracting the product variants from the fetched product data.
 */
const productVariants = computed(() => {
    if (getProductWithItsVariantsOnlyQuery.value !== null) {
        return getProductWithItsVariantsOnlyQuery.value.product.variants.nodes
    }

    return []
})

/**
 * Computed property for generating an array of amount options based on the maximum batch size.
 */
const amountOptions = computed(() => {
    return Array.from({ length: props.maximumBatchSize }, (_, index) =>
        (index + 1).toString()
    )
})

/**
 * Helper function -- this is a rule -- to check if the input is not null.
 *
 * @param input - The input string to check.
 * @returns True if the input is not null; an error message otherwise.
 */
function inputIsNotNull(input: string): boolean | string {
    if (input !== null) {
        return true
    }

    return 'The amount must be specified.'
}

/**
 * Helper function -- this is a rule -- to check if the input is a natural number.
 *
 * @param input - The input string to check.
 * @returns True if the input is a natural number; an error message otherwise.
 */
function inputIsNaturalNumber(input: string): boolean | string {
    if (!inputIsNotNull(input)) {
        return false
    }

    if (/^\d+$/.test(input) && parseInt(input) > 0) {
        return true
    }

    return 'The input must be a natural number, e.g. 5.'
}

/**
 * Helper function to check if the input is smaller than the maximum batch size.
 *
 * @param input - The input string to check.
 * @returns True if the input is smaller than the maximum batch size; an error message otherwise.
 */
function inputIsSmallerThanMaximumBatchSize(input: string): boolean | string {
    if (!inputIsNaturalNumber(input)) {
        return false
    }

    if (props.maximumBatchSize === undefined) {
        return true
    }

    const number = parseInt(input)

    if (number <= props.maximumBatchSize && number > 0) {
        return true
    }

    return (
        'The amount may not exceed the specified maximum batch size of: ' +
        props.maximumBatchSize
    )
}

/**
 * Ref for the preselected product variant ID.
 */
const selectedProductVariantId = ref<string | undefined>(
    props.preselectedProductVariantId
)

/**
 * Ref for the amount input.
 */
const amount = ref<string | null>(null)

/**
 * Resets the view model to its initial state.
 */
function resetViewModel() {
    selectedProductVariantId.value = props.preselectedProductVariantId
    amount.value = null
}

/**
 * Resets the view model if necessary and emits the event that the dialog should be closed.
 */
function cancel() {
    resetViewModel()

    emit('close')
}

/**
 * Computed property indicating whether restocking can be requested.
 */
const canRestock = computed(() => {
    return (
        selectedProductVariantId.value !== undefined &&
        amount.value !== null &&
        inputIsNaturalNumber(amount.value) &&
        inputIsSmallerThanMaximumBatchSize(amount.value)
    )
})

/**
 * Requests the restocking of the selected product variant.
 */
async function restock() {
    if (activeUserRoleIsEitherAdminOrEmployee.value && canRestock) {
        await pushErrorNotificationIfNecessary(() => {
            return client.createProductItemBatch({
                input: {
                    productVariantId: selectedProductVariantId.value,
                    number: parseInt(amount.value as string),
                },
            })
        }, errorMessages.createProductItemBatch)

        emit('restocked')
    }
}

/**
 * Requests the restocking of the selected product variant and
 * cancels the dialog by calling cancel().
 */
async function restockAndClose() {
    await restock()

    cancel()
}
</script>
