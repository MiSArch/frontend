import { UserRole } from '@/store/userRole'

/**
 * For each route of the application,
 * a boolean property exists
 * 'saying' whether or not the corresponding route
 * can be accessed by a user who has these access rights.
 */
export interface AccessRights {
    canAccessStorefront: boolean
    canAccessProduct: boolean
    canAccessProducts: boolean
    canAccessShoppingCart: boolean
    canAccessCategory: boolean
    canAccessWishlist: boolean
    canAccessWishlists: boolean
    canAccessManageProducts: boolean
    canAccessManageCategories: boolean
    canAccessTaxRate: boolean
    canAccessManageTaxRates: boolean
}

/**
 * The access rights of a user with their active role being 'Buyer'.
 */
export const buyerAccessRights: AccessRights = {
    canAccessStorefront: true,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessShoppingCart: true,
    canAccessCategory: true,
    canAccessWishlist: true,
    canAccessWishlists: true,
    canAccessManageProducts: false,
    canAccessManageCategories: false,
    canAccessTaxRate: false,
    canAccessManageTaxRates: false,
}

/**
 * The access rights of a user with their active role being 'Employee'.
 */
export const employeeAccessRights: AccessRights = {
    canAccessStorefront: true,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessShoppingCart: false,
    canAccessCategory: true,
    canAccessWishlist: false,
    canAccessWishlists: false,
    canAccessManageProducts: true,
    canAccessManageCategories: true,
    canAccessTaxRate: true,
    canAccessManageTaxRates: true,
}

/**
 * The access rights of a user with their active role being 'Administrator'.
 */
export const adminAccessRights: AccessRights = {
    canAccessStorefront: true,
    canAccessProduct: true,
    canAccessProducts: true,
    canAccessShoppingCart: false,
    canAccessCategory: true,
    canAccessWishlist: false,
    canAccessWishlists: false,
    canAccessManageProducts: true,
    canAccessManageCategories: true,
    canAccessTaxRate: true,
    canAccessManageTaxRates: true,
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
        Storefront: 'canAccessStorefront',
        Product: 'canAccessProduct',
        Products: 'canAccessProducts',
        'Shopping Cart': 'canAccessShoppingCart',
        Category: 'canAccessCategory',
        Wishlist: 'canAccessWishlist',
        Wishlists: 'canAccessWishlists',
        'Manage Products': 'canAccessManageProducts',
        'Manage Categories': 'canAccessManageCategories',
        'Tax Rate': 'canAccessTaxRate',
        'Manage Tax Rates': 'canAccessManageTaxRates',
    }

    const accessKey = routeAccessMap[nameOfRoute]
    return accessKey ? givenAccessRights[accessKey] : false
}
