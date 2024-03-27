import { awaitActionAndPushErrorIfNecessary } from '@/util/errorHandler'
import {
    GetPaymentInformationOfCurrentUserQuery,
    PaymentMethod as GeneratedPaymentMethodEnum,
} from './generated'
import { PaymentMethod } from '@/model/enums/paymentMethod'
import { errorMessages } from '@/strings/errorMessages'
import { useClient } from './client'

/**
 * Map to convert a PaymentMethod value to
 * the corresponding value of the enum generated by graphql-codegen.
 */
export const paymentMethodMap = new Map<
    PaymentMethod,
    GeneratedPaymentMethodEnum
>([
    [PaymentMethod.Invoice, GeneratedPaymentMethodEnum.Invoice],
    [PaymentMethod.Prepayment, GeneratedPaymentMethodEnum.Prepayment],
    [PaymentMethod.CreditCard, GeneratedPaymentMethodEnum.CreditCard],
])

/**
 * Gets payment information of the current user based on the provided payment method.
 * @param paymentMethod The payment method for which payment information is to be retrieved.
 * @returns A promise resolving to the payment information query result.
 */
export async function getPaymentInformationOfCurrentUser(
    paymentMethod: PaymentMethod
): Promise<GetPaymentInformationOfCurrentUserQuery> {
    return await awaitActionAndPushErrorIfNecessary(async () => {
        const client = useClient()
        const generatedPaymentMethod = paymentMethodMap.get(paymentMethod)

        if (!generatedPaymentMethod) {
            throw new Error(`Invalid payment method: ${paymentMethod}`)
        }

        return await client.getPaymentInformationOfCurrentUser({
            paymentMethod: generatedPaymentMethod,
        })
    }, errorMessages.getPaymentInformationOfCurrentUser)
}
