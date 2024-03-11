<template>
    <v-dialog fullscreen scrollable transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn dark icon @click="$emit('close-dialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Product</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn prepend-icon="mdi-content-save" @click="save"
                        >Save</v-btn
                    >
                </v-toolbar-items>
            </v-toolbar>
            <div class="d-flex flex-column pa-4">
                <v-switch
                    color="warning"
                    hide-details
                    label="Hide the product from visitors"
                    v-model="invisible"
                ></v-switch>
                <v-text-field
                    class="mb-4"
                    clearable
                    hint="The internal product name will not be visible to the customer."
                    label="Internal Product Name"
                    v-model="internalName"
                >
                </v-text-field>
                <v-select
                    chips
                    label="Categories"
                    :items="allCategories"
                    item-title="name"
                    item-value="id"
                    multiple
                    v-model="selectedCategories"
                ></v-select>
                <v-select
                    label="Default Product Variant"
                    :items="variants"
                    :item-title="
                        (item) => item.name || 'Product Variant ' + item.tempId
                    "
                    item-value="tempId"
                    variant="solo"
                    v-model="defaultVariant"
                ></v-select>
                <div class="d-flex">
                    <v-tabs v-model="variantTab">
                        <v-tab
                            v-for="(variant, idx) in variants"
                            :key="idx"
                            :value="variant.tempId"
                        >
                            <template v-if="variant.name">
                                {{ variant.name }}
                            </template>
                            <template v-else>
                                Product Variant {{ idx }}
                            </template>
                        </v-tab>
                    </v-tabs>
                    <v-spacer />
                    <v-btn
                        icon
                        @click="addVariant"
                        variant="outlined"
                        color="primary"
                    >
                        <v-icon icon="mdi-plus"></v-icon>
                    </v-btn>
                </div>
                <v-window v-model="variantTab">
                    <v-window-item
                        v-for="(variant, idx) in variants"
                        :key="idx"
                        :value="variant.tempId"
                    >
                        <v-card class="pa-8" flat>
                            <v-switch
                                color="warning"
                                hide-details
                                label="Hide the product variant from visitors"
                                v-model="variant.invisible"
                            ></v-switch>
                            <v-text-field
                                clearable
                                label="Product Variant Name"
                                v-model="variant.name"
                            >
                            </v-text-field>
                            <v-textarea
                                clearable
                                label="Description"
                                v-model="variant.description"
                            >
                            </v-textarea>
                            <v-text-field
                                clearable
                                label="Retail Price"
                                v-model="variant.retailPrice"
                            >
                            </v-text-field>
                            <v-select
                                chips
                                label="Tax Rate"
                                :items="allTaxRates?.taxRates.nodes"
                                item-title="name"
                                item-value="id"
                                v-model="variant.taxRateId"
                            ></v-select>
                            <v-text-field
                                class="mb-4"
                                clearable
                                hint="Enter a positive decimal number, e.g. 0.5"
                                :label="'Weight in ' + commonStrings.kg"
                                :rules="[weightInputIsValid]"
                                type="input"
                                v-model="variant.weight"
                            >
                            </v-text-field>
                            <v-file-input
                                accept="image/*"
                                chips
                                clearable
                                counter
                                disabled
                                label="Add Images"
                                multiple
                                show-size
                                variant="outlined"
                            ></v-file-input>
                            <v-card-actions>
                                <v-btn
                                    prepend-icon="mdi-close"
                                    @click="removeVariant(variant.tempId)"
                                    >Remove Product Variant</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import {
    CategoryOrderField,
    CreateProductInput,
    CreateProductVariantInput,
    OrderDirection,
} from '@/graphql/generated'
import { commonStrings } from '@/strings/commonStrings'
import { errorMessages } from '@/strings/errorMessages'
import {
    pushErrorNotification,
    pushErrorNotificationIfNecessary,
} from '@/util/errorHandler'
import { weightInputIsValid } from '@/util/rules'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

/**
 * A Category represents a simplified product category.
 */
interface Category {
    id: any
    name: string
}

/**
 * A ProductVariant represents a product variant
 * with additional information which have to be stored
 * as the initial ProductVariantVersion.
 */
interface ProductVariant {
    invisible: boolean
    tempId: number
    canBeReturnedForDays: number
    description: string
    name: string
    retailPrice: string
    taxRateId: string | undefined
    weight: string | undefined
}

/**
 * The 'close-dialog' event tells the app to close this dialog.
 */
