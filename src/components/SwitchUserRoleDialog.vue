<template>
    <v-dialog max-width="500" persistent>
        <v-card>
            <v-card-item>
                <v-card-title>Switch User Role</v-card-title>
                <v-card-subtitle
                    >TODO Explain the purpose of this dialog to the
                    user</v-card-subtitle
                >
            </v-card-item>
            <v-card-text>
                <v-select
                    :items="userRolesOfCurrentUser"
                    hint="The active user role determines the current application context."
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
