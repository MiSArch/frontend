import { UserRole, parseRoleName } from './userRole'
import { useClient } from '@/graphql/client'
import { GetCurrentUserQuery } from '@/graphql/generated'
import { ShoppingCart } from '@/model/shoppingCart'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'
import {
    awaitActionAndPushErrorIfNecessary,
    doActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'
import { errorMessages } from '@/strings/errorMessages'

const defaultUserRole = UserRole.Buyer
const initialUserRolesOfCurrentUser = [defaultUserRole]

const emptyShoppingCart: ShoppingCart = {
    lastUpdatedAt: null,
    items: [],
}

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
        userRolesOfCurrentUser: initialUserRolesOfCurrentUser,
        activeUserRole: defaultUserRole,
        queuedNotifications: [] as Notification[],
        shoppingCart: emptyShoppingCart,
    }),
    getters: {
        token(): string | undefined {
            if (this.keycloak !== null && this.isLoggedIn) {
                return this.keycloak.token
            } else {
                return undefined
            }
        },
        /**
         * Checks if the current user has more than one user role.
         *
         * @returns A boolean indicating whether the current user has more than one user role.
         */
        currenUserHasMoreThanOneRole(): boolean {
            return this.userRolesOfCurrentUser.length > 1
        },
        /**
         * Gets the highest user role of the current user based on their assigned roles.
         * The order of precedence is Admin > Employee > defaultUserRole.
         *
         * @returns The highest user role of the current user.
         */
        highestUserRoleOfCurrentUser(): UserRole {
            if (this.userRolesOfCurrentUser.includes(UserRole.Admin)) {
                return UserRole.Admin
            }

            if (this.userRolesOfCurrentUser.includes(UserRole.Employee)) {
                return UserRole.Employee
            }

            return defaultUserRole
        },
        /**
         * Checks if the active user role is UserRole.Buyer.
         *
         * @returns A boolean indicating whether the active user role is UserRole.Buyer.
         */
        activeUserRoleIsBuyer(): boolean {
            return this.activeUserRole === UserRole.Buyer
        },
        /**
         * Checks if the active user role is either UserRole.Admin or UserRole.Employee.
         *
         * @returns A boolean indicating whether the active user role is either Admin or Employee.
         */
        activeUserRoleIsEitherAdminOrEmployee(): boolean {
            return (
                this.activeUserRole === UserRole.Admin ||
                this.activeUserRole === UserRole.Employee
            )
        },
    },
    actions: {
        /**
         * Initializes the Keycloak adapter and
         * silently checks the SSO session.
         * If the user is logged in:
         *     - The ID of the current user gets stored,
         *     - the user roles of the current user get stored, and
         *     - the highest user role of the current user becomes the active user role.
         *
         * @param logToken - If true, logs the Keycloak token to the console.
         * @returns A promise that resolves after the initialization is complete.
         */
        async initLogin(logToken?: boolean) {
            const keycloak = new Keycloak({
                url: '/keycloak',
                realm: 'Misarch',
                clientId: 'frontend',
            })

            try {
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: silentCheckSsoHtmlUrl,
                    redirectUri: '/',
                })

                this.keycloak = keycloak
                this.isLoggedIn = authenticated

                if (logToken === true) {
                    console.log('Token', keycloak.token)
                }
            } catch (error) {
                console.error('Failed to initialize adapter:', error)
            }

            if (this.isLoggedIn) {
                this.setCurrentUserId()

                this.setUserRolesOfCurrentUser()

                this.activeUserRole = this.highestUserRoleOfCurrentUser
            }
        },
        /**
         * Asynchronously retrieves the current user.
         *
         * @returns A promise that resolves to the current user or null if an error occurs.
         */
        async getCurrentUser(): Promise<GetCurrentUserQuery | null> {
            try {
                const getCurrentUserQuery = await useClient().getCurrentUser()
                const currentUser = getCurrentUserQuery.currentUser
                if (currentUser != undefined) {
                    return getCurrentUserQuery
                } else {
                    return null
                }
            } catch (error) {
                console.error('Failed to get the current user:', error)

                return null
            }
        },
        /**
         * Sets the current user ID based on the retrieved user information.
         *
         * @returns A promise that resolves to true if the current user ID was successfully set, false otherwise.
         */
        async setCurrentUserId(): Promise<boolean> {
            this.currentUserId = null

            const getCurrentUserQuery = await this.getCurrentUser()
            if (getCurrentUserQuery !== null) {
                const currentUser = getCurrentUserQuery.currentUser
                if (currentUser != undefined) {
                    this.currentUserId = currentUser.id
                }
            }

            return this.currentUserId != undefined
        },
        /**
         * Sets the user roles of the current user based on the roles retrieved from Keycloak.
         *
         * @returns {boolean} A boolean indicating whether the user roles were successfully set (true) or not (false).
         */
        setUserRolesOfCurrentUser(): boolean {
            if (this.keycloak !== null) {
                const realmAccess = this.keycloak.realmAccess
                if (realmAccess !== undefined) {
                    realmAccess.roles.forEach((roleName) => {
                        if (roleName !== null && roleName !== undefined) {
                            const possibleUserRoleOfCurrentUser =
                                parseRoleName(roleName)
                            if (
                                possibleUserRoleOfCurrentUser !== null &&
                                possibleUserRoleOfCurrentUser !==
                                    defaultUserRole
                            ) {
                                this.userRolesOfCurrentUser.push(
                                    possibleUserRoleOfCurrentUser
                                )
                            }
                        }
                    })

                    return true
                } else {
                    return false
                }
            } else {
                this.userRolesOfCurrentUser = [UserRole.Buyer]

                return false
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
         * this action resets the state related to the current user.
         */
        async logout() {
            await awaitActionAndPushErrorIfNecessary(() => {
                if (this.keycloak != undefined) {
                    return this.keycloak.logout({
                        redirectUri: '/',
                    })
                } else {
                    return Promise.resolve()
                }
            }, errorMessages.logout)

            this.resetStateRelatedToUser()
        },
        /**
         * Resets the state related to the current user.
         */
        resetStateRelatedToUser() {
            doActionAndPushErrorIfNecessary(() => {
                this.isLoggedIn = false
                this.currentUserId = null
                this.userRolesOfCurrentUser = initialUserRolesOfCurrentUser
                this.activeUserRole = defaultUserRole
                this.shoppingCart = emptyShoppingCart
            }, errorMessages.resetStateRelatedToUser)
        },
        /**
         * Refreshes the access token using the provided Keycloak instance.
         *
         * @param keycloak - The Keycloak instance used to refresh (update) the access token.
         * @returns A promise that resolves with a boolean indicating whether the token was refreshed.
         * @throws Throws an error if keycloak is null or undefined or if the token refresh fails.
         */
        async refreshAccessToken(keycloak: Keycloak): Promise<boolean> {
            if (keycloak === null || keycloak === undefined) {
                throw new Error('keycloak cannot be null or undefined')
            }

            try {
                const refreshed = await keycloak.updateToken(5)
                console.log(
                    refreshed ? 'Token was refreshed' : 'Token is still valid'
                )
                return refreshed
            } catch (error) {
                console.error('Failed to refresh the token:', error)
                throw error
            }
        },
        /**
         * Retrieves the access token. Optionally, refreshes the access token beforehand if specified.
         *
         * @param [refreshTheAccessTokenBeforehand=false] - Optional. If true, refreshes the access token before retrieval.
         * @returns A promise that resolves with the access token or null if the token is undefined.
         */
        async getAccessToken(
            refreshTheAccessTokenBeforehand?: boolean
        ): Promise<string | null> {
            if (this.token === undefined) {
                return null
            }

            if (
                refreshTheAccessTokenBeforehand === true &&
                this.keycloak !== null
            ) {
                await this.refreshAccessToken(this.keycloak)
            }

            return this.token
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
