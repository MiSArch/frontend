import { GraphQLClient, RequestMiddleware } from 'graphql-request'
import { getSdk } from './generated'
import { useAppStore } from '@/store/app'

/**
 * Type simply representing the return type of the useClient function.
 */
export type Client = ReturnType<typeof useClient>

/**
 * Gets the GraphQL client to use for all GraphQL requests.
 *
 * @returns The GraphQL client.
 */
export function useClient() {
    const store = useAppStore()

    const requestMiddleware: RequestMiddleware = async (request) => {
        const token = store.token
        const headers: HeadersInit & { Authorization?: string } = {
            ...request.headers,
        }
        if (token != undefined) {
            headers.Authorization = `Bearer ${await store.getAccessToken(true)}`
        }
        return {
            ...request,
            headers,
        }
    }

    const client = new GraphQLClient('/api/graphql', {
        requestMiddleware,
    })

    return getSdk(client)
}
