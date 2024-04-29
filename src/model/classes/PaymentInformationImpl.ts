import { PaymentMethod } from '../enums/paymentMethod'
import { PaymentInformation } from '../interfaces/PaymentInformation'

/**
 * Class representing an implementation of payment information.
 * @implements {PaymentInformation}
 */
export class PaymentInformationImpl implements PaymentInformation {
    /**
     * Creates an instance of PaymentInformationImpl.
     * @param id - The identifier of the payment information.
     * @param paymentMethod - The payment method.
     * @param [publicMethodDetails] - Public details associated with the payment method.
     * @param [secretMethodDetails] - Secret details associated with the payment method.
     */
    constructor(
        public id: string,
        public paymentMethod: PaymentMethod,
        public publicMethodDetails?: object,
        public secretMethodDetails?: object
    ) {}
}
