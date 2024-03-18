<template>
    <v-dialog fullscreen scrollable transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn dark icon @click="$emit('close-addcategorydialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Category</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn prepend-icon="mdi-content-save" @click="save"
                        >Save</v-btn
                    >
                </v-toolbar-items>
            </v-toolbar>
            <div class="d-flex flex-column pa-4">
                <v-text-field clearable label="Name" v-model="name">
                </v-text-field>
                <v-textarea clearable label="Description" v-model="description">
                </v-textarea>
                <div class="d-flex">
                    <v-tabs v-model="currentTab">
                        <v-tab
                            v-for="(
                                categoryCharacteristic, index
                            ) in categoryCharacteristics"
                            :key="index"
                            :value="categoryCharacteristic.tempId"
                        >
                            <template v-if="categoryCharacteristic.name">
                                {{ categoryCharacteristic.name }}
                            </template>
                            <template v-else>
                                Characteristic {{ index }}
                            </template>
                        </v-tab>
                    </v-tabs>
                    <v-spacer />
                    <v-btn
                        icon
                        @click="addCategoryCharacteristic"
                        variant="outlined"
                        color="primary"
                    >
                        <v-icon icon="mdi-plus"></v-icon>
                    </v-btn>
                </div>
                <v-window v-model="currentTab">
                    <v-window-item
                        v-for="(characteristic, idx) in categoryCharacteristics"
                        :key="idx"
                        :value="characteristic.tempId"
                    >
                        <v-card class="pa-8" flat>
                            <v-select
                                label="Type of Characteristic"
                                :items="typesOfCategoryCharacteristic"
                                item-title="name"
                                item-value="key"
                                v-model="
                                    characteristic.typeOfCategoryCharacteristic
                                "
                            >
                            </v-select>
                            <v-text-field
                                clearable
                                label="Name"
                                v-model="characteristic.name"
                            >
                            </v-text-field>
                            <v-textarea
                                clearable
                                label="Description"
                                v-model="characteristic.description"
                            >
                            </v-textarea>
                            <v-text-field
                                v-if="
                                    characteristic.typeOfCategoryCharacteristic ===
                                    1
                                "
                                clearable
                                label="Unit"
                                v-model="characteristic.unit"
                            >
                            </v-text-field>
                            <v-card-actions>
                                <v-btn
                                    prepend-icon="mdi-close"
                                    @click="
                                        removeCategoryCharacteristic(
                                            characteristic.tempId
                                        )
                                    "
                                    >Remove Characteristic
                                </v-btn>
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
import { errorMessages } from '@/strings/errorMessages'
import { awaitActionAndPushErrorIfNecessary } from '@/util/errorHandler'
import { ref } from 'vue'

/**
 * A CategoryCharacteristic represents a single characteristic
 * belonging to the category which gets added to the catalog service by this dialog.
 * Such a characteristic can be a categorical one or a numerical one --
 * its property typeOfCategoryCharacteristic stores this information.
 */
interface CategoryCharacteristic {
    tempId: number
    typeOfCategoryCharacteristic: number
    description: string
    name: string
    unit: string
}

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The 'close-addcategorydialog' event tells the app to close this dialog.
 */
const emit = defineEmits<{
    (event: 'close-addcategorydialog'): void
}>()

const name = ref('')
const description = ref('')

const categoryCharacteristics = ref<CategoryCharacteristic[]>([])
const currentTab = ref<number>()
const tempIdCounter = ref(0)

/**
 * The two available types of category characteristics.
 * The 'key' is supposed to be used as the value of the
 * typeOfCategoryCharacteristic property of a CategoryCharacteristic
 * (see the interface defined earlier).
 */
const typesOfCategoryCharacteristic = ref([
    { key: 0, name: 'Categorical' },
    { key: 1, name: 'Numerical' },
])

/**
 * Tries to save the category.
 */
async function save() {
    const categoricalCharacteristics: {
        description: string
        name: string
    }[] = []
    const numericalCharacteristics: {
        description: string
        name: string
        unit: string
    }[] = []

    categoryCharacteristics.value.forEach((categoryCharacteristic) => {
        if (categoryCharacteristic.typeOfCategoryCharacteristic === 0) {
            const categoricalCategoryCharacteristicInput = {
                description: categoryCharacteristic.description,
                name: categoryCharacteristic.name,
            }
            categoricalCharacteristics.push(
                categoricalCategoryCharacteristicInput
            )
        } else {
            if (categoryCharacteristic.typeOfCategoryCharacteristic === 1) {
                const numericalCategoryCharacteristicInput = {
                    description: categoryCharacteristic.description,
                    name: categoryCharacteristic.name,
                    unit: categoryCharacteristic.unit,
                }
                numericalCharacteristics.push(
                    numericalCategoryCharacteristicInput
                )
            }
        }
    })

    await awaitActionAndPushErrorIfNecessary(() => {
        return client.createCategory({
            input: {
                categoricalCharacteristics: categoricalCharacteristics,
                description: description.value,
                name: name.value,
                numericalCharacteristics: numericalCharacteristics,
            },
        })
    }, errorMessages.createCategory)

    emit('close-addcategorydialog')
}

/**
 * Adds one template (within a tab) to the dialog
 * in order for the user to be able to specify another characteristic of the category.
 */
function addCategoryCharacteristic() {
    const newCategoryCharacteristic = {
        tempId: tempIdCounter.value++,
        typeOfCategoryCharacteristic: 0,
        description: '',
        name: '',
        unit: '',
    }

    categoryCharacteristics.value.push(newCategoryCharacteristic)

    currentTab.value = newCategoryCharacteristic.tempId
}

/**
 * Removes one of the specified category characteristics and
 * their tab containing the corresponding template.
 * @param tempId The temporary id of the category characteristic to remove.
 */
function removeCategoryCharacteristic(tempId: number) {
    const index = categoryCharacteristics.value.findIndex(
        (characteristic) => characteristic.tempId === tempId
    )
    if (index > -1) {
        categoryCharacteristics.value.splice(index, 1)

        if (categoryCharacteristics.value.length > 0) {
            const newIndex = Math.max(0, index - 1)
            currentTab.value = categoryCharacteristics.value[newIndex].tempId
        }
    }
}
</script>
