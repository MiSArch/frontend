import { useClient } from '@/graphql/client'
import {
    CreateOrderInput,
    CreateOrderMutation,
    OrderItemInput,
    OrderStatus,
    PaymentAuthorizationInput,
    PlaceOrderInput,
    PlaceOrderMutation,
} from '@/graphql/generated'
import { Order } from '@/model/interfaces/order'
import { OrderItem } from '@/model/interfaces/orderItem'
import { errorMessages } from '@/strings/errorMessages'
import { awaitActionAndPushErrorIfNecessary } from '@/util/errorHandler'
import { removeHyphens } from '@/util/string'

/**
 * Requests the creation of an order for the user with the specified user ID.
 * @param order - The order object containing details of the order.
 * @param userId - The ID of the user placing the order.
 * @throws Throws an error if there is any issue while creating the order.
 * @returns - A promise that resolves with the ID of the created order.
 */
export async function createOrder(
    order: Order,
    userId: string
): Promise<string> {
    const createOrderMutation: CreateOrderMutation =
        await awaitActionAndPushErrorIfNecessary(() => {
            return useClient().createOrder({
                input: createInputObjectForOrderCreation(order, userId),
            })
        }, errorMessages.createOrder)

    return createOrderMutation.createOrder.id
}

/**
 * Checks whether an OrderItemInput object can be created based on the provided order item.
 * @param orderItem - The order item to be checked.
 * @returns - Returns true if the order item has a valid shipment method ID, otherwise returns false.
 */
function canCreateOrderItemInput(orderItem: OrderItem): boolean {
    return orderItem?.shipmentMethod?.id != undefined
}

/**
 * Creates an OrderItemInput object based on the provided order item.
 * @param orderItem - The order item for which to create the OrderItemInput object.
 * @throws Throws an error if the order item does not have a valid shipment method ID.
 * @returns - Returns the created OrderItemInput object.
 */
function createOrderItemInput(orderItem: OrderItem): OrderItemInput {
    if (orderItem?.shipmentMethod?.id == undefined) {
        throw new Error(
            'Cannot create the OrderItemInput object for an order item.'
        )
    }

    return {
        couponIds: [],
        shipmentMethodId: orderItem.shipmentMethod.id,
        shoppingCartItemId: orderItem.shoppingCartItem.id,
    }
}

/**
 * Creates an input object for order creation based on the provided order and user ID.
 * @param order - The order object containing details of the order.
 * @param userId - The ID of the user placing the order.
 * @throws Throws an error if any required information is missing in the order object or if any order item cannot be created.
 * @returns - Returns the input object for order creation.
 */
function createInputObjectForOrderCreation(
    order: Order,
    userId: string
): CreateOrderInput {
    if (
        userId == undefined ||
        order == undefined ||
        order.deliveryAddress?.id == undefined ||
        order.billingAddress?.id == undefined ||
        order.paymentInformation?.id == undefined ||
        order.items == undefined ||
        order.items.filter((item) => !canCreateOrderItemInput(item)).length > 0
    ) {
        throw new Error('Cannot create CreateOrderInput.')
    }

    const vatNumber: string | undefined =
        typeof order.vatNumber === 'string'
            ? removeHyphens(order.vatNumber)
            : undefined

    return {
        userId: userId,
        orderItemInputs: order.items.map((item) => createOrderItemInput(item)),
        shipmentAddressId: order.deliveryAddress.id,
        invoiceAddressId: order.billingAddress.id,
        paymentInformationId: order.paymentInformation.id,
        vatNumber: vatNumber ?? '',
    }
}

/**
 * Requests the placement of an order with the specified order ID.
 * If the payment method of the order is credit card, a credit card validation code (CVC) must be specified.
 * This function does not check whether the chosen payment method actually is credit card
 * if a CVC was specified.
 * @param orderId - The ID of the order to be placed.
 * @param [creditCardValidationCode] - The CVC of the credit card.
 * @throws Throws an error if there is any issue while placing the order.
 * @returns - A promise that resolves to true if the order was placed succesfully, false otherwise.
 */
export async function placeOrder(
    orderId: string,
    creditCardValidationCode?: string
): Promise<boolean> {
    if (orderId == undefined) {
        throw new Error('Cannot create PlaceOrderInput.')
    }

    const paymentAuthorizationInput: PaymentAuthorizationInput | undefined =
        typeof creditCardValidationCode === 'string'
            ? {
                  cvc: Number.parseInt(creditCardValidationCode),
              }
            : undefined

    const placeOrderInput: PlaceOrderInput = {
        id: orderId,
        paymentAuthorization: paymentAuthorizationInput,
    }
    const placeOrderMutation: PlaceOrderMutation =
        await awaitActionAndPushErrorIfNecessary(() => {
            return useClient().placeOrder({
                input: placeOrderInput,
            })
        }, errorMessages.placeOrder)

    return placeOrderMutation.placeOrder.orderStatus === OrderStatus.Placed
}
