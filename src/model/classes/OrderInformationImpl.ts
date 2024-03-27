import { Address } from '../interfaces/Address'
import { OrderInformation } from '../interfaces/OrderInformation'
import { PaymentInformation } from '../interfaces/PaymentInformation'
import { ShipmentMethod } from '../interfaces/ShipmentMethod'

/**
 * Class representing information required to make an order.
 * @implements {OrderInformation}
 */
export class OrderInformationImpl implements OrderInformation {
    /**
     * Creates an instance of OrderInformationImpl.
     * @param [deliveryAddress] - The delivery address for the order.
     * @param [billingAddress] - The billing address for the order.
     * @param [shipmentMethod] - The shipment method for the delivery of the order.
     * @param [paymentInformation] - The payment information for the order.
     */
    constructor(
        public deliveryAddress?: Address,
        public billingAddress?: Address,
        public shipmentMethod?: ShipmentMethod,
        public paymentInformation?: PaymentInformation
    ) {}
}
