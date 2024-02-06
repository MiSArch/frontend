<template>
    <div class="d-flex flex-column ga-4">
        <div>
            <v-toolbar class="bg-grey-lighten-3" density="comfortable">
                <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    prepend-icon="mdi-plus"
                    @click="openAddTaxRateVersionDialog"
                >
                    Add Tax Rate Version
                </v-btn>
                <AddTaxRateVersionDialog
                    :tax-rate-id="taxRate?.taxRate.id"
                    v-model="addTaxRateVersionDialogOpen"
                    @close-addtaxrateversiondialog="
                        closeAddTaxRateVersionDialog
                    "
                    @add-tax-rate-version="addTaxRateVersion"
                />
            </v-toolbar>
            <v-card class="bg-grey-lighten-3" rounded="0" variant="flat">
                <v-card-item>
                    <v-card-title class="mr-1">
                        Tax Rate: {{ taxRate?.taxRate.name }}
                    </v-card-title>

                    <v-card-subtitle
                        >ID: {{ taxRate?.taxRate.id }}</v-card-subtitle
                    >
                </v-card-item>
                <v-card-text>
                    Number of versions:
                    {{ taxRate?.taxRate.versions.totalCount }}
                </v-card-text>
            </v-card>
            <v-card class="bg-grey-lighten-4" rounded="0" variant="flat">
                <v-card-item>
                    <v-card-title
                        >Current Version:
                        {{
                            taxRate?.taxRate.currentVersion.version
                        }}</v-card-title
                    >
                    <v-card-subtitle
                        >ID:
                        {{
                            taxRate?.taxRate.currentVersion.id
                        }}</v-card-subtitle
                    >
                </v-card-item>
                <v-card-text>
                    <div v-if="taxRate?.taxRate.currentVersion.createdAt">
                        Created
                        <RelativeTime
                            :time="taxRate?.taxRate.currentVersion.createdAt"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <div class="d-flex flex-column ga-4">
            <div class="d-flex mx-4 ga-4">
                <v-card class="align-self-start" elevation="4">
                    <v-card-item>
                        <v-card-title
                            >Current Rate:
                            {{
                                taxRate?.taxRate.currentVersion.rate
                            }}</v-card-title
                        >
                    </v-card-item>
                    <v-divider></v-divider>
                    <v-card-item>
                        <v-card-title>Description</v-card-title>
                    </v-card-item>
                    <v-card-text>{{
                        taxRate?.taxRate.description
                    }}</v-card-text>
                </v-card>
            </div>
            <v-card
                v-if="taxRateVersions && taxRateVersions.length > 0"
                class="mx-4 mb-4"
                elevation="4"
            >
                <v-card-item>
                    <v-card-title> Version History </v-card-title>
                </v-card-item>
                <v-card-text>
                    <v-list density="comfortable" lines="two">
                        <v-list-item v-for="taxRateVersion in taxRateVersions">
                            <v-list-item-title
                                >Version
                                {{ taxRateVersion.version }}</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Rate:
                                {{ taxRateVersion.rate }}</v-list-item-subtitle
                            >
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import AddTaxRateVersionDialog from '@/components/AddTaxRateVersionDialog.vue'
import RelativeTime from '@/components/RelativeTime.vue'
import { useClient } from '@/graphql/client'
import {
    CreateTaxRateVersionInput,
    OrderDirection,
    TaxRateVersionOrderField,
} from '@/graphql/generated'
import { asyncComputed } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The current route (location).
 */
const route = useRoute()

/**
 * The router.
 */
const router = useRouter()

/**
 * The tax rate id (taken from the route params).
 */
const id = computed(() => {
    return route.params.taxrateid.toString()
})

/**
 * This prop is used for triggering a reevaluation
 * of the async computed prop 'taxRate'.
 */
const trigger = ref(0)

/**
 * Triggers the async computed prop 'taxRates' to be reevaluated.
 */
function reevaluateTaxRate() {
    trigger.value++
}

/**
 * The tax rate.
 */
const taxRate = asyncComputed(
    async () => {
        trigger.value
        return client.getTaxRate({
            id: id.value,
            orderByVersions: {
                direction: OrderDirection.Asc,
                field: TaxRateVersionOrderField.Version,
            },
        })
    },
    null,
    { shallow: false }
)

/**
 * The tax rate versions.
 * These are listed in the section 'Version History'.
 */
const taxRateVersions = computed(() => {
    if (taxRate.value?.taxRate.versions.totalCount) {
        return taxRate.value.taxRate.versions.nodes
    } else {
        return []
    }
})

/**
 * Whether or not the "ADD TAX RATE VERSION" dialog is open.
 */
const addTaxRateVersionDialogOpen = ref(false)

/**
 * Opens the "ADD TAX RATE VERSION" dialog.
 */
function openAddTaxRateVersionDialog() {
    addTaxRateVersionDialogOpen.value = true
}

/**
 * Closes the "ADD TAX RATE VERSION" dialog.
 */
function closeAddTaxRateVersionDialog() {
    addTaxRateVersionDialogOpen.value = false
}

/**
 * Whether or not adding a new tax rate version failed.
 */
const addingTaxRateVersionFailed = ref(false)

/**
 * Closes the 'ADD TAX RATE VERSION' dialog and
 * then tries to request the creation of a new tax rate version
 * according to the given CreateTaxRateVersionInput.
 * The tax rate will be reloaded if the new version is created.
 * @param input The tax rate to add.
 */
async function addTaxRateVersion(input: CreateTaxRateVersionInput) {
    closeAddTaxRateVersionDialog()

    addingTaxRateVersionFailed.value = false
    try {
        await client.createTaxRateVersion({
            input: input,
        })

        reevaluateTaxRate()
    } catch (error) {
        addingTaxRateVersionFailed.value = true

        console.error(error)
    }
}
</script>
