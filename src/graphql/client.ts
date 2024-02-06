import { GraphQLClient, RequestMiddleware } from 'graphql-request'
import { getSdk } from './generated'
import { useAppStore } from '@/store/app'

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
            headers.Authorization = `Bearer ${store.token}`
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
