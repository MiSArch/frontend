<template>
    <v-app-bar flat>
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn disabled prepend-icon="mdi-cart"> Shopping Cart </v-btn>
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

const addProductDialogOpen = ref(false)

const openAddProductDialog = () => {
    addProductDialogOpen.value = true
}

const closeAddProductDialog = () => {
    addProductDialogOpen.value = false
}
</script>
