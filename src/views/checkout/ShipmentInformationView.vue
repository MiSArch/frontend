<template>
    <div class="d-flex flex-column pa-4">
        <v-radio-group
            label="Choose a shipment method"
            v-model="selectedShipmentMethod"
        >
            <v-radio
                v-for="shipmentMethod in shipmentMethods"
                :key="shipmentMethod.id"
                :label="shipmentMethod.name"
                :value="shipmentMethod"
            ></v-radio>
        </v-radio-group>
        <v-card v-if="selectedShipmentMethod" class="align-self-start w-25">
            <v-card-item prepend-icon="mdi-truck">
                <v-card-title class="text-capitalize"
                    >chosen shipment method</v-card-title
                >
            </v-card-item>
            <v-card-item>
                <v-card-title>{{ selectedShipmentMethod.name }}</v-card-title>
            </v-card-item>
            <v-card-text v-if="selectedShipmentMethod.description.length > 0">{{
                selectedShipmentMethod.description
            }}</v-card-text>
            <v-card-text>
                <v-container class="text-capitalize">
                    <v-row align="start" dense>
                        <v-col>base fees:</v-col>
                        <v-col>{{ selectedShipmentMethod.baseFees }}</v-col>
                    </v-row>
                    <v-row align="start" dense>
                        <v-col>fees per item:</v-col>
                        <v-col>{{ selectedShipmentMethod.feesPerItem }}</v-col>
                    </v-row>
                    <v-row align="start" dense>
                        <v-col>fees per kg:</v-col>
                        <v-col>{{ selectedShipmentMethod.feesPerKg }}</v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import { ShipmentMethodImpl } from '@/model/classes/ShipmentMethodImpl'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import { pushErrorNotification } from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const store = useAppStore()
const { orderInformation } = storeToRefs(store)

/**
 * The shipment method selected by the user.
 */
const selectedShipmentMethod = ref<ShipmentMethodImpl | undefined>(
    orderInformation.value.shipmentMethod
)

/**
 * Watches the shipment method selected by the user and
 * updates the order information if the selection changes.
 */
watch(
    () => selectedShipmentMethod.value,
    () => (orderInformation.value.shipmentMethod = selectedShipmentMethod.value)
)

/**
 * The query that gets the shipment methods that are available to the user.
 */
const getShipmentMethodsQuery = asyncComputed(
    async () => {
        return await useClient().getShipmentMethods()
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(errorMessages.getShipmentMethods, e),
        shallow: false,
    }
)

/**
 * The shipment methods that are available to the user taken from the corresponding query.
 */
const shipmentMethods = computed(() => {
    if (!getShipmentMethodsQuery.value) {
        return
    }

    const nodes = getShipmentMethodsQuery.value.shipmentMethods.nodes
    if (!nodes) {
        return
    }

    const shipmentMethods = nodes.map(
        (shipmentMethod) =>
            new ShipmentMethodImpl(
                shipmentMethod.id,
                shipmentMethod.name,
                shipmentMethod.baseFees,
                shipmentMethod.feesPerItem,
                shipmentMethod.feesPerKg,
                shipmentMethod.description
            )
    )

    if (shipmentMethods.length === 1) {
        selectedShipmentMethod.value = shipmentMethods.at(0)
    }

    return shipmentMethods
})
</script>
