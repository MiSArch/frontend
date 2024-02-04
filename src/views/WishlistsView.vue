<template>
    <v-app-bar density="comfortable">
        <v-spacer></v-spacer>
        <v-btn disabled prepend-icon="mdi-plus" @click="openAddWishlistDialog">
            Add Wishlist
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/**
 * Whether or not the "ADD PRODUCT" dialog is open.
 */
const addWishlistDialogOpen = ref(false)

/**
 * Opens the "ADD PRODUCT" dialog.
 */
function openAddWishlistDialog() {
    addWishlistDialogOpen.value = true
}

/**
 * Closes the "ADD PRODUCT" dialog.
 */
function closeAddWishlistDialog() {
    addWishlistDialogOpen.value = false
}
</script>
