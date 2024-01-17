<template>
    <v-app-bar flat>
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn disabled prepend-icon="mdi-cart"> Shopping Cart </v-btn>
        <v-btn prepend-icon="mdi-plus" @click="openAddCategoryDialog">
            Add Category
        </v-btn>
        <v-btn prepend-icon="mdi-plus" @click="openAddProductDialog">
            Add Product
        </v-btn>
        <AddCategoryDialog
            v-model="AddCategoryDialogOpen"
            @close-addcategorydialog="closeAddCategoryDialog"
        />
        <AddProductDialog
            v-model="addProductDialogOpen"
            @close-dialog="closeAddProductDialog"
        />
    </v-app-bar>
</template>

<script lang="ts" setup>
import AddCategoryDialog from '@/components/AddCategoryDialog.vue'
import AddProductDialog from '@/components/AddProductDialog.vue'
import { ref } from 'vue'

/**
 * Whether or not the "ADD CATEGORY" dialog is open.
 */
const AddCategoryDialogOpen = ref(false)

/**
 * Whether or not the "ADD PRODUCT" dialog is open.
 */
const addProductDialogOpen = ref(false)

/**
 * Opens the "ADD CATEGORY" dialog.
 */
function openAddCategoryDialog() {
    AddCategoryDialogOpen.value = true
}

/**
 * Closes the "ADD CATEGORY" dialog.
 */
function closeAddCategoryDialog() {
    AddCategoryDialogOpen.value = false
}

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
