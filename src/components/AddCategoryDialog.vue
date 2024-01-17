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
            </div>
            <div class="d-flex flex-column align-center justify-end pa-4">
                <v-alert
                    closable
                    v-model="saveFailed"
                    max-height="240"
                    max-width="480"
                    text="An unknown error occurred when trying to save the category."
                    title="Could Not Save"
                    type="error"
                ></v-alert>
            </div>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import { ref } from 'vue'

const name = ref('')
const description = ref('')

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

/**
 * Whether or not saving the category failed. 
 * This property decides whether or not an alert has to be shown to the user.
 */
const saveFailed = ref(false)

/**
 * Tries to save the category.
 */
async function save() {
    try {
        saveFailed.value = false

        const addedCategory = await client.createCategory({
            input: {
                categoricalCharacteristics: [],
                description: description.value,
                name: name.value,
                numericalCharacteristics: [],
            },
        })

        emit('close-addcategorydialog')
    } catch (error) {
        saveFailed.value = true

        console.error(error)
    }
}
</script>
