// Utilities
import Keycloak from 'keycloak-js'
import { defineStore } from 'pinia'
import silentCheckSsoHtmlUrl from '@/assets/silent-check-sso.html?url'

export const useAppStore = defineStore('app', {
    state: () => ({
        keycloak: null as Keycloak | null,
        isLoggedIn: false,
    }),
    actions: {
        /**
         * Initialize the Keycloak adapter.
         * Also silently checks the SSO session.
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
         */
        async logout() {
            try {
                await this.keycloak?.logout({
                    redirectUri: '/',
                })
            } catch (error) {
                console.error('Failed to logout:', error)
            }
        },
    },
})
