<template>
    <v-app-bar density="comfortable">
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn disabled prepend-icon="mdi-cart"> Shopping Cart </v-btn>
        <v-btn @click="loginOrLogout">
            {{ store.isLoggedIn ? 'Logout' : 'Login' }}
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const store = useAppStore()

function loginOrLogout() {
    if (store.isLoggedIn) {
        store.logout()
    } else {
        store.login()
    }
}
</script>
