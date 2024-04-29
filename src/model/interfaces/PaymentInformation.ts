import { PaymentMethod } from '../enums/paymentMethod'

/**
 * Interface representing payment information.
 * @interface
 * @property id - The identifier of the payment information.
 * @property paymentMethod - The payment method.
 * @property [publicMethodDetails] - Public details associated with the payment method.
 * @property [secretMethodDetails] - Secret details associated with the payment method.
 */
export interface PaymentInformation {
    id: string
    paymentMethod: PaymentMethod
    publicMethodDetails?: object
    secretMethodDetails?: object
}
