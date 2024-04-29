<template>
    <v-sheet :border="true" :elevation="1">
        <div class="d-flex justify-space-between ga-2 pa-2">
            <div class="d-flex ga-2">
                <div class="d-inline-flex">
                    <v-img
                        :width="240"
                        aspect-ratio="4/3"
                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    ></v-img>
                </div>
                <div class="d-flex flex-column">
                    <router-link :to="link">
                        <span class="text-body-1">{{ name }}</span>
                    </router-link>
                    <ProductPrice :price="price" :retail-price="retailPrice" />
                </div>
            </div>
            <div v-if="isShoppingCartItem" class="d-flex ga-2">
                <v-divider vertical></v-divider>
                <v-card variant="flat">
                    <v-card-text>
                        <v-select
                            density="compact"
                            :items="countOptions"
                            label="Amount"
                            v-model="selectedCount"
                            :readonly="readonly"
                            style="min-width: 96px"
                            @update:model-value="emitCountChangedIfPossible"
                        ></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="readonly"
                            prepend-icon="mdi-delete"
                            @click="emitDeletedIfPossible"
                            >delete</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </v-sheet>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/routeNames'
import ProductPrice from './ProductPrice.vue'
import { computed, ref } from 'vue'

/**
 * Props of this component:
 *
 * @prop productId - The ID of the product.
 * @prop productVariantId - The ID of the product variant.
 * @prop name - The name to display: For example, this could be the product's internal name or
 * the name of the product variant's current version.
 * @prop price - The current price of the product variant.
 * @prop retailPrice - The retail price of the produc variant's current version.
 * @prop [idOfShoppingCartItem] - If the ProductSummary is supposed to represent one of the shopping cart's items
 * the ID of that item.
 * @prop [count] - The count of the shopping cart item.
 * @prop [maximumCount] - The maximum number of product items a buyer can order.
 */
const props = defineProps({
    productId: {
        type: String,
        required: true,
    },
    productVariantId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
    idOfShoppingCartItem: {
        type: String,
    },
    count: {
        type: Number,
    },
    maximumCount: {
        type: Number,
        default: 10,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
})

/**
 * The emitted events of this component:
 *
 * @event count-changed - The count of the shopping cart item has changed.
 * @event deleted - The shopping cart item has been deleted.
 */
const emit = defineEmits<{
    (
        event: 'count-changed',
        idOfShoppingCartItem: string,
        newCount: number
    ): void
    (event: 'deleted', idOfShoppingCartItem: string): void
}>()

/**
 * Where to navigate to when the user clicks on the product's name.
 */
const link = computed(() => {
    return {
        name: routeNames.product,
        params: {
            productid: props.productId,
            productvariantid: props.productVariantId,
        },
    }
})

/**
 * Whether this ProductSummary represents a shopping cart item or not.
 */
const isShoppingCartItem = computed(() => {
    return props.idOfShoppingCartItem != undefined
})

/**
 * The count of the shopping cart item that the user has selected
 * -- the amount of product items the user wants to order.
 */
const selectedCount = ref(props.count?.toString())

/**
 * Computes an array of stringified integers from 1 to the value of the prop 'maximumCount'.
 */
const countOptions = computed(() => {
    if (isShoppingCartItem.value) {
        return Array.from({ length: props.maximumCount }, (_, index) =>
            (index + 1).toString()
        )
    }
})

/**
 * Sends the 'count-changed' event if possible, i.e. if both the ID of the shopping cart item and
 * the selected count are not undefined.
 */
function emitCountChangedIfPossible() {
    if (
        props.idOfShoppingCartItem != undefined &&
        selectedCount.value != undefined
    ) {
        emit(
            'count-changed',
            props.idOfShoppingCartItem,
            parseInt(selectedCount.value)
        )
    }
}

/**
 * Sends the 'deleted' event if possible, i.e. if the ID of the shopping cart is not undefined.
 */
function emitDeletedIfPossible() {
    if (props.idOfShoppingCartItem != undefined) {
        emit('deleted', props.idOfShoppingCartItem)
    }
}
</script>
