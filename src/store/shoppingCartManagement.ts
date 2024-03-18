import { useClient } from '@/graphql/client'
import {
    AddShoppingCartItemInput,
    GetShoppingCartOfUserQuery,
    UpdateShoppingCartItemInput,
} from '@/graphql/generated'
import { ShoppingCart } from '@/model/shoppingCart'
import { ShoppingCartItem } from '@/model/shoppingCartItem'
import { errorMessages } from '@/strings/errorMessages'
import { awaitActionAndPushErrorIfNecessary } from '@/util/errorHandler'

/**
 * An empty shopping cart instance.
 */
export const emptyShoppingCart: ShoppingCart = {
    lastUpdatedAt: null,
    items: [],
}

/**
 * Asynchronously retrieves the shopping cart of a user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the shopping cart query result.
 */
export async function getShoppingCartOfUser(
    userId: string
): Promise<GetShoppingCartOfUserQuery> {
    return await awaitActionAndPushErrorIfNecessary(() => {
        return useClient().getShoppingCartOfUser({
            id: userId,
        })
    }, errorMessages.getShoppingCartOfUser)
}

/**
 * Extracts a ShoppingCart instance from a query result.
 * @param getShoppingCartOfUserQuery - The query result containing the shopping cart information.
 * @returns The ShoppingCart instance representing the shopping cart from the query result.
 */
export function extractShoppingCartInstanceFromQuery(
    getShoppingCartOfUserQuery: GetShoppingCartOfUserQuery
): ShoppingCart {
    const shoppingCart = getShoppingCartOfUserQuery.user.shoppingcart
    const items: ShoppingCartItem[] = []
    shoppingCart.shoppingcartItems.nodes.forEach((item) => {
        items.push({
            id: item.id,
            count: item.count,
            addedAt: item.addedAt,
            productVariantId: item.productVariant.id,
            productId: item.productVariant.product.id,
            nameOfProductVariant: item.productVariant.currentVersion.name,
            retailPrice: item.productVariant.currentVersion.retailPrice,
        })
    })

    return {
        lastUpdatedAt: shoppingCart.lastUpdatedAt,
        items: items,
    }
}

/**
 * Asynchronously adds an item to the shopping cart.
 * @param input - The input data for adding an item to the shopping cart.
 * @returns A promise that resolves to the item that has been added to the shopping cart.
 */
export async function addItemToShoppingCart(input: AddShoppingCartItemInput) {
    return await awaitActionAndPushErrorIfNecessary(() => {
        return useClient().addItemToShoppingCart({
            input: input,
        })
    }, errorMessages.addItemToShoppingCart)
}

/**
 * Asynchronously updates a shopping cart item.
 * @param input - The input data for updating a shopping cart item.
 * @returns A promise that resolves to the item that has just been updated.
 */
export async function updateShoppingCartItem(
    input: UpdateShoppingCartItemInput
) {
    return await awaitActionAndPushErrorIfNecessary(() => {
        return useClient().updateShoppingcartItem({
            input: input,
        })
    }, errorMessages.updateShoppingCartItem)
}
