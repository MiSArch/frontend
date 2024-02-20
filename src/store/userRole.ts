/**
 * The user roles of the online store domain.
 */
export enum UserRole {
    Admin = 'Administrator',
    Customer = 'Customer',
    Employee = 'Employee',
}

/**
 * Lookup table that maps each individual user role to its corresponding 'Role name' in Keycloak.
 */
const userRoleKeycloakRepresentationMap: Record<UserRole, string> = {
    Administrator: 'site-admin',
    Customer: 'buyer',
    Employee: 'employee',
}

/**
 * Parses a Keycloak role name and returns the corresponding UserRole, or null if not found.
 *
 * @param roleNameInKeycloak - The role name as represented in Keycloak.
 * @returns The corresponding UserRole, or null if not found.
 * @throws {Error} Throws an error if roleNameInKeycloak is null or undefined.
 */
export function parseKeycloakRoleName(
    roleNameInKeycloak: string
): UserRole | null {
    if (roleNameInKeycloak === null || roleNameInKeycloak === undefined) {
        throw new Error('roleNameInKeycloak cannot be null or undefined')
    }

    for (const userRole of Object.values(UserRole)) {
        if (
            userRoleKeycloakRepresentationMap[userRole] === roleNameInKeycloak
        ) {
            return userRole
        }
    }

    return null
}
