/**
 * The user roles of the online store domain.
 */
export enum UserRole {
    Admin = 'admin',
    Buyer = 'buyer',
    Employee = 'employee',
}

/**
 * Returns the UserRole that has the given roleName
 * or null if no UserRole can be found.
 *
 * @param roleName - The name of the user role that should be returned.
 * @returns The corresponding UserRole, or null if not found.
 * @throws {Error} Throws an error if roleName is null or undefined.
 */
export function parseRoleName(roleName: string): UserRole | null {
    if (roleName === null || roleName === undefined) {
        throw new Error('roleName cannot be null or undefined')
    }

    for (const userRole of Object.values(UserRole)) {
        if (roleName === userRole) {
            return userRole
        }
    }

    return null
}
