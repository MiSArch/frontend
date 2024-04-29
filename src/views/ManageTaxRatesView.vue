<template>
    <v-toolbar class="bg-grey-lighten-3" density="comfortable">
        <v-toolbar-title>Manage Tax Rates</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" @click="openAddTaxRateDialog">
            Add Tax Rate
        </v-btn>
        <AddTaxRateDialog
            v-model="addTaxRateDialogOpen"
            @close-addtaxratedialog="closeAddTaxRateDialog"
            @add-tax-rate="addTaxRate"
        />
    </v-toolbar>
    <v-list
        v-if="taxRates != undefined && taxRates.taxRates.totalCount > 0"
        class="mx-2"
        lines="three"
    >
        <v-list-item
            v-for="taxRate in taxRates.taxRates.nodes"
            :value="taxRate.id"
            @click="navigateToTaxRate(taxRate.id)"
        >
            <v-list-item-title>{{ taxRate.name }}</v-list-item-title>
            <v-list-item-subtitle>{{
                taxRate.description
            }}</v-list-item-subtitle>
        </v-list-item>
    </v-list>
</template>

<script lang="ts" setup>
import AddTaxRateDialog from '@/components/AddTaxRateDialog.vue'
import { CreateTaxRateInput } from '@/graphql/generated'
import { useClient } from '@/graphql/client'
import { errorMessages } from '@/strings/errorMessages'
import {
    pushErrorNotification,
    awaitActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { ref } from 'vue'
import router from '@/router'
import { routeNames } from '@/router/routeNames'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * This prop is used for triggering a reevaluation
 * of the async computed prop 'taxRates'.
 */
const trigger = ref(0)

/**
 * Triggers the async computed prop 'taxRates' to be reevaluated.
 */
function reevaluateTaxRates() {
    trigger.value++
}

/**
 * The tax rates.
 */
const taxRates = asyncComputed(
    async () => {
        trigger.value
        return await client.getTaxRatesWithCurrentVersion()
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getTaxRatesWithCurrentVersion,
                e
            ),
        shallow: false,
    }
)

/**
 * Whether or not the "ADD TAX RATE" dialog is open.
 */
const addTaxRateDialogOpen = ref(false)

/**
 * Opens the "ADD TAX RATE" dialog.
 */
function openAddTaxRateDialog() {
    addTaxRateDialogOpen.value = true
}

/**
 * Closes the "ADD TAX RATE" dialog.
 */
function closeAddTaxRateDialog() {
    addTaxRateDialogOpen.value = false
}

/**
 * Closes the 'ADD TAX RATE' dialog and
 * then tries to request the creation of a new tax rate
 * according to the given CreateTaxRateInput.
 * The tax rates will be reloaded if the new one is created.
 * @param input The tax rate to add.
 */
async function addTaxRate(input: CreateTaxRateInput) {
    closeAddTaxRateDialog()

    await awaitActionAndPushErrorIfNecessary(() => {
        return client.createTaxRate({
            input: input,
        })
    }, errorMessages.createTaxRate)

    reevaluateTaxRates()
}

/**
 * Navigates to the tax rate matching the given ID.
 * @param taxRateId The ID of the tax rate to navigate to.
 */
function navigateToTaxRate(taxRateId: any) {
    router.push({
        name: routeNames.taxRate,
        params: {
            taxrateid: taxRateId,
        },
    })
}
</script>
