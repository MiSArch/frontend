<template>
    <v-dialog max-width="500">
        <v-card>
            <v-card-item>
                <v-card-title>Add Wishlist</v-card-title>
            </v-card-item>
            <v-card-text>
                <v-text-field clearable label="Name" v-model="name">
                </v-text-field>
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
import { AddWishlistInput } from '@/graphql/generated'
import { ref } from 'vue'

const props = defineProps({
    userId: {
        type: String,
        required: true,
    },
})

/**
 * The events the dialog emits:
 * add-wishlist -- A new wishlist has to be added.
 * close-addwishlistdialog -- The dialog has to be closed.
 */
const emit = defineEmits<{
    (event: 'add-wishlist', input: AddWishlistInput): void
    (event: 'close-addwishlistdialog'): void
}>()

/**
 * The name of the new yet to be added wishlist.
 */
const name = ref('')

/**
 * Resets -- clears -- every property of this view.
 */
function clearViewModel() {
    name.value = ''
}

/**
 * Has the view's model cleared and
 * emits the 'close-addwishlistdialog' event.
 */
function cancel() {
    clearViewModel()

    emit('close-addwishlistdialog')
}

/**
 * Emits the 'add-wishlist' event and
 * has the view's model cleared.
 */
function save() {
    const input: AddWishlistInput = {
        name: name.value,
        productVariantIds: [],
        userId: props.userId,
    }

    emit('add-wishlist', input)

    clearViewModel()
}
</script>
