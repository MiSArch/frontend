import { Address } from './Address'

/**
 * Interface representing information required to make an order.
 * @interface
 * @property [billingAddress] - The billing address for the order.
 * @property [deliveryAddress] - The delivery address for the order.
 */
export interface OrderInformation {
    billingAddress?: Address
    deliveryAddress?: Address
}
