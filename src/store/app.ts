import { useClient } from '@/graphql/client'

// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'

export const useAppStore = defineStore('app', {
    state: () => ({
        keycloak: null as Keycloak | null,
        isLoggedIn: false,
        currentUserId: null as string | null | undefined,
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
    },
})
