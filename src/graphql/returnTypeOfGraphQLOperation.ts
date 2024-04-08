import { Client } from './client'

/**
 * Type representing the return type of a specific GraphQL operation.
 * The GraphQL operation must be available to the GraphQL client.
 */
export type ReturnTypeOfGraphQLOperation<T extends keyof Client> = Awaited<
    ReturnType<Client[T]>
>
