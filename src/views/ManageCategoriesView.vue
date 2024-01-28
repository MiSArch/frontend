<template>
    <v-app-bar density="compact">
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" @click="openAddCategoryDialog">
            Add Category
        </v-btn>
        <AddCategoryDialog
            v-model="addCategoryDialogOpen"
            @close-addcategorydialog="closeAddCategoryDialog"
        />
    </v-app-bar>
</template>

<script lang="ts" setup>
import AddCategoryDialog from '@/components/AddCategoryDialog.vue'
import { ref } from 'vue'

/**
 * Whether or not the "ADD CATEGORY" dialog is open.
 */
const addCategoryDialogOpen = ref(false)

/**
 * Opens the "ADD CATEGORY" dialog.
 */
function openAddCategoryDialog() {
    addCategoryDialogOpen.value = true
}

/**
 * Closes the "ADD CATEGORY" dialog.
 */
function closeAddCategoryDialog() {
    addCategoryDialogOpen.value = false
}
</script>
