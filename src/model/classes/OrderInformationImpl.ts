import { Address } from '../interfaces/Address'
import { OrderInformation } from '../interfaces/OrderInformation'

/**
 * Class representing information required to make an order.
 * @implements {OrderInformation}
 */
export class OrderInformationImpl implements OrderInformation {
    /**
     * Creates an instance of OrderInformationImpl.
     * @param [billingAddress] - The billing address for the order.
     * @param [deliveryAddress] - The delivery address for the order.
     */
    constructor(
        public billingAddress?: Address,
        public deliveryAddress?: Address
    ) {}
}
