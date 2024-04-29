<template>
    <div class="d-flex flex-column ga-4">
        <div v-if="activeUserRoleIsEitherAdminOrEmployee">
            <v-toolbar class="bg-grey-lighten-3" density="comfortable">
                <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    prepend-icon="mdi-playlist-plus"
                    @click="openRestockDialog()"
                    >Restock</v-btn
                >
            </v-toolbar>
            <v-card class="bg-grey-lighten-3" rounded="0" variant="flat">
                <v-card-item>
                    <v-card-title class="mr-1">
                        Product:
                        {{
                            productInfoRelevantToAdminAndEmployee?.product
                                .internalName
                        }}
                    </v-card-title>

                    <v-card-subtitle
                        >ID:
                        {{
                            productInfoRelevantToAdminAndEmployee?.product.id
                        }}</v-card-subtitle
                    >
                </v-card-item>
                <v-card-text>
                    <v-switch
                        color="warning"
                        density="comfortable"
                        hide-details
                        readonly
                        :label="
                            productIsHidden
                                ? 'The product is hidden from customers.'
                                : 'The product is publicly visible to customers.'
                        "
                        v-model="productIsHidden"
                    ></v-switch>
                    <p>
                        Number of variants:
                        {{
                            productInfoRelevantToAdminAndEmployee?.product
                                .variants.totalCount
                        }}
                    </p>
                </v-card-text>
            </v-card>
            <v-card class="bg-grey-lighten-4" rounded="0" variant="flat">
                <v-card-item>
                    <v-card-title
                        >Variant:
                        {{
                            productVariantInfoRelevantToAdminAndEmployee
                                ?.currentVersion.name
                        }}</v-card-title
                    >
                    <v-card-subtitle
                        >ID:
                        {{
                            productVariantInfoRelevantToAdminAndEmployee?.id
                        }}</v-card-subtitle
                    >
                </v-card-item>
                <v-card-text>
                    <v-switch
                        color="warning"
                        density="comfortable"
                        hide-details="auto"
                        hint="As the product is hidden, this value is irrelevant."
                        :label="
                            productVariantIsHidden
                                ? 'The product variant is hidden from customers.'
                                : 'The product variant is publicly visible to customers.'
                        "
                        :persistent-hint="productIsHidden"
                        readonly
                        v-model="productVariantIsHidden"
                    ></v-switch>
                    <InventoryStatusOfProductVariant
                        perspective="inventory manager"
                        :in-stock="inStock"
                        :number-of-product-items-in-stock="
                            productItemsCountOfItemsInStock
                        "
                        :number-of-reserved-product-items="
                            productItemsCountOfReservedItems
                        "
                        :number-of-product-items-in-fullfillment="
                            productItemsCountOfItemsInFullfillment
                        "
                        :number-of-shipped-product-items="
                            productItemsCountOfShippedItems
                        "
                        :number-of-delivered-product-items="
                            productItemsCountOfDeliveredItems
                        "
                        :number-of-returned-product-items="
                            productItemsCountOfReturnedItems
                        "
                        :number-of-lost-product-items="
                            productItemsCountOfLostItems
                        "
                    />
                </v-card-text>
                <div
                    v-if="
                        productVariantInfoRelevantToAdminAndEmployee?.id ===
                        productInfoRelevantToAdminAndEmployee?.product
                            .defaultVariant.id
                    "
                >
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-chip color="primary"> Default Variant </v-chip>
                    </v-card-text>
                </div>
            </v-card>
            <v-card class="bg-grey-lighten-5" rounded="0" variant="flat">
                <v-card-item>
                    <v-card-title
                        >Variant Version:
                        {{
                            productVariantInfoRelevantToAdminAndEmployee
                                ?.currentVersion.version
                        }}</v-card-title
                    >
                    <v-card-subtitle
                        >ID:
                        {{
                            productVariantInfoRelevantToAdminAndEmployee
                                ?.currentVersion.id
                        }}</v-card-subtitle
                    >
                </v-card-item>
                <v-card-text>
                    <div class="d-flex flex-column ga-2">
                        <div class="d-inline-flex">
                            <v-table class="text-capitalize" density="compact">
                                <tbody>
                                    <tr>
                                        <td>Weight</td>
                                        <td class="text-lowercase">
                                            {{
                                                productVariantInfoRelevantToAdminAndEmployee
                                                    ?.currentVersion.weight +
                                                ' ' +
                                                commonStrings.kg
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
                        <div
                            v-if="
                                productVariantInfoRelevantToAdminAndEmployee
                                    ?.currentVersion.createdAt
                            "
                        >
                            Created
                            <RelativeTime
                                :time="
                                    productVariantInfoRelevantToAdminAndEmployee
                                        ?.currentVersion.createdAt
                                "
                            />
                        </div>
                    </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-text>
                    <v-chip
                        @click="
                            navigateToTaxRate(
                                productVariantInfoRelevantToAdminAndEmployee
                                    ?.currentVersion.taxRate.id
                            )
                        "
                        >Tax Rate:
                        {{
                            productVariantInfoRelevantToAdminAndEmployee
                                ?.currentVersion.taxRate.name
                        }}</v-chip
                    >
                </v-card-text>
            </v-card>
        </div>
        <div v-else>
            <!-- To enforce the gap (see line 2 "... ga-4") -->
        </div>
        <div class="d-flex flex-column ga-4">
            <div class="d-flex mx-4 ga-4">
                <v-sheet border>
                    <v-carousel cycle show-arrows="hover">
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                        <v-carousel-item
                            :width="360"
                            aspect-ratio="4/3"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></v-carousel-item>
                    </v-carousel>
                </v-sheet>
                <v-card class="align-self-start" elevation="4">
                    <v-card-item>
                        <v-card-title>{{
                            productVariantInfoRelevantToBuyer?.currentVersion
                                .name
                        }}</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip
                                v-for="category in categories"
                                @click="navigateToCategory(category.id)"
                            >
                                {{ category.name }}
                            </v-chip>
                        </div>
                    </v-card-text>
                    <div
                        v-if="
                            hasAnyCategoricalCategoryCharacteristicValues ||
                            hasAnyCategoricalCategoryCharacteristicValues
                        "
                    >
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="d-flex flex-column ga-2">
                                <div
                                    v-if="
                                        hasAnyNumericalCategoryCharacteristicValues
                                    "
                                    class="d-flex flex-column ga-2"
                                >
                                    <div class="text-caption">
                                        Numerical Characteristics
                                    </div>
                                    <div class="d-flex flex-wrap ga-2">
                                        <v-chip
                                            v-for="v in numericalCategoryCharacteristicValues"
                                        >
                                            {{ v.characteristic.name }}:
                                            {{ v.numericalValue }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        hasAnyCategoricalCategoryCharacteristicValues
                                    "
                                    class="d-flex flex-column mt-2 ga-2"
                                >
                                    <v-divider></v-divider>
                                    <div class="text-caption">
                                        Categorical Characteristics
                                    </div>
                                    <div class="d-flex flex-wrap ga-2">
                                        <v-chip
                                            v-for="v in categoricalCategoryCharacteristicValues"
                                        >
                                            {{ v.characteristic.name }}:
                                            {{ v.categoricalValue }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </div>
                </v-card>
                <v-card class="align-self-start" min-width="264">
                    <v-card-item>
                        <v-card-title
                            >{{
                                productVariantInfoRelevantToBuyer
                                    ?.currentVersion.retailPrice
                            }}
                            EUR</v-card-title
                        >
                        <v-card-subtitle
                            class="text-decoration-line-through"
                            v-if="false"
                        >
                            {{
                                productVariantInfoRelevantToBuyer
                                    ?.currentVersion.retailPrice
                            }}
                            EUR
                        </v-card-subtitle>
                    </v-card-item>
                    <v-divider></v-divider>
                    <v-card-text>
                        <InventoryStatusOfProductVariant
                            perspective="customer"
                            :in-stock="inStock"
                        />
                    </v-card-text>
                    <div class="d-flex flex-column px-4 pb-4">
                        <v-select
                            :items="quantityOptions"
                            density="compact"
                            :disabled="!inStock || !shoppingCartIsEnabled"
                            hint="Choose how many to add to the cart."
                            label="Amount"
                            persistent-hint
                            variant="solo"
                            v-model="amount"
                        ></v-select>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="!inStock || !shoppingCartIsEnabled"
                            prepend-icon="mdi-cart"
                            @click="addToCart"
                            >Add To Cart</v-btn
                        >
                    </v-card-actions>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn
                            prepend-icon="mdi-plus"
                            @click="openAddToWishlistDialog"
                            >Add To Wishlist</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            :icon="
                                showWishlistsExpansion
                                    ? 'mdi-chevron-up'
                                    : 'mdi-chevron-down'
                            "
                            @click="
                                showWishlistsExpansion = !showWishlistsExpansion
                            "
                        ></v-btn>
                    </v-card-actions>
                    <v-expand-transition>
                        <div v-show="showWishlistsExpansion">
                            <v-divider class="mx-2"></v-divider>
                            <v-card-actions>
                                <v-btn
                                    density="compact"
                                    prepend-icon="mdi-open-in-new"
                                    @click="goToWishlists"
                                    >Go To Wishlists</v-btn
                                >
                            </v-card-actions>
                        </div>
                    </v-expand-transition>
                </v-card>
                <v-spacer></v-spacer>
                <v-card class="align-self-start">
                    <v-card-item>
                        <v-card-title>Shipping</v-card-title>
                    </v-card-item>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container>
                            <v-row align="start" dense>
                                <v-col>Weight:</v-col>
                                <v-col>{{
                                    productVariantInfoRelevantToBuyer
                                        ?.currentVersion.weight +
                                    ' ' +
                                    commonStrings.kg
                                }}</v-col>
                            </v-row>
                            <v-row align="start" dense>
                                <v-col>Returns:</v-col>
                                <v-col v-if="canBeReturnedAtAnyTime">
                                    Can be returned at any time.
                                </v-col>
                                <v-col v-else>
                                    Returnable within
                                    {{ canBeReturnedForDays }} days of receipt.
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </div>
            <v-card
                class="mx-4"
                elevation="4"
                title="Description"
                :text="
                    productVariantInfoRelevantToBuyer?.currentVersion
                        .description
                "
            >
            </v-card>
            <v-card class="mx-4 mb-4" elevation="4">
                <v-card-item>
                    <v-card-title> Other Product Variants </v-card-title>
                </v-card-item>
                <v-card-text>
                    <v-list v-for="v in otherProductVariants">
                        <v-list-item>
                            <ProductSummary
                                :product-id="
                                    productInfoRelevantToBuyer?.product.id
                                "
                                :product-variant-id="v.id"
                                :name="v.currentVersion.name"
                                :price="v.currentVersion.retailPrice"
                                :retail-price="v.currentVersion.retailPrice"
                            />
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </div>
    </div>
    <AddToWishlistDialog
        :product-variant-id="productVariantId"
        v-model="addToWishlistDialogOpen"
        @close-addtowishlistdialog="closeAddToWishlistDialog"
        @update-wishlists="updateWishlists"
        @go-to-wishlists="goToWishlists"
    />
    <RestockDialog
        :product-id="id"
        :preselected-product-variant-id="productVariantId"
        v-model="restockDialogOpen"
        @close="closeRestockDialog"
        @restocked="reevaluateInventoryStatus"
    />
</template>

<script setup lang="ts">
import AddToWishlistDialog from '@/components/AddToWishlistDialog.vue'
import InventoryStatusOfProductVariant from '@/components/InventoryStatusOfProductVariant.vue'
import ProductSummary from '@/components/ProductSummary.vue'
import RelativeTime from '@/components/RelativeTime.vue'
import RestockDialog from '@/components/RestockDialog.vue'
import { useClient } from '@/graphql/client'
import {
    GetProductItemsCountOfInventoryStatusQuery,
    ProductItemStatus,
    UpdateWishlistInput,
} from '@/graphql/generated'
import { routeNames } from '@/router/routeNames'
import { useAppStore } from '@/store/app'
import { commonStrings } from '@/strings/commonStrings'
import { errorMessages } from '@/strings/errorMessages'
import {
    pushErrorNotification,
    awaitActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The default value for the maximum number of product items a buyer can order at once.
 * See the computed ref 'maximumNumberOfProductItemsABuyerCanOrder'
 */
const defaultMaximumNumberOfItemsABuyerCanOrder = 10

const store = useAppStore()

const { activeUserRoleIsEitherAdminOrEmployee, shoppingCartIsEnabled } =
    storeToRefs(store)

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The current route (location).
 */
const route = useRoute()

/**
 * The router.
 */
const router = useRouter()

/**
 * The product id (taken from the route params).
 */
const id = computed(() => {
    return route.params.productid.toString()
})

/**
 * Gets the product from the catalog service,
 * including only the information relevant to a potential customer.
 */
const productInfoRelevantToBuyer = asyncComputed(
    async () => {
        return client.getProductForBuyer({
            id: id.value,
        })
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(errorMessages.getProductForBuyer, e),
        shallow: false,
    }
)

/**
 * The product information that is only relevant to users whose active user role is either 'Admin' or 'Employee'.
 */
const productInfoRelevantToAdminAndEmployee = asyncComputed(
    async () => {
        if (activeUserRoleIsEitherAdminOrEmployee.value) {
            return client.getProduct({
                id: id.value,
            })
        } else {
            return null
        }
    },
    null,
    {
        onError: (e) => pushErrorNotification(errorMessages.getProduct, e),
        shallow: false,
    }
)

/**
 * Indicates whether the product is hidden from the customer.
 * If the product has not yet been loaded or could not be loaded, the value is false.
 */
const productIsHidden = computed(() => {
    if (productInfoRelevantToAdminAndEmployee.value == null) {
        return false
    } else {
        return !productInfoRelevantToAdminAndEmployee.value.product
            .isPubliclyVisible
    }
})

/**
 * The ID of the product variant displayed on this view.
 */
const productVariantId = computed(() => {
    if (typeof route.params.productvariantid === 'string') {
        return route.params.productvariantid
    }

    if (activeUserRoleIsEitherAdminOrEmployee.value) {
        if (productInfoRelevantToAdminAndEmployee.value != undefined) {
            return productInfoRelevantToAdminAndEmployee.value.product
                .defaultVariant.id
        }
    } else {
        if (productInfoRelevantToBuyer.value != undefined) {
            return productInfoRelevantToBuyer.value.product.defaultVariant.id
        }
    }
})

/**
 * Decides which product variant to display initially.
 */
const productVariantInfoRelevantToBuyer = computed(() => {
    return productInfoRelevantToBuyer.value?.product.variants.nodes.find(
        (variant) => variant.id == productVariantId.value
    )
})

/**
 * Decides which product variant to display initially.
 */
const productVariantInfoRelevantToAdminAndEmployee = computed(() => {
    return productInfoRelevantToAdminAndEmployee.value?.product.variants.nodes.find(
        (variant) => variant.id === productVariantId.value
    )
})

/**
 * Indicates whether the currently displayed product variant is hidden from the customer.
 * If the product variant has not yet been computed or could not be computed, the value is false.
 */
const productVariantIsHidden = computed(() => {
    if (productVariantInfoRelevantToAdminAndEmployee.value == undefined) {
        return false
    } else {
        return !productVariantInfoRelevantToAdminAndEmployee.value
            .isPubliclyVisible
    }
})

/**
 * Gets the product categories to which the product belongs.
 */
const categories = computed(() => {
    return productInfoRelevantToBuyer.value?.product.categories.nodes ?? []
})

/**
 * The other product variants.
 * These are listed in the section 'Other Product Variants'.
 */
const otherProductVariants = computed(() => {
    return (
        productInfoRelevantToBuyer.value?.product.variants.nodes.filter(
            (variant) => variant.id !== productVariantId.value
        ) ?? []
    )
})

/**
 * The categorical values of the product variant's CategoryCharacteristicValues.
 */
const categoricalCategoryCharacteristicValues = computed(() => {
    return (
        productVariantInfoRelevantToBuyer.value?.currentVersion.characteristicValues.nodes
            .filter(
                (characteristicValue) =>
                    characteristicValue.__typename ===
                    'CategoricalCategoryCharacteristicValue'
            )
            .map(
                (categoricalCategoryCharacteristicValue) =>
                    categoricalCategoryCharacteristicValue as any
            ) ?? []
    )
})

/**
 * Whether or not there are any -- meaning more than one -- categorical category characteristic values.
 */
const hasAnyCategoricalCategoryCharacteristicValues = computed(() => {
    return categoricalCategoryCharacteristicValues.value.length > 0
})

/**
 * The numerical values of the product variant's CategoryCharacteristicValues.
 */
const numericalCategoryCharacteristicValues = computed(() => {
    return (
        productVariantInfoRelevantToBuyer.value?.currentVersion.characteristicValues.nodes
            .filter(
                (characteristicValue) =>
                    characteristicValue.__typename ===
                    'NumericalCategoryCharacteristicValue'
            )
            .map(
                (numericalCategoryCharacteristicValue) =>
                    numericalCategoryCharacteristicValue as any
            ) ?? []
    )
})

/**
 * Whether or not there are any -- meaning more than one -- numerical category characteristic values.
 */
const hasAnyNumericalCategoryCharacteristicValues = computed(() => {
    return numericalCategoryCharacteristicValues.value.length > 0
})

/**
 * Navigates to the category to which the given id belongs.
 * The navigation is done via the Vue Router.
 * @param id The id of the category to navigate to.
 */
function navigateToCategory(id: any) {
    router.push({
        name: routeNames.category,
        params: {
            categoryid: id,
        },
    })
}

/**
 * Navigates to the tax rate to which the given ID belongs.
 * The navigation is done via the Vue Router.
 * @param id The ID of the category to navigate to.
 */
function navigateToTaxRate(id: any) {
    router.push({
        name: routeNames.taxRate,
        params: {
            taxrateid: id,
        },
    })
}

/**
 * Whether or not the expansion panel regarding the wishlists is open.
 */
const showWishlistsExpansion = ref(false)

/**
 * Whether or not the "ADD TO WISHLIST" dialog is open.
 */
const addToWishlistDialogOpen = ref(false)

/**
 * Opens the "ADD TO WISHLIST" dialog.
 */
function openAddToWishlistDialog() {
    addToWishlistDialogOpen.value = true
}

/**
 * Closes the "ADD TO WISHLIST" dialog.
 */
function closeAddToWishlistDialog() {
    addToWishlistDialogOpen.value = false
}

/**
 * Tries to update the given wishlists.
 * @param input The wishlists that have to be updated.
 */
async function updateWishlists(input: UpdateWishlistInput[]) {
    closeAddToWishlistDialog()

    input.forEach(async (updateWishlistInput) => {
        try {
            await awaitActionAndPushErrorIfNecessary(() => {
                return client.updateWishlist({
                    input: updateWishlistInput,
                })
            }, errorMessages.updateWishlist)
        } catch (error) {}
    })
}

/**
 * Navigates to the wishlists.
 */
function goToWishlists() {
    router.push({
        name: routeNames.wishlists,
    })
}

/**
 * Computed property indicating whether there are product items in stock.
 * @returns True if there are product items in stock, false otherwise.
 */
const inStock = computed(() => {
    if (!activeUserRoleIsEitherAdminOrEmployee.value) {
        const count = productVariantInfoRelevantToBuyer.value?.inventoryCount
        return count != undefined && count > 0
    }

    return (
        productItemsCountOfItemsInStock.value != undefined &&
        productItemsCountOfItemsInStock.value > 0
    )
})

/**
 * A ref to trigger the evaluation of the inventory status of the product variant:
 * For each product item status, how many product items have that status?
 */
const trigger = ref(0)

/**
 * Asynchronously computed property for the number of product items in stock.
 * @returns The number of product items in stock or undefined if no data is available.
 */
const productItemsCountOfItemsInStock = asyncComputed(
    async () => {
        trigger.value

        if (!activeUserRoleIsEitherAdminOrEmployee.value) {
            return productVariantInfoRelevantToBuyer.value?.inventoryCount
        }

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.InStorage
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of reserved product items.
 * @returns The number of reserved product items or undefined if no data is available.
 */
const productItemsCountOfReservedItems = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.Reserved
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of product items in fullfillment.
 * @returns The number of product items in fullfillment or undefined if no data is available.
 */
const productItemsCountOfItemsInFullfillment = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.InFulfillment
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of shipped product items.
 * @returns The number of shipped product items or undefined if no data is available.
 */
const productItemsCountOfShippedItems = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.Shipped
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of delivered product items.
 * @returns The number of delivered product items or undefined if no data is available.
 */
const productItemsCountOfDeliveredItems = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.Delivered
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of returned product items.
 * @returns The number of returned product items or undefined if no data is available.
 */
const productItemsCountOfReturnedItems = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.Returned
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously computed property for the number of lost product items.
 * @returns The number of lost product items or undefined if no data is available.
 */
const productItemsCountOfLostItems = asyncComputed(
    async () => {
        trigger.value

        return await getProductItemsCountOfInventoryStatus(
            ProductItemStatus.Lost
        )
    },
    undefined,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getProductItemsCountOfInventoryStatus,
                e
            ),
        shallow: false,
    }
)

/**
 * Asynchronously gets the count of product items with a specified inventory status.
 * @param inventoryStatus - The inventory status of the product items.
 * @returns A promise that resolves to the count of product items, or undefined if retrieval is not possible.
 */
async function getProductItemsCountOfInventoryStatus(
    inventoryStatus: ProductItemStatus
): Promise<number | undefined> {
    if (inventoryStatus == undefined) {
        return undefined
    }

    if (!activeUserRoleIsEitherAdminOrEmployee.value) {
        return undefined
    }

    if (productVariantId.value == undefined) {
        return undefined
    }

    const query = await client.getProductItemsCountOfInventoryStatus({
        productVariant: productVariantId.value,
        inventoryStatus: inventoryStatus,
    })

    if (query != undefined) {
        return query.productItems.totalCount
    } else {
        return undefined
    }
}

/**
 * The maximum number of product items a buyer can order.
 *
 * This computed ref calculates the maximum number of product items a buyer can order based on the
 * number of items in stock.
 * The available quantity is simply the number of items in stocks.
 * If the available quantity (in stock) is less than 10, it returns that value; otherwise,
 * it returns the default maximum value of 10.
 */
const maximumNumberOfProductItemsABuyerCanOrder = computed(() => {
    console.log(productItemsCountOfItemsInStock.value)
    if (productItemsCountOfItemsInStock.value != undefined) {
        const numberOfAvailableProductItems =
            productItemsCountOfItemsInStock.value

        return numberOfAvailableProductItems <
            defaultMaximumNumberOfItemsABuyerCanOrder
            ? numberOfAvailableProductItems
            : defaultMaximumNumberOfItemsABuyerCanOrder
    }

    // If calculation is not possible, return a default maximum value of 10.
    return defaultMaximumNumberOfItemsABuyerCanOrder
})

/**
 * Computes an array of stringified integers from 1 to the value of the ref 'maximumNumberOfProductItemsABuyerCanOrder'.
 */
const quantityOptions = computed(() => {
    return Array.from(
        { length: maximumNumberOfProductItemsABuyerCanOrder.value },
        (_, index) => (index + 1).toString()
    )
})

/**
 * Whether or not the "RESTOCK" dialog is open.
 */
const restockDialogOpen = ref(false)

/**
 * Opens the "RESTOCK" dialog.
 */
function openRestockDialog() {
    restockDialogOpen.value = true
}

/**
 * Closes the "RESTOCK" dialog.
 */
function closeRestockDialog() {
    restockDialogOpen.value = false
}

/**
 * Triggers the reevaluation of the inventory status of the product variant.
 */
function reevaluateInventoryStatus() {
    trigger.value++
}

/**
 * How many of the product variant should be added to the cart.
 */
const amount = ref<string | null>(null)

/**
 * Whether or not the product variant can be added to the cart.
 */
const canAddToCart = computed(() => {
    return (
        shoppingCartIsEnabled &&
        productVariantId.value != undefined &&
        amount.value !== null
    )
})

/**
 * Asynchronously adds the product variant to the shopping cart based on the specified amount
 * if the product variant can actually be added to the cart.
 */
async function addToCart() {
    if (canAddToCart.value && amount.value !== null) {
        await store.addProductVariantToShoppingCart(
            productVariantId.value,
            parseInt(amount.value)
        )
    }
}

/**
 * Information on how long the product version can be returned, 'measured' in number of days.
 */
const canBeReturnedForDays = computed(() => {
    if (productVariantInfoRelevantToBuyer.value) {
        return productVariantInfoRelevantToBuyer.value.currentVersion
            .canBeReturnedForDays
    }
})

/**
 * Whether the current product version can be returned at any time.
 */
const canBeReturnedAtAnyTime = computed(() => {
    return canBeReturnedForDays.value === null
})
</script>
