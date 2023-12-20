import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated'

/**
 * Gets the GraphQL client to use for all GraphQL requests.
 *
 * @returns The GraphQL client.
 */
export function useClient() {
    const client = new GraphQLClient('/api')
    return getSdk(client)
}
