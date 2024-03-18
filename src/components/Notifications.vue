<template>
    <v-bottom-sheet
        max-height="40%"
        :model-value="hasAnyPushedNotificationsThatShouldBeVisible"
    >
        <v-card>
            <v-card-item>
                <v-card-title>Notifications</v-card-title>
            </v-card-item>
            <v-card-text>
                <div class="h-auto d-flex flex-column align-stretch ga-2">
                    <v-alert
                        v-for="notification in pushedNotifications"
                        :closable="notification.closable"
                        :density="notification.density"
                        :text="notification.text"
                        :title="notification.title"
                        :type="notification.type"
                        v-model="notification.shouldBeVisible"
                    ></v-alert>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    prepend-icon="mdi-close"
                    @click="closeAllPushedNotifications"
                    >Close All</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { Notification, useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'

/**
 * Interface representing an alert to be displayed.
 *
 * @property shouldBeVisible - Indicates whether the alert should be visible.
 * @property text - The main text content of the alert.
 * @property closable - Indicates whether the alert is closable.
 * @property [title] - Optional title for the alert.
 * @property [type] - Type of alert (success, info, warning, error).
 * @property [density] - Density of the alert (default, comfortable, compact).
 */
interface Alert {
    shouldBeVisible: boolean
    text: string
    closable: boolean
    title?: string
    type?: 'success' | 'info' | 'warning' | 'error'
    density?: 'default' | 'comfortable' | 'compact'
}

const store = useAppStore()
const { queuedNotifications } = storeToRefs(store)

/**
 * The latest batch of notifications that had been shown to the user.
 */
const pushedNotifications = ref<Alert[]>([])

/**
 * Whether or not there is any pushed notification that should be visible to the user.
 */
const hasAnyPushedNotificationsThatShouldBeVisible = computed(() => {
    return (
        pushedNotifications.value.filter(
            (pushedNotification) => pushedNotification.shouldBeVisible === true
        ).length >= 1
    )
})

watch(
    () => queuedNotifications.value,
    async () => {
        await nextTick()
        pushNotifications()
    }
)

/**
 * Pops the app store's notification queue and
 * pushes the notification to the user.
 */
function pushNotifications() {
    const snapshotOfQueuedNotifications = queuedNotifications.value

    if (snapshotOfQueuedNotifications.length === 0) {
        return
    }

    pushedNotifications.value = [
        ...pushedNotifications.value.filter(
            (notification) => notification.shouldBeVisible
        ),
        ...store.popAllNotifications().map(convertNotificationToAlert),
    ]
}

/**
 * Converts a notification into an alert.
 * @param notification The notification to convert into an alert.
 */
function convertNotificationToAlert(notification: Notification): Alert {
    return {
        shouldBeVisible: true,
        text: notification.text,
        closable: notification.closable ?? true,
        title: notification.title,
        type: notification.type,
        density: notification.density,
    }
}

/**
 * Closes all pushed notifications by setting the 'shouldBeVisible' property
 * of the individual Alert instances to false.
 */
function closeAllPushedNotifications() {
    pushedNotifications.value.forEach(
        (pushedNotification) => (pushedNotification.shouldBeVisible = false)
    )
}
</script>
