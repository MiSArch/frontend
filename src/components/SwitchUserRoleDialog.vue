<template>
    <v-dialog height="auto" max-width="500" persistent>
        <v-card>
            <v-card-item>
                <v-card-title>Switch User Role</v-card-title>
                <v-card-subtitle
                    >User roles are managed in Keycloak</v-card-subtitle
                >
            </v-card-item>
            <v-card-text>
                <div class="mb-3">
                    Please note that certain areas of the online store's web
                    application can only be accessed with specific user roles.
                    For example, the wish list features are exclusively intended
                    for the Buyer.
                </div>
                <v-select
                    :items="userRolesOfCurrentUser"
                    hint="Changes take effect immediately"
                    label="User Role"
                    persistent-hint
                    variant="solo-filled"
                    v-model="activeUserRole"
                    @update:model-value="hasChanges = true"
                ></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-close" @click="close(true)"
                    >Close</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { activeUserRole, userRolesOfCurrentUser } = storeToRefs(useAppStore())

/**
 * Type-based declaration of emitted events:
 * close: The dialog should be closed and
 * depending on the argument for the boolean parameter 'navigateToStorefront',
 * the user should be redirected to the storefront.
 */
const emit = defineEmits<{
    (event: 'close', navigateToStorefront: boolean): void
}>()

/**
 * Tracks whether or not changes to the v-select for the available user roles have been made.
 */
const hasChanges = ref(false)

/**
 * Resets the view model to its initial state.
 * @returns Whether or not the view model was reset.
 */
function resetViewModel(): boolean {
    if (hasChanges.value) {
        hasChanges.value = false

        return true
    }

    return false
}

/**
 * Closes the dialog, optionally resetting the view model.
 * @param haveViewModelReset - Indicates whether to reset the view model.
 */
function close(haveViewModelReset?: boolean) {
    const hadChanges = hasChanges.value

    if (haveViewModelReset === true) {
        resetViewModel()
    }

    emit('close', hadChanges)
}
</script>
