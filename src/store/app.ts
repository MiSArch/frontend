import { UserRole, parseRoleName } from './userRole'
import { useClient } from '@/graphql/client'
import { GetCurrentUserQuery } from '@/graphql/generated'
import { ShoppingCart } from '@/model/shoppingCart'
import { ShoppingCartItem } from '@/model/shoppingCartItem'
import { errorMessages } from '@/strings/errorMessages'
import {
    awaitActionAndPushErrorIfNecessary,
    doActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'

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
        /**
         * Checks if the shopping cart is enabled for the current user.
         *
         * @returns True if the shopping cart is enabled, false otherwise.
         */
        shoppingCartIsEnabled(): boolean {
            return this.isLoggedIn && this.activeUserRoleIsBuyer
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
                await this.setCurrentUserId()

                this.setUserRolesOfCurrentUser()

                this.activeUserRole = this.highestUserRoleOfCurrentUser

                if (this.shoppingCartIsEnabled) {
                    await this.restoreShoppingCartOfCurrentUser()
                }
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
         * Asynchronously retrieves the shopping cart of the current user.
         *
         * @returns A promise that resolves to true if the shopping cart was successfully restored, false otherwise.
         */
        async restoreShoppingCartOfCurrentUser(): Promise<boolean> {
            if (this.currentUserId != undefined) {
                const getShoppingCartOfUserQuery =
                    await awaitActionAndPushErrorIfNecessary(() => {
                        return useClient().getShoppingCartOfUser({
                            id: this.currentUserId,
                        })
                    }, errorMessages.restoreShoppingCartOfUser)

                const shoppingCartOfCurrentUser =
                    getShoppingCartOfUserQuery.user.shoppingcart
                this.shoppingCart.lastUpdatedAt =
                    shoppingCartOfCurrentUser.lastUpdatedAt
                this.shoppingCart.items = []

                shoppingCartOfCurrentUser.shoppingcartItems.nodes.forEach(
                    (shoppingCartItem) => {
                        const item: ShoppingCartItem = {
                            id: shoppingCartItem.id,
                            count: shoppingCartItem.count,
                            addedAt: shoppingCartItem.addedAt,
                            productVariantId:
                                shoppingCartItem.productVariant.id,
                        }

                        this.shoppingCart.items.push(item)
                    }
                )

                return true
            }

            return false
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
        /**
         * Asynchronously adds a product variant to the shopping cart.
         * If the product has already been added to the cart
         * then it updates the count:
         * It simply adds the specified count on top of the existing count.
         *
         * @param productVariantId - The ID of the product variant to add.
         * @param count - The quantity of the product variant to add.
         */
        async addProductVariantToShoppingCart(
            productVariantId: string,
            count: number
        ) {
            if (!this.shoppingCartIsEnabled) {
                return
            }

            if (count <= 0) {
                return
            }

            let nameOfProductVariant: string

            const existingShoppingCartItems = this.shoppingCart.items.filter(
                (item) => item.productVariantId === productVariantId
            )
            if (existingShoppingCartItems.length >= 1) {
                const newShoppingCartItem = (
                    await awaitActionAndPushErrorIfNecessary(() => {
                        return useClient().updateShoppingcartItem({
                            input: {
                                id: existingShoppingCartItems[0].id,
                                count:
                                    existingShoppingCartItems[0].count + count,
                            },
                        })
                    }, errorMessages.addItemToShoppingCart)
                ).updateShoppingcartItem

                nameOfProductVariant =
                    newShoppingCartItem.productVariant.currentVersion.name
            } else {
                const newShoppingCartItem = (
                    await awaitActionAndPushErrorIfNecessary(() => {
                        return useClient().addItemToShoppingCart({
                            input: {
                                id: this.currentUserId,
                                shoppingCartItem: {
                                    count: count,
                                    productVariantId: productVariantId,
                                },
                            },
                        })
                    }, errorMessages.addItemToShoppingCart)
                ).addShoppingcartItem

                nameOfProductVariant =
                    newShoppingCartItem.productVariant.currentVersion.name
            }

            const timeOrTimes = count == 1 ? 'time' : 'times'
            const textOfSuccessNotification =
                nameOfProductVariant +
                ' was added to the shopping cart ' +
                count +
                ' ' +
                timeOrTimes +
                '.'
            const successNotification: Notification = {
                text: textOfSuccessNotification,
                type: 'success',
                density: 'comfortable',
            }

            this.pushNotification(successNotification)

            await this.restoreShoppingCartOfCurrentUser()
        },
    },
})
