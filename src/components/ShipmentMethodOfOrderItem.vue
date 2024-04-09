<template>
    <div class="d-flex flex-column">
        <v-radio-group
            v-if="!readonly"
            class="mb-2"
            density="compact"
            :label="
                shipmentMethods
                    ? 'Choose a Shipment Method'
                    : 'No Shipment Method available'
            "
            v-model="selectedShipmentMethod"
        >
            <v-radio
                v-for="shipmentMethod in shipmentMethods"
                :key="shipmentMethod.id"
                :label="shipmentMethod.name"
                :value="shipmentMethod"
            ></v-radio>
        </v-radio-group>
        <v-card
            v-if="selectedShipmentMethod"
            class="ml-4 w-25"
            density="compact"
            elevation="4"
        >
            <v-card-item prepend-icon="mdi-truck">
                <v-card-title class="text-capitalize">{{
                    selectedShipmentMethod.name
                }}</v-card-title>
            </v-card-item>
            <v-card-item>
                <v-card-title class="text-capitalize"
                    >{{ calculatedFees }} EUR</v-card-title
                >
                <v-card-subtitle class="text-capitalize"
                    >calculated fees</v-card-subtitle
                >
            </v-card-item>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :icon="
                        detailsVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'
                    "
                    @click="detailsVisible = !detailsVisible"
                    density="compact"
                ></v-btn>
            </v-card-actions>
            <v-expand-transition>
                <div v-show="detailsVisible">
                    <v-card-text
                        v-if="selectedShipmentMethod.description.length > 0"
                        class="text-body-2"
                        >{{ selectedShipmentMethod.description }}</v-card-text
                    >
                    <v-container class="text-capitalize">
                        <v-row align="start" dense>
                            <v-col>base fees:</v-col>
                            <v-col>{{ selectedShipmentMethod.baseFees }}</v-col>
                        </v-row>
                        <v-row align="start" dense>
                            <v-col>fees per item:</v-col>
                            <v-col>{{
                                selectedShipmentMethod.feesPerItem
                            }}</v-col>
                        </v-row>
                        <v-row align="start" dense>
                            <v-col>fees per kg:</v-col>
                            <v-col>{{
                                selectedShipmentMethod.feesPerKg
                            }}</v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-expand-transition>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import { ShipmentMethodImpl } from '@/model/classes/ShipmentMethodImpl'
import { OrderItemImpl } from '@/model/classes/orderItemImpl'
import { errorMessages } from '@/strings/errorMessages'
import { pushErrorNotification } from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps({
    orderItem: {
        type: OrderItemImpl,
        required: true,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(['update:orderItem'])

/**
 * The shipment method selected by the user.
 */
const selectedShipmentMethod = ref<ShipmentMethodImpl | undefined>(
    props.orderItem.shipmentMethod
)

watch(
    () => selectedShipmentMethod.value,
    () => onSelectedShipmentMethodChanged()
)

/**
 * Query for getting the shipment methods available to the user.
 */
const getAvailableShipmentMethodsQuery = asyncComputed(
    async () => {
        if (props.readonly) {
            return null
        }

        return await useClient().getAvailableShipmentMethods({
            items: {
                productVariantVersionId:
                    props.orderItem.shoppingCartItem.productVariantVersionId,
                quantity: props.orderItem.shoppingCartItem.count,
            },
        })
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
const shipmentMethodsNodes = computed(() => {
    if (!getAvailableShipmentMethodsQuery.value) {
        return
    }

    return getAvailableShipmentMethodsQuery.value.shipmentMethods.nodes
})

/**
 * The shipment methods that are available to the user taken from the corresponding query.
 */
const shipmentMethods = computed(() => {
    if (!shipmentMethodsNodes.value) {
        return
    }

    const shipmentMethods = shipmentMethodsNodes.value.map(
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

/**
 * The fees calculated for the selected shipment method.
 */
const calculatedFees = computed(() => {
    if (selectedShipmentMethod.value) {
        return shipmentMethodsNodes.value?.find(
            (shipmentMethod) =>
                shipmentMethod.id === selectedShipmentMethod.value?.id
        )?.calculatedFees
    }
})

watch(
    () => calculatedFees.value,
    () => onCalculatedFeesChanged()
)

/**
 * Whether the details regarding a shipment method are visible to the user.
 */
const detailsVisible = ref(false)

/**
 * Sets the shipment method of the order item to the selected shipment method and
 * emits that the order item has been updated.
 */
function onSelectedShipmentMethodChanged(): void {
    props.orderItem.shipmentMethod = selectedShipmentMethod.value

    emits('update:orderItem', props.orderItem)
}

/**
 * Takes the value of the calculatedFees computed ref and
 * sets it on the orderItem.
 * This function is intended to be called whenever the value of calculatedFees changes.
 */
function onCalculatedFeesChanged(): void {
    props.orderItem.shippingFees = calculatedFees.value
}
</script>
