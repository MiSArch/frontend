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
     * @param [shippingFees] - The shipping fees calculated for the order item.
     */
    constructor(
        public shoppingCartItem: ShoppingCartItem,
        public shipmentMethod?: ShipmentMethod,
        public shippingFees?: number
    ) {}

    /**
     * Calculates the total cost of the order item including shipping fees.
     *
     * This function computes the total cost of the order item by multiplying its retail price
     * by the quantity, then adding any applicable shipping fees.
     *
     * @returns The total cost including shipping fees.
     */
    calculateTotalCost(): number {
        const costWithoutShippingFees =
            this.shoppingCartItem.retailPrice * this.shoppingCartItem.count
        const shippingFees = this.shippingFees ?? 0
        return costWithoutShippingFees + shippingFees
    }
}
