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
                        >Add Product</v-btn
                    >
                </v-toolbar-items>
            </v-toolbar>
            <div class="d-flex flex-column pa-4">
                <v-switch label="Visible" v-model="visible"></v-switch>
                <v-text-field
                    clearable
                    label="Internal Product Name"
                    v-model="internalName"
                >
                </v-text-field>
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
                            <v-switch label="Visible"></v-switch>
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
                            <v-text-field clearable label="Actual Price">
                            </v-text-field>
                            <v-select
                                label="Categories"
                                :items="['Photography', 'Sports', 'Music']"
                                multiple
                                variant="solo"
                            ></v-select>
                            <v-file-input
                                accept="image/*"
                                chips
                                clearable
                                counter
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
    CreateProductInput,
    CreateProductVariantInput,
} from '@/graphql/generated'
import { ref } from 'vue'

const emit = defineEmits<{
    (event: 'close-dialog'): void
}>()

const client = useClient()

const variantTab = ref<number>()

interface ProductVariant {
    tempId: number
    visible: boolean
    name: string
    description: string
    retailPrice: string
    categories: string[]
}

const internalName = ref('')
const visible = ref(false)
const defaultVariant = ref<number>()
const variants = ref<ProductVariant[]>([])
const tempIdCounter = ref(0)

function addVariant() {
    const createdVariant = {
        tempId: tempIdCounter.value++,
        visible: false,
        name: '',
        description: '',
        retailPrice: '',
        categories: [],
    }
    variants.value.push(createdVariant)
    variantTab.value = createdVariant.tempId
}

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

function transformVariant(
    variant: ProductVariant
): CreateProductInput['defaultVariant'] {
    return {
        isPubliclyVisible: variant.visible,
        initialVersion: {
            name: variant.name,
            description: variant.description,
            retailPrice: Number.parseInt(variant.retailPrice),
            numericalCharacteristicValues: [],
            categoricalCharacteristicValues: [],
        },
    }
}

async function save() {
    const defaultVariantValue = variants.value.find(
        (v) => v.tempId === defaultVariant.value
    )!
    const product = await client.createProduct({
        input: {
            internalName: internalName.value,
            isPubliclyVisible: visible.value,
            categoryIds: [],
            defaultVariant: transformVariant(defaultVariantValue),
        },
    })
    const productId = product.createProduct.id
    for (const variant of variants.value) {
        if (variant.tempId != defaultVariant.value) {
            const variantInput: CreateProductVariantInput = {
                productId,
                isPubliclyVisible: variant.visible,
                initialVersion: {
                    name: variant.name,
                    description: variant.description,
                    retailPrice: Number.parseInt(variant.retailPrice),
                    numericalCharacteristicValues: [],
                    categoricalCharacteristicValues: [],
                },
            }
            await client.createProductVariant({ input: variantInput })
        }
    }
    emit('close-dialog')
}
</script>
