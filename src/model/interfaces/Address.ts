import { Name } from './name'

/**
 * Interface representing an address.
 * @interface
 * @property city - The city of the address.
 * @property [companyName] - The name of the company associated with the address or the addressee.
 * @property country - The country of the address.
 * @property id - The ID of the address.
 * @property [name] - The name of the addressee.
 * @property postalCode - The postal code of the address.
 * @property street1 - The first line of the address -- the street.
 * @property street2 - The second line of the address -- extra information regarding the street.
 */
export interface Address {
    city: string
    companyName?: string
    country: string
    id: string
    name?: Name
    postalCode: string
    street1: string
    street2: string
}
