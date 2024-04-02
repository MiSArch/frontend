import { OrderItem } from '../interfaces/orderItem'
import { ShipmentMethod } from '../interfaces/ShipmentMethod'
import { ShoppingCartItem } from '../shoppingCartItem'

/**
 * Class representing an item of an order.
 * @implements {OrderItem}
 */
export class OrderItemImpl implements OrderItem {
    /**
     * Creates an instance of OrderItemImpl.
     * @param shoppingCartItem - The shopping cart item associated with the order item.
     * @param [shipmentMethod] - The shipment method associated with the order item.
     */
    constructor(
        public shoppingCartItem: ShoppingCartItem,
        public shipmentMethod?: ShipmentMethod
    ) {}
}
