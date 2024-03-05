/**
 * Represents a single item in a shopping cart.
 *
 * @interface
 */
export interface ShoppingCartItem {
    id: string
    count: number
    addedAt: string
    productVariantId: string
    productId: string
    nameOfProductVariant: string
    retailPrice: number
}
