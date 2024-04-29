/**
 * Interface representing an address.
 * @interface
 * @property id - The ID of the address.
 * @property street1 - The first line of the address -- the street.
 * @property street2 - The second line of the address -- extra information regarding the street.
 * @property city - The city of the address.
 * @property postalCode - The postal code of the address.
 * @property country - The country of the address.
 * @property [companyName] - The name of the company associated with the address.
 */
export interface Address {
    id: string
    street1: string
    street2: string
    city: string
    postalCode: string
    country: string
    companyName?: string
}
