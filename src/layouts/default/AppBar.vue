<template>
  <v-app-bar flat>
    <v-app-bar-title>
      MiSArch Frontend
    </v-app-bar-title>

    <v-btn
      prepend-icon="mdi-plus"
      v-if="true"
    >
      Add Product
    </v-btn>
    <AddProductDialog />
  </v-app-bar>
</template>

<script lang="ts" setup>
  import AddProductDialog from '@/components/AddProductDialog.vue';
</script>
