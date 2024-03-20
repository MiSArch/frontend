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
            v-if="currenUserHasMoreThanOneRole"
            prepend-icon="mdi-account-switch"
            @click="openSwitchUserRoleDialog"
        >
            Switch User Role
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
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useAppStore()

const {
    activeUserRoleIsBuyer,
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
</script>
