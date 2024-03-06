import { ShoppingCartItem } from './shoppingCartItem'

/**
 * Interface representing a shopping cart.
 * @interface
 * @property lastUpdatedAt - The timestamp of the last update to the shopping cart, or null if no update has occurred.
 * @property items - An array of shopping cart items.
 */
export interface ShoppingCart {
    lastUpdatedAt: string | null
    items: ShoppingCartItem[]
}
