import { ShoppingCartItem } from '../shoppingCartItem'
import { ShipmentMethod } from './ShipmentMethod'

/**
 * Interface representing an item of an order.
 * @interface
 * @property shoppingCartItem - The shopping cart item associated with the order item.
 * @property [shipmentMethod] - The shipment method associated with the order item.
 */
export interface OrderItem {
    shoppingCartItem: ShoppingCartItem
    shipmentMethod?: ShipmentMethod
}
