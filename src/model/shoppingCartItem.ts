/**
 * Interface representing a shopping cart item.
 * @interface
 * @property id - The unique identifier of the shopping cart item.
 * @property count - The quantity of the product variant in the shopping cart.
 * @property addedAt - The timestamp when the item was added to the shopping cart.
 * @property productVariantId - The unique identifier of the product variant associated with the item.
 * @property productId - The unique identifier of the product associated with the item.
 * @property nameOfProductVariant - The name of the product variant.
 * @property retailPrice - The retail price of the product variant.
 * @property productVariantVersionId - The unique identifier of the product variant version associated with the item.
 */
export interface ShoppingCartItem {
    id: string
    count: number
    addedAt: string
    productVariantId: string
    productId: string
    nameOfProductVariant: string
    retailPrice: number
    productVariantVersionId: string
}
