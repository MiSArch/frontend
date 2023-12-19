<template>
    <v-app-bar flat>
        <v-app-bar-title
            ><router-link to="/products/foo/bar">
                MiSArch Frontend
            </router-link></v-app-bar-title
        >

        <v-btn prepend-icon="mdi-plus" v-if="true"> Add Product </v-btn>
        <AddProductDialog />
    </v-app-bar>
</template>

<script lang="ts" setup>
import AddProductDialog from '@/components/AddProductDialog.vue'
</script>
