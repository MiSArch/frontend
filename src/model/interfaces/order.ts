import { Address } from './Address'
import { OrderItem } from './orderItem'
import { PaymentInformation } from './PaymentInformation'

/**
 * Interface representing an order.
 * @interface
 * @property [items] - The items that make up the order.
 * @property [deliveryAddress] - The delivery address for the order.
 * @property [billingAddress] - The billing address for the order.
 * @property [paymentInformation] - The payment information for the order.
 * @property [vatNumber] - The VAT number.
 * @method calculateTotalCost - Calculates the total cost of the order.
 */
export interface Order {
    items?: OrderItem[]
    deliveryAddress?: Address
    billingAddress?: Address
    paymentInformation?: PaymentInformation
    vatNumber?: string
    calculateTotalCost(): number
}
