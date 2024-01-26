<template>
    <v-app-bar density="compact">
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" @click="openAddProductDialog">
            Add Product
        </v-btn>
        <AddProductDialog
            v-model="addProductDialogOpen"
            @close-dialog="closeAddProductDialog"
        />
    </v-app-bar>
</template>

<script lang="ts" setup>
import AddProductDialog from '@/components/AddProductDialog.vue'
import { ref } from 'vue'

/**
 * Whether or not the "ADD PRODUCT" dialog is open.
 */
const addProductDialogOpen = ref(false)

/**
 * Opens the "ADD PRODUCT" dialog.
 */
function openAddProductDialog() {
    addProductDialogOpen.value = true
}

/**
 * Closes the "ADD PRODUCT" dialog.
 */
function closeAddProductDialog() {
    addProductDialogOpen.value = false
}
</script>
