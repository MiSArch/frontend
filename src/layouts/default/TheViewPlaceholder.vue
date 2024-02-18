<template>
    <v-main>
        <router-view />
        <Notifications />
    </v-main>
</template>

<script lang="ts" setup>
import Notifications from '@/components/Notifications.vue'
</script>
