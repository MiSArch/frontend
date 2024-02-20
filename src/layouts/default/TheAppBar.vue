<template>
    <v-app-bar density="comfortable">
        <v-app-bar-title>
            <router-link to="/"> MiSArch Online Store </router-link>
        </v-app-bar-title>
        <v-btn v-if="activeUserRoleIsBuyer" disabled prepend-icon="mdi-cart">
            Shopping Cart
        </v-btn>
        <v-btn
            v-if="userHasMoreThanOneRole"
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
import { UserRole, useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useAppStore()

const { activeUserRole, userRolesOfCurrentUser } = storeToRefs(store)

/**
 * Whether or not the active user role is 'Buyer'.
 */
const activeUserRoleIsBuyer = computed(() => {
    return activeUserRole.value == UserRole.Buyer
})

/**
 * Whether or not the user has more than one user role.
 */
const userHasMoreThanOneRole = computed(() => {
    return userRolesOfCurrentUser.value.length > 1
})

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
