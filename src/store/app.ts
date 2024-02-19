import { useClient } from '@/graphql/client'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'

/**
 * The user roles of the Keycloak realm 
 * that are relevant to the frontend.
 */
export enum UserRole {
    Buyer = 'Buyer',
    Employee = 'Employee',
    SiteAdmin = 'Administrator',
}

export const useAppStore = defineStore('app', {
    state: () => ({
        keycloak: null as Keycloak | null,
        isLoggedIn: false,
        currentUserId: null as string | null | undefined,
        userRolesOfCurrentUser: [UserRole.Buyer],
        activeUserRole: UserRole.Buyer,
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
         * Additionally, this method gets the user roles of 
         * the logged in user and saves them in the store. 
         * The 'highest' user role becomes the active user role.
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
                try {
                    const currentUser = await useClient().getCurrentUser()
                    this.currentUserId = currentUser.currentUser?.id
                } catch (error) {
                    console.error('Failed to get the user and determine their user ID:', error)
                }

                try {
                    const keycloakRealmAccess = keycloak.realmAccess
                    if (keycloakRealmAccess === null || keycloakRealmAccess === undefined) {
                        throw new Error('The property realmAccess of the initialized Keycloak instance is either null or undefined.')
                    }
                    else {
                        const roles = keycloak.realmAccess?.roles
                        if (roles === undefined) {
                            return
                        } else {
                            var additionalUserRoles: UserRole[] = []
                            if (roles.includes(UserRole.Employee.toLowerCase())) {
                                additionalUserRoles.push(UserRole.Employee)
                                this.activeUserRole = UserRole.Employee
                            }
                            if (roles.includes(UserRole.SiteAdmin.toLowerCase())) {
                                additionalUserRoles.push(UserRole.SiteAdmin)
                                this.activeUserRole = UserRole.SiteAdmin
                            }

                            this.userRolesOfCurrentUser.push(...additionalUserRoles)

                            console.log(this.userRolesOfCurrentUser)
                            console.log('Active user role:', this.activeUserRole)
                        }
                    }
                } catch (error) {
                    console.error('Failed to determine the roles of the user:', error)
                }
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
         * Resets the user roles of the current user to the default role 'Buyer'.
         */
        async logout() {
            try {
                this.currentUserId = null

                await this.keycloak?.logout({
                    redirectUri: '/',
                })

                this.userRolesOfCurrentUser = [UserRole.Buyer]
                this.activeUserRole = UserRole.Buyer
            } catch (error) {
                console.error('Failed to logout:', error)
            }
        },
    },
})
