<template>
    <div class="d-flex flex-column ga-2">
        <div
            v-if="props.inStock"
            class="text-body-1 text-green text-capitalize"
        >
            In Stock{{
                showNumberOfProductItemsInStock
                    ? ': ' + props.numberOfProductItemsInStock
                    : ''
            }}
        </div>
        <div v-else class="text-body-1 text-red text-capitalize">
            Not In Stock
        </div>
        <div
            v-if="
                props.perspective === Perspective.InventoryManager &&
                hasAnyInventoryStatusInformation
            "
            class="d-inline-flex"
        >
            <v-table class="text-capitalize" density="compact">
                <thead>
                    <tr>
                        <th>Product Item Status</th>
                        <th>Number Of Items</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="numberOfReservedProductItems !== undefined">
                        <td>Reserved</td>
                        <td>{{ numberOfReservedProductItems }}</td>
                    </tr>
                    <tr v-if="numberOfProductItemsInFullfillment !== undefined">
                        <td>In Fullfillment</td>
                        <td>{{ numberOfProductItemsInFullfillment }}</td>
                    </tr>
                    <tr v-if="numberOfShippedProductItems !== undefined">
                        <td>Shipped</td>
                        <td>{{ numberOfShippedProductItems }}</td>
                    </tr>
                    <tr v-if="numberOfDeliveredProductItems !== undefined">
                        <td>Delivered</td>
                        <td>{{ numberOfDeliveredProductItems }}</td>
                    </tr>
                    <tr v-if="numberOfReturnedProductItems !== undefined">
                        <td>Returned</td>
                        <td>{{ numberOfReturnedProductItems }}</td>
                    </tr>
                    <tr v-if="numberOfLostProductItems !== undefined">
                        <td>Lost</td>
                        <td>{{ numberOfLostProductItems }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Possible modes / 'perspectives' of this component.
 */
 enum Perspective {
    Customer = 'customer',
    InventoryManager = 'inventory manager',
}

/**
 * Props for the component.
 * 
 * @property perspective - The perspective (customer or inventory manager).
 * @property inStock - Indicates whether there are product items in stock.
 * @property [numberOfProductItemsInStock] - The number of product items in stock or undefined.
 * @property [numberOfReservedProductItems] - The number of reserved product items or undefined.
 * @property [numberOfProductItemsInFullfillment] - The number of product items in fulfillment or undefined.
 * @property [numberOfShippedProductItems] - The number of shipped product items or undefined.
 * @property [numberOfDeliveredProductItems] - The number of delivered product items or undefined.
 * @property [numberOfReturnedProductItems] - The number of returned product items or undefined.
 * @property [numberOfLostProductItems] - The number of lost product items or undefined.
 */
const props = defineProps({
    perspective: {
        type: String,
        required: true,
        validator(value: string) {
            return ['customer', 'inventory manager'].includes(value);
        },
    },
    inStock: {
        type: Boolean,
        required: true,
    },
    numberOfProductItemsInStock: {
        type: Number,
    },
    numberOfReservedProductItems: {
        type: Number,
    },
    numberOfProductItemsInFullfillment: {
        type: Number,
    },
    numberOfShippedProductItems: {
        type: Number,
    },
    numberOfDeliveredProductItems: {
        type: Number,
    },
    numberOfReturnedProductItems: {
        type: Number,
    },
    numberOfLostProductItems: {
        type: Number,
    },
});

/**
 * Computed property indicating whether to show the number of product items in stock:
 * True if the perspective is InventoryManager and the number of product items in stock is defined, false otherwise.
 */
const showNumberOfProductItemsInStock = computed(() => {
    return (
        props.perspective === Perspective.InventoryManager &&
        props.numberOfProductItemsInStock !== undefined
    );
});

/**
 * Computed property indicating whether there is any inventory status information available:
 * True if there is any inventory status information available, false otherwise.
 */
const hasAnyInventoryStatusInformation = computed(() => {
    return (
        props.numberOfProductItemsInStock ||
        props.numberOfReservedProductItems ||
        props.numberOfProductItemsInFullfillment ||
        props.numberOfShippedProductItems ||
        props.numberOfDeliveredProductItems ||
        props.numberOfReturnedProductItems ||
        props.numberOfLostProductItems
    );
});

</script>
