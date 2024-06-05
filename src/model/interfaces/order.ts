import { Address } from './address'
import { OrderItem } from './orderItem'
import { PaymentInformation } from './PaymentInformation'

/**
 * Interface representing an order.
 * @interface
 * @property hasBeenPlaced - Whether the order has been placed or not.
 * @property [items] - The items that make up the order.
 * @property [deliveryAddress] - The delivery address for the order.
 * @property [billingAddress] - The billing address for the order.
 * @property [paymentInformation] - The payment information for the order.
 * @property [creditCardValidationCode] - If the payment method is credit card, the CVC of the chosen credit card.
 * @property [vatNumber] - The VAT number.
 * @method calculateTotalCost - Calculates the total cost of the order.
 */
export interface Order {
    hasBeenPlaced: boolean
    items?: OrderItem[]
    deliveryAddress?: Address
    billingAddress?: Address
    paymentInformation?: PaymentInformation
    creditCardValidationCode?: string
    vatNumber?: string
    calculateTotalCost(): number
}
