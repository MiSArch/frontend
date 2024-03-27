import { Address } from './Address'
import { PaymentInformation } from './PaymentInformation'
import { ShipmentMethod } from './ShipmentMethod'

/**
 * Interface representing information required to make an order.
 * @interface
 * @property [deliveryAddress] - The delivery address for the order.
 * @property [billingAddress] - The billing address for the order.
 * @property [shipmentMethod] - The shipment method for the delivery of the order.
 * @property [paymentInformation] - The payment information for the order.
 */
export interface OrderInformation {
    deliveryAddress?: Address
    billingAddress?: Address
    shipmentMethod?: ShipmentMethod
    paymentInformation?: PaymentInformation
}
