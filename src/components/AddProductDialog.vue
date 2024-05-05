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
                            <v-checkbox
                                label="Can be returned at any time"
                                v-model="variant.canBeReturnedAtAnyTime"
                            ></v-checkbox>
                            <v-text-field
                                v-if="!variant.canBeReturnedAtAnyTime"
                                class="mb-4"
                                clearable
                                hint="Enter either 0 or a positive integer, e.g. 30"
                                label="Can be returned within this many days of receipt"
                                :rules="[
                                    canBeReturnedWithinNumberOfDaysInputIsValid,
                                ]"
                                type="input"
                                v-model="variant.canBeReturnedForDays"
                            >
                            </v-text-field>
                            <v-file-input
                                accept="image/*"
                                chips
                                clearable
                                counter
                                label="Add Images"
                                multiple
                                show-size
                                variant="outlined"
                                v-model="variant.selectedFiles"
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
    awaitActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'
import {
    canBeReturnedWithinNumberOfDaysInputIsValid,
    weightInputIsValid,
} from '@/util/rules'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/app'

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
    canBeReturnedAtAnyTime: boolean
    canBeReturnedForDays: string
    description: string
    name: string
    retailPrice: string
    taxRateId: string | undefined
    weight: string | undefined
    selectedFiles: File[]
    mediaIds: string[]
}

const store = useAppStore()

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
        canBeReturnedAtAnyTime: false,
        canBeReturnedForDays: '30',
        description: '',
        name: internalName.value ?? '',
        retailPrice: '0',
        taxRateId: undefined,
        weight: undefined,
        selectedFiles: [],
        mediaIds: [],
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
            canBeReturnedForDays: variant.canBeReturnedAtAnyTime
                ? null
                : Number.parseInt(variant.canBeReturnedForDays),
            categoricalCharacteristicValues: [],
            description: variant.description,
            name: variant.name,
            numericalCharacteristicValues: [],
            retailPrice: parseInt(variant.retailPrice),
            taxRateId: variant.taxRateId,
            weight:
                variant.weight !== undefined ? parseFloat(variant.weight) : 0,
            mediaIds: variant.mediaIds,
        },
        isPubliclyVisible: !variant.invisible,
    }
}

/**
 * Uploads files to the media service via GraphQL.
 * @param files Files to upload.
 */
async function uploadMedias(files: File[]) {
    const uploadPromises = files.map(uploadFileWorkaround)
    const mediaIds = await Promise.all(uploadPromises)
    return mediaIds
}

/**
 * Uploads file to media service via GraphQL.
 * Uses manually constructed request as library dropped file-upload support.
 * We do not want to use express.
 * @param file The file to upload.
 */
async function uploadFileWorkaround(file: File) {
    const queryAndVariables = {
        query: `mutation ($file: Upload!) {
          uploadMedia (mediaFile: $file)
        }`,
        variables: {
            file: null,
        },
    }
    const map = {
        '0': ['variables.file'],
    }
    let formData = new FormData()
    formData.append('operations', JSON.stringify(queryAndVariables))
    formData.append('map', JSON.stringify(map))
    formData.append('0', file)
    const token = `Bearer ${await store.getAccessToken(true)}`
    const requestOptions = {
        method: 'POST',
        headers: { Authorization: token },
        body: formData,
    }
    const data = await fetch('/api/graphql', requestOptions).then(
        (response) => {
            return response.json()
        }
    )
    return data.data.uploadMedia
}

/**
 * Tries to save the product and its variants (to the catalog service).
 */
async function save() {
    for (const variant of variants.value) {
        const mediaIds = await uploadMedias(variant.selectedFiles)
        variant.mediaIds = mediaIds
    }

    const defaultVariantValue = variants.value.find(
        (v) => v.tempId === defaultVariant.value
    )!

    const product = await awaitActionAndPushErrorIfNecessary(() => {
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
        if (variant.tempId !== defaultVariant.value) {
            const createProductInput = transformVariant(variant)
            const createProductVariantInput: CreateProductVariantInput = {
                productId: productId,
                initialVersion: createProductInput.initialVersion,
                isPubliclyVisible: createProductInput.isPubliclyVisible,
            }
            await awaitActionAndPushErrorIfNecessary(() => {
                return client.createProductVariant({
                    input: createProductVariantInput,
                })
            }, errorMessages.createProductVariant)
        }
    }

    emit('close-dialog')
}
</script>
