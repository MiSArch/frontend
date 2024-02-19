<template>
    <v-app-bar density="comfortable">
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn
            v-if="store.activeUserRoleIsBuyer"
            disabled
            prepend-icon="mdi-cart"
        >
            Shopping Cart
        </v-btn>
        <v-btn
            v-if="store.userHasMoreThanOneRole"
            prepend-icon="mdi-account-switch"
            @click="openSwitchUserRoleDialog"
        >
            Switch User Role
        </v-btn>
        <SwitchUserRoleDialog
            v-model="switchUserRoleDialogIsOpen"
            @close="closeSwitchUserRoleDialog"
            @close-and-navigate-to-storefront="closeSwitchUserRoleDialog(true)"
        />
        <v-btn @click="loginOrLogout">
            {{ store.isLoggedIn ? 'Logout' : 'Login' }}
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts" setup>
import SwitchUserRoleDialog from '@/components/SwitchUserRoleDialog.vue'
import { useAppStore } from '@/store/app'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useAppStore()

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
function closeSwitchUserRoleDialog(navigateToStorefront?: boolean) {
    switchUserRoleDialogIsOpen.value = false

    if (navigateToStorefront === true) {
        router.push({
            name: 'Storefront',
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
</script>
