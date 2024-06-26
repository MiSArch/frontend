<template>
    <ShoppingCartToolbar
        :total="total"
        @checkout-initiated="userWantsToProceedToCheckout"
    />
    <div class="text-body-1 pa-4">
        The products in your shopping cart are not reserved for you.
        Unfortunately, we cannot rule out the possibility that a product may
        suddenly be out of stock when you want to complete your order.
    </div>
    <div class="d-flex h-auto py-3">
        <v-virtual-scroll :items="shoppingCart.items">
            <template v-slot:default="{ item }">
                <v-list-item :key="item.id">
                    <ProductSummary
                        :product-id="item.productId"
                        :product-variant-id="item.productVariantId"
                        :id-of-shopping-cart-item="item.id"
                        :name="item.nameOfProductVariant"
                        :price="item.retailPrice"
                        :retail-price="item.retailPrice"
                        :count="item.count"
                        :image-path="item.imagePath"
                        @count-changed="updateShoppingCartItem"
                        @deleted="removeShoppingCartItem"
                    />
                </v-list-item>
            </template>
        </v-virtual-scroll>
    </div>
    <ShoppingCartToolbar
        v-if="shoppingCart.items.length > 5"
        :total="total"
        @checkout-initiated="userWantsToProceedToCheckout"
    />
</template>

<script lang="ts" setup>
import ProductSummary from '@/components/ProductSummary.vue'
import ShoppingCartToolbar from '@/components/ShoppingCartToolbar.vue'
import { routeNames } from '@/router/routeNames'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAppStore()
const { shoppingCart } = storeToRefs(store)

/**
 * The calculated total of the shopping cart: The sum of the prices of the items times their quantity (count).
 */
const total = computed(() => {
    let calculatedTotal: number = 0
    shoppingCart.value.items.forEach(
        (item) => (calculatedTotal += item.retailPrice * item.count)
    )
    return calculatedTotal
})

/**
 * Updates the shopping cart item with the specified ID.
 * @param idOfShoppingCartItem - The ID of the shopping cart item to be updated.
 * @param newCount - The new count of the shopping cart item.
 */
async function updateShoppingCartItem(
    idOfShoppingCartItem: any,
    newCount: number
) {
    await store.updateCountOfShoppingCartItem(idOfShoppingCartItem, newCount)
}

/**
 * Deletes the shopping cart item with the specified ID.
 * @param idOfShoppingCartItem - The ID of the shopping cart item to be deleted.
 */
async function removeShoppingCartItem(idOfShoppingCartItem: any) {
    await store.deleteShoppingCartItem(idOfShoppingCartItem)
}

/**
 * Initiates the checkout process by resetting order information,
 * creating the order items, and navigating to the checkout view.
 * This function is typically called when the user wants to proceed to checkout.
 */
function userWantsToProceedToCheckout(): void {
    store.resetUpcomingOrder()
    store.createOrderItems()

    navigateToCheckoutView()
}

/**
 * Navigates the user to the checkout.
 */
function navigateToCheckoutView() {
    router.push({
        name: routeNames.checkoutAddress,
    })
}
</script>
