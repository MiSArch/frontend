import { useClient } from '@/graphql/client'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'
import { GetCurrentUserQuery } from '@/graphql/generated'
import { UserRole, parseKeycloakRoleName } from './userRole'

const defaultUserRole = UserRole.Customer
const initialUserRolesOfCurrentUser = [defaultUserRole]

export const useAppStore = defineStore('app', {
    state: () => ({
        keycloak: null as Keycloak | null,
        isLoggedIn: false,
        currentUserId: null as string | null | undefined,
        userRolesOfCurrentUser: initialUserRolesOfCurrentUser,
        activeUserRole: defaultUserRole,
    }),
    getters: {
        token(): string | undefined {
            if (this.isLoggedIn) {
                return this.keycloak?.token
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
         * Checks if the active user role is UserRole.Customer.
         *
         * @returns A boolean indicating whether the active user role is UserRole.Customer.
         */
        activeUserRoleIsCustomer(): boolean {
            return this.activeUserRole === UserRole.Customer
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
         * Retrieves the current user.
         *
         * @returns A promise that resolves with the current user information or null if:
         *     a) the user information is not of type 'User' or
         *     b) the retrieval failed with an error.
         */
        async getCurrentUser(): Promise<GetCurrentUserQuery | null> {
            try {
                const currentUser = await useClient().getCurrentUser()
                if (currentUser.currentUser?.__typename === 'User') {
                    return currentUser
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
         * @returns A promise that resolves with a boolean indicating whether
         * the current user ID was successfully set (true) or not (false).
         */
        async setCurrentUserId(): Promise<boolean> {
            const currentUser = await this.getCurrentUser()
            if (
                currentUser !== null &&
                currentUser.currentUser?.__typename === 'User'
            ) {
                this.currentUserId = currentUser.currentUser.id

                return (
                    this.currentUserId !== null &&
                    this.currentUserId !== undefined
                )
            } else {
                this.currentUserId = null

                return false
            }
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
                    realmAccess.roles.forEach((userRoleComingFromKeycloak) => {
                        if (
                            userRoleComingFromKeycloak !== null &&
                            userRoleComingFromKeycloak !== undefined
                        ) {
                            const candidate = parseKeycloakRoleName(
                                userRoleComingFromKeycloak
                            )
                            if (
                                candidate !== null &&
                                candidate !== defaultUserRole
                            ) {
                                this.userRolesOfCurrentUser.push(candidate)
                            }
                        }
                    })

                    return true
                } else {
                    return false
                }
            } else {
                this.userRolesOfCurrentUser = [UserRole.Customer]

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
         * this action resets the ID of the current user
         * stored in store.currentUserId to null to prevent the ID from being leaked.
         * Resets the user roles of the current user to the default role 'Customer'.
         */
        async logout() {
            try {
                this.currentUserId = null

                await this.keycloak?.logout({
                    redirectUri: '/',
                })

                this.userRolesOfCurrentUser = initialUserRolesOfCurrentUser
                this.activeUserRole = defaultUserRole
            } catch (error) {
                console.error('Failed to logout:', error)
            }
        },
    },
})
