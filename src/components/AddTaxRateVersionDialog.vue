<template>
    <v-dialog max-width="504">
        <v-card>
            <v-card-item>
                <v-card-title>Add Tax Rate Version</v-card-title>
            </v-card-item>
            <v-card-text>
                <div class="d-flex flex-column ga-4">
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
import { CreateTaxRateVersionInput } from '@/graphql/generated'
import { ref } from 'vue'

/**
 * The props of this component.
 */
const props = defineProps({
    taxRateId: {
        type: String,
        required: true,
    },
})

/**
 * The emits of this component:
 * close-addtaxrateversiondialog -- The dialog has to be closed.
 * add-tax-rate-version -- The given tax rate version has to be added.
 */
const emit = defineEmits<{
    (event: 'close-addtaxrateversiondialog'): void
    (event: 'add-tax-rate-version', input: CreateTaxRateVersionInput): void
}>()

/**
 * The rate of the initial tax rate version.
 */
const rate = ref('')

/**
 * Whether or not the entered rate is invalid.
 */
const rateIsInvalid = ref(false)

/**
 * Resets every mutable property of this view.
 */
function resetViewModel() {
    rate.value = ''
}

/**
 * Resets the view model and
 * emits the 'close-addtaxratedialog' event.
 */
function cancel() {
    resetViewModel()

    emit('close-addtaxrateversiondialog')
}

/**
 * Emits the 'add-tax-rate-version' event and
 * resets the view model
 * if the tax rate version can be saved -- if the provided rate is valid.
 */
function save() {
    rateIsInvalid.value = false

    if (rateIsValid()) {
        const input: CreateTaxRateVersionInput = {
            rate: parseFloat(rate.value),
            taxRateId: props.taxRateId,
        }

        emit('add-tax-rate-version', input)

        resetViewModel()
    }
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
