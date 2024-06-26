<template>
    <v-app-bar density="comfortable">
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn
            v-if="activeUserRoleIsBuyer"
            :disabled="!shoppingCartIsEnabled"
            prepend-icon="mdi-cart"
            @click="goToShoppingCart"
        >
            Shopping Cart
        </v-btn>
        <v-btn
            v-if="activeUserRoleIsAdmin"
            prepend-icon="mdi-console"
            :to="{ name: routeNames.graphiql }"
        >
            GraphiQL
        </v-btn>
        <v-btn
            v-if="currenUserHasMoreThanOneRole"
            prepend-icon="mdi-account-switch"
            @click="openSwitchUserRoleDialog"
        >
            Switch User Role
        </v-btn>
        <v-btn icon variant="plain" size="small" @click="toggleDarkMode()">
            <v-icon
                :icon="lightMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                size="large"
            />
            <v-tooltip activator="parent" location="bottom">
                Toggle light/dark mode
            </v-tooltip>
        </v-btn>
        <SwitchUserRoleDialog
            v-model="switchUserRoleDialogIsOpen"
            @close="closeSwitchUserRoleDialog"
        />
        <v-btn @click="loginOrLogout">
            {{ store.isLoggedIn ? 'Logout' : 'Login' }}
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts" setup>
import SwitchUserRoleDialog from '@/components/SwitchUserRoleDialog.vue'
import { routeNames } from '@/router/routeNames'
import { useAppStore } from '@/store/app'
import { useLocalStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify/lib/framework.mjs'

const store = useAppStore()

const {
    activeUserRoleIsBuyer,
    activeUserRoleIsAdmin,
    currenUserHasMoreThanOneRole,
    shoppingCart,
    shoppingCartIsEnabled,
} = storeToRefs(store)

const router = useRouter()

/**
 * Whether the "SWITCH USER ROLE" dialog is open or not.
 */
const switchUserRoleDialogIsOpen = ref(false)

/**
 * Opens the "SWITCH USER ROLE" dialog.
 */
function openSwitchUserRoleDialog() {
    switchUserRoleDialogIsOpen.value = true
}

/**
 * Closes the "SWITCH USER ROLE" dialog.
 */
function closeSwitchUserRoleDialog(navigateToStorefront: boolean) {
    switchUserRoleDialogIsOpen.value = false

    if (navigateToStorefront) {
        router.push({
            name: routeNames.storefront,
        })
    }
}

function loginOrLogout() {
    if (store.isLoggedIn) {
        store.logout()
    } else {
        store.login()
    }
}

/**
 * Navigates the user to their shopping cart.
 */
async function goToShoppingCart() {
    router.push({
        name: routeNames.shoppingCart,
    })
}

const theme = useTheme()
const lightMode = useLocalStorage<boolean>('lightMode', true)

function toggleDarkMode() {
    lightMode.value = !lightMode.value
    updateColorMode()
}

function updateColorMode() {
    theme.global.name.value = lightMode.value ? 'light' : 'dark'
}

updateColorMode()
</script>
