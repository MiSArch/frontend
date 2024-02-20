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
                <v-btn prepend-icon="mdi-close" @click="close">Close</v-btn>
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
 * The emits of this dialog:
 * close -- The dialog has to be closed.
 * close-and-navigate-to-storefront -- The dialog has to be closed and
 *   the user must be redirected to the 'Storefront'.
 */
const emit = defineEmits<{
    (event: 'close'): void
    (event: 'close-and-navigate-to-storefront'): void
}>()

/**
 * Tracks whether or not changes to the v-select for the available user roles have been made.
 */
const hasChanges = ref(false)

/**
 * Resets the view model and returns whether it was reset.
 * @returns {boolean} - Indicates whether the view model was reset.
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
 * @param {boolean} haveViewModelReset - Indicates whether to reset the view model.
 */
function close(haveViewModelReset?: boolean) {
    if (haveViewModelReset === true) {
        resetViewModel()
    }

    if (hasChanges.value) {
        emit('close-and-navigate-to-storefront')
    } else {
        emit('close')
    }
}
</script>
