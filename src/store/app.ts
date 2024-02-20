import { useClient } from '@/graphql/client'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'

/**
 * Interface representing a notification to be displayed.
 *
 * @property text - The main text content of the notification.
 * @property [title] - Optional title for the notification.
 * @property [type] - Type of notification (success, info, warning, error).
 * @property [density] - Density of the notification (default, comfortable, compact).
 * @property [closable] - Indicates whether the notification is closable.
 */
export interface Notification {
    text: string
    title?: string
    type?: 'success' | 'info' | 'warning' | 'error'
    density?: 'default' | 'comfortable' | 'compact'
    closable?: boolean
}

export const useAppStore = defineStore('app', {
    state: () => ({
        keycloak: null as Keycloak | null,
        isLoggedIn: false,
        currentUserId: null as string | null | undefined,
        queuedNotifications: [] as Notification[],
    }),
    getters: {
        token(): string | undefined {
            if (this.isLoggedIn) {
                return this.keycloak?.token
            } else {
                return undefined
            }
        },
    },
    actions: {
        /**
         * Initialize the Keycloak adapter.
         * Also silently checks the SSO session.
         * If the user is logged in,
         * this action gets the current user and
         * then stores its ID in store.currentUserId.
         */
        async initLogin() {
            const keycloak = new Keycloak({
                url: '/keycloak',
                realm: 'Misarch',
                clientId: 'frontend',
            })

            try {
                await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: silentCheckSsoHtmlUrl,
                    redirectUri: '/',
                })
                this.keycloak = keycloak
                this.isLoggedIn = keycloak.authenticated ?? false
                if (this.isLoggedIn) {
                    const currentUser = await useClient().getCurrentUser()
                    this.currentUserId = currentUser.currentUser?.id
                }
                console.log('Token', keycloak.token)
            } catch (error) {
                console.error('Failed to initialize adapter:', error)
            }
        },
        /**
         * Logs the user in.
         */
        async login() {
            try {
                await this.keycloak?.login({
                    redirectUri: '/',
                })
            } catch (error) {
                console.error('Failed to login:', error)
            }
        },
        /**
         * Logs the user out.
         * Before the user is actually logged out,
         * this action resets the ID of the current user
         * stored in store.currentUserId to null to prevent the ID from being leaked.
         */
        async logout() {
            try {
                this.currentUserId = null

                await this.keycloak?.logout({
                    redirectUri: '/',
                })
            } catch (error) {
                console.error('Failed to logout:', error)
            }
        },
        /**
         * Adds the given notification to the notification queue.
         * @param notification The notification to add to the queue.
         */
        pushNotification(notification: Notification) {
            this.queuedNotifications = [
                ...this.queuedNotifications,
                notification,
            ]
        },
        /**
         * Pops all of the currently queued notifications.
         * @returns A snapshot of the currently queued notifications, right before the queue gets emptied.
         */
        popAllNotifications(): Notification[] {
            return this.queuedNotifications.splice(0)
        },
    },
})
