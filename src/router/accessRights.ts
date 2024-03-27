import { UserRole } from '@/store/userRole'

/**
 * For each route of the application,
 * a boolean property exists
 * 'saying' whether or not the corresponding route
 * can be accessed by a user who has these access rights.
 */
export interface AccessRights {
    canAccessCategory: boolean
    canAccessCheckout: boolean
    canAccessManageCategories: boolean
    canAccessManageProducts: boolean
    canAccessManageTaxRates: boolean
    canAccessProduct: boolean
    canAccessProducts: boolean
    canAccessShoppingCart: boolean
    canAccessStorefront: boolean
    canAccessTaxRate: boolean
    canAccessWishlist: boolean
    canAccessWishlists: boolean
}

/**
 * The access rights of a user with their active role being 'Buyer'.
 */
export const buyerAccessRights: AccessRights = {
    canAccessCategory: true,
    canAccessCheckout: true,
    canAccessManageCategories: false,
    canAccessManageProducts: false,
    canAccessManageTaxRates: false,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessShoppingCart: true,
    canAccessStorefront: true,
    canAccessTaxRate: false,
    canAccessWishlist: true,
    canAccessWishlists: true,
}

/**
 * The access rights of a user with their active role being 'Employee'.
 */
export const employeeAccessRights: AccessRights = {
    canAccessCategory: true,
    canAccessCheckout: false,
    canAccessManageCategories: true,
    canAccessManageProducts: true,
    canAccessManageTaxRates: true,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessShoppingCart: false,
    canAccessStorefront: true,
    canAccessTaxRate: true,
    canAccessWishlist: false,
    canAccessWishlists: false,
}

/**
 * The access rights of a user with their active role being 'Administrator'.
 */
export const adminAccessRights: AccessRights = {
    canAccessCategory: true,
    canAccessCheckout: false,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessManageCategories: true,
    canAccessManageProducts: true,
    canAccessManageTaxRates: true,
    canAccessShoppingCart: false,
    canAccessStorefront: true,
    canAccessTaxRate: true,
    canAccessWishlist: false,
    canAccessWishlists: false,
}

/**
 * Gets the access rights for a user based on their role.
 * @param userRole - The role of the user.
 * @returns The access rights for the user, or null if the role is unknown.
 */
export function getAccessRights(userRole: UserRole): AccessRights | null {
    switch (userRole) {
        case UserRole.Buyer:
            return buyerAccessRights
        case UserRole.Employee:
            return employeeAccessRights
        case UserRole.Admin:
            return adminAccessRights
        default:
            // Handle unknown roles (return null or throw an error).
            return null
    }
}

/**
 * Determines whether a user role has access to a specific route based on their access rights.
 * @param nameOfRoute - The name of the route to check access for.
 * @param givenAccessRights - The user role's access rights.
 * @returns Returns true if the user role has access; otherwise, returns false.
 */
export function canAccess(
    nameOfRoute: string,
    givenAccessRights: AccessRights
): boolean {
    /**
     * Lookup table that maps each individual route name to its corresponding AccessRights property.
     */
    const routeAccessMap: Record<string, keyof AccessRights> = {
        category: 'canAccessCategory',
        checkout: 'canAccessCheckout',
        'checkout-address': 'canAccessCheckout',
        'checkout-payment': 'canAccessCheckout',
        'checkout-shipment': 'canAccessCheckout',
        'checkout-summary': 'canAccessCheckout',
        'manage-categories': 'canAccessManageCategories',
        'manage-products': 'canAccessManageProducts',
        'manage-tax-rates': 'canAccessManageTaxRates',
        product: 'canAccessProduct',
        products: 'canAccessProducts',
        'shopping-cart': 'canAccessShoppingCart',
        storefront: 'canAccessStorefront',
        'tax-rate': 'canAccessTaxRate',
        wishlist: 'canAccessWishlist',
        wishlists: 'canAccessWishlists',
    }

    const accessKey = routeAccessMap[nameOfRoute]
    return accessKey ? givenAccessRights[accessKey] : false
}
