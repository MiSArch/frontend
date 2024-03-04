import { ShoppingCartItem } from './shoppingCartItem'

/**
 * Represents s shopping cart containing various items.
 * @interface
 */
export interface ShoppingCart {
    lastUpdatedAt: string | null
    items: ShoppingCartItem[]
}
