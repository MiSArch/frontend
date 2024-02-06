<template>
    <v-dialog max-width="504">
        <v-card>
            <v-card-item>
                <v-card-title>Add Tax Rate</v-card-title>
            </v-card-item>
            <v-card-text>
                <div class="d-flex flex-column ga-4">
                    <v-alert
                        closable
                        density="comfortable"
                        text="The given input cannot be saved."
                        title="Cannot Save"
                        type="error"
                        v-model="cannotSave"
                    ></v-alert>
                    <v-text-field
                        clearable
                        label="Name"
                        type="input"
                        v-model="name"
                    >
                    </v-text-field>
                    <v-text-field
                        clearable
                        label="Description"
                        type="input"
                        v-model="description"
                    >
                    </v-text-field>
                    <v-text-field
                        clearable
                        hint="Enter a positive decimal number, e.g. 0.19"
                        label="Rate"
                        type="input"
                        v-model="rate"
                    >
                    </v-text-field>
                    <v-alert
                        closable
                        density="comfortable"
                        text="The rate must be a positive decimal number, e.g. 0.19."
                        title="Invalid Format"
                        type="error"
                        v-model="rateIsInvalid"
                    ></v-alert>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-close" @click="cancel"> Cancel </v-btn>
                <v-btn prepend-icon="mdi-content-save" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { CreateTaxRateInput } from '@/graphql/generated'
import { ref } from 'vue'

/**
 * The emits of this component:
 * close-addtaxratedialog -- The dialog has to be closed.
 * add-tax-rate -- The given tax rate has to be added.
 */
const emit = defineEmits<{
    (event: 'close-addtaxratedialog'): void
    (event: 'add-tax-rate', input: CreateTaxRateInput): void
}>()

/**
 * The name of the tax rate.
 */
const name = ref('')

/**
 * The description of the tax rate.
 */
const description = ref('')

/**
 * The rate of the initial tax rate version.
 */
const rate = ref('')

/**
 * Whether or not the tax rate can be saved.
 */
const cannotSave = ref(false)

/**
 * Whether or not the entered rate is invalid.
 */
const rateIsInvalid = ref(false)

/**
 * Resets every mutable property of this view.
 */
function resetViewModel() {
    name.value = ''
    description.value = ''
    rate.value = ''
}

/**
 * Resets the view model and
 * emits the 'close-addtaxratedialog' event.
 */
function cancel() {
    resetViewModel()

    emit('close-addtaxratedialog')
}

/**
 * Emits the 'add-tax-rate' event and
 * resets the view model
 * if the tax rate can be saved.
 */
function save() {
    cannotSave.value = false
    rateIsInvalid.value = false

    if (canSave()) {
        const input: CreateTaxRateInput = {
            name: name.value,
            description: description.value,
            initialVersion: {
                rate: parseFloat(rate.value),
            },
        }

        emit('add-tax-rate', input)

        resetViewModel()
    }
}

/**
 * Evaluates whether or not the provided tax rate input can be saved --
 * if the provided input is valid.
 */
function canSave(): boolean {
    const canSave =
        rateIsValid() && name.value.length > 0 && description.value.length > 0
    cannotSave.value = !canSave
    return canSave
}

/**
 * Evaluates whether or not the provided input for the rate
 * of the initial tax rate version is valid.
 */
function rateIsValid(): boolean {
    const rateAsFloat = parseFloat(rate.value)
    const rateIsValid = rateAsFloat >= 0
    rateIsInvalid.value = !rateIsValid
    return rateIsValid
}
</script>
