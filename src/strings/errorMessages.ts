/**
 * The online store's error messages that could be displayed to the user.
 */
export const errorMessages = {
    // general
    logout: 'Failed to logout the user.',
    resetStateRelatedToUser:
        "Could not reset the website's state related to the current user.",
    // user
    getCurrentUser: 'Could not load the current user.',
    getPaymentInformationOfCurrentUser:
        'Could not load the payment information of the current user.',
    // catalog
    getDefaultProductVariants: 'Could not load the products.',
    getCategoryWithCharacteristicsAndDefaultProductVariants:
        'Could not load the category.',
    getCategoriesWithTotalCountOfProducts:
        'Could not load the categories of the store.',
    getCategoriesWithCharacteristics: 'Could not load the categories.',
    getProduct: 'Could not load the product.',
    getProductForBuyer: 'Could not load the product.',
    getProductWithItsVariantsOnly:
        'Could not load the product variants of the product.',
    createProduct: 'Could not create the new product.',
    createProductVariant: 'Could not create the new product variant.',
    createNewProductVariantVersion:
        'Could not create the new product variant version.',
    createCategory: 'Could not create the new category.',
    createCategoricalCategoryCharacteristic:
        'Could not create the new category characteristic.',
    createNumericalCategoryCharacteristic:
        'Could not create the new category characteristic.',
    // wishlist
    getUserWithWishlists: 'Could not load the wishlists of the user.',
    getUserWithWishlistsWithProductVariants:
        'Could not load the wishlists of the user.',
    getWishlist: 'Could not load the wishlist.',
    addWishlist: 'Could not add the new wishlist.',
    deleteWishlist: 'Could not delete the wishlist.',
    updateWishlist: 'Could not update the wishlist.',
    // tax
    getTaxRates: 'Could not load the tax rates.',
    getTaxRatesWithCurrentVersion: 'Could not load the tax rates.',
    getTaxRate: 'Could not load the tax rate.',
    createTaxRate: 'Could not create the new tax rate.',
    createTaxRateVersion: 'Could not create the new tax rate version.',
    updateTaxRate: 'Could not update the tax rate.',
    // inventory
    getProductItemsCountOfInventoryStatus:
        'Could not load the inventory status of the product items of the product variant.',
    createProductItemBatch: 'Could not create the batch of product items.',
    // shopping cart
    getShoppingCartOfUser: 'Could not load the shopping cart of the user.',
    addItemToShoppingCart:
        'Could not add the product variant to the shopping cart.',
    updateShoppingCartItem: 'Could not update the shopping cart item.',
    deleteShoppingCartItem: 'Could not remove the shopping cart item.',
    // address
    createUserAddress: 'Could not add new address of user.',
    getActiveAddressesOfCurrentUser:
        'Could not load the addresses of the user.',
    // payment
    createCreditCardPaymentInformation:
        'Could not add new credit card information.',
    // shipment
    getShipmentMethods: 'Could not get the shipment methods.',
    // order
    createOrder: 'Could not create the order.',
}