const emit = defineEmits<{
    (event: 'close-dialog'): void
}>()

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

const variantTab = ref<number>()
const internalName = ref('')
const invisible = ref(false)
const selectedCategories = ref<any>([])
const tempIdCounter = ref(0)
const defaultVariant = ref<number>()
const variants = ref<ProductVariant[]>([])

/**
 * Gets all available categories from the catalog service and
 * the total count of categories.
 * The returned categores are expected to be ordered by their names
 * in ascending order.
 */
const getAllCategoriesResult = asyncComputed(
    async () => {
        return client.getCategoriesWithCharacteristics({
            orderBy: {
                direction: OrderDirection.Asc,
                field: CategoryOrderField.Name,
            },
        })
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getCategoriesWithCharacteristics,
                e
            ),
        shallow: false,
    }
)

/**
 * Gets only the categories -- the entities -- from getAllCategoriesResult.
 */
const allCategories = computed(
    () => getAllCategoriesResult.value?.categories?.nodes ?? []
)

/**
 * The available tax rates.
 */
const allTaxRates = asyncComputed(
    async () => {
        return client.getTaxRates()
    },
    null,
    {
        onError: (e) => pushErrorNotification(errorMessages.getTaxRates, e),
        shallow: false,
    }
)

/**
 * Adds a product variant template to the dialog
 * so the user can add another product variant.
 */
function addVariant() {
    const createdVariant = {
        invisible: false,
        tempId: tempIdCounter.value++,
        canBeReturnedForDays: 30,
        description: '',
        name: internalName.value ?? '',
        retailPrice: '0',
        taxRateId: undefined,
        weight: undefined,
    }
    variants.value.push(createdVariant)
    variantTab.value = createdVariant.tempId
}

/**
 * Removes a product variant from the product.
 * @param tempId The temporary id of the product variant to remove.
 */
function removeVariant(tempId: number) {
    const idx = variants.value.findIndex((v) => v.tempId === tempId)
    if (idx > -1) {
        variants.value.splice(idx, 1)
    }
    if (variants.value.length > 0) {
        const newIdx = Math.max(0, idx - 1)
        variantTab.value = variants.value[newIdx].tempId
    }
}

/**
 * Transforms a given ProductVariant into a ProductVariantInput object
 * which serves as the value for the 'defaultVariant' key of a CreateProductInput.
 * @param variant The product variant to transform into a CreateProductInput object.
 */
function transformVariant(
    variant: ProductVariant
): CreateProductInput['defaultVariant'] {
    return {
        initialVersion: {
            canBeReturnedForDays: variant.canBeReturnedForDays,
            categoricalCharacteristicValues: [],
            description: variant.description,
            name: variant.name,
            numericalCharacteristicValues: [],
            retailPrice: parseInt(variant.retailPrice),
            taxRateId: variant.taxRateId,
            weight:
                variant.weight !== undefined ? parseFloat(variant.weight) : 0,
        },
        isPubliclyVisible: !variant.invisible,
    }
}

/**
 * Tries to save the product and its variants (to the catalog service).
 */
async function save() {
    const defaultVariantValue = variants.value.find(
        (v) => v.tempId === defaultVariant.value
    )!

    const product = await pushErrorNotificationIfNecessary(() => {
        return client.createProduct({
            input: {
                categoryIds: selectedCategories.value ?? [],
                defaultVariant: transformVariant(defaultVariantValue),
                internalName: internalName.value,
                isPubliclyVisible: !invisible.value,
            },
        })
    }, errorMessages.createProduct)

    const productId = product.createProduct.id

    for (const variant of variants.value) {
        if (variant.tempId != defaultVariant.value) {
            const variantInput: CreateProductVariantInput = {
                productId,
                initialVersion: {
                    canBeReturnedForDays: variant.canBeReturnedForDays,
                    categoricalCharacteristicValues: [],
                    description: variant.description,
                    name: variant.name,
                    numericalCharacteristicValues: [],
                    retailPrice: Number.parseInt(variant.retailPrice),
                    taxRateId: variant.taxRateId,
                    weight:
                        variant.weight !== undefined
                            ? parseFloat(variant.weight)
                            : 0,
                },
                isPubliclyVisible: !variant.invisible,
            }
            await pushErrorNotificationIfNecessary(() => {
                return client.createProductVariant({ input: variantInput })
            }, errorMessages.createProductVariant)
        }
    }

    emit('close-dialog')
}
</script>
