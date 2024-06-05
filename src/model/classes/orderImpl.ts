import { Address } from '../interfaces/address'
import { Order } from '../interfaces/order'
import { OrderItem } from '../interfaces/orderItem'
import { PaymentInformation } from '../interfaces/PaymentInformation'

/**
 * Class representing information required to make an order.
 * @implements {Order}
 */
export class OrderImpl implements Order {
    /**
     * Creates an instance of OrderInformationImpl.
     * @param hasBeenPlaced - Whether the order has been placed or not.
     * @param [items] - The items that make up the order.
     * @param [deliveryAddress] - The delivery address for the order.
     * @param [billingAddress] - The billing address for the order.
     * @param [paymentInformation] - The payment information for the order.
     * @param [creditCardValidationCode] - If the payment method is credit card, the CVC of the chosen credit card.
     * @param [vatNumber] - The VAT number.
     */
    constructor(
        public hasBeenPlaced: boolean,
        public items?: OrderItem[],
        public deliveryAddress?: Address,
        public billingAddress?: Address,
        public paymentInformation?: PaymentInformation,
        public creditCardValidationCode?: string,
        public vatNumber?: string
    ) {}

    /**
     * Calculates the total cost of the order.
     *
     * This function computes the total cost of the order by summing up the total cost of each item.
     *
     * @returns The total cost of the order.
     */
    calculateTotalCost(): number {
        const totalCostOfEachItem: number[] =
            this.items?.map((orderItem) => orderItem.calculateTotalCost()) ?? []
        const sumOfTotalCostOfEachItem: number = totalCostOfEachItem.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        )
        return sumOfTotalCostOfEachItem
    }
}
