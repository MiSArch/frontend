import { Address } from '../interfaces/address'
import { Name } from '../interfaces/name'

/**
 * Class representing an address.
 * @implements {Address}
 */
export class AddressImpl implements Address {
    /**
     * Creates an instance of AddressImpl.
     * @param city - The city of the address.
     * @param country - The country of the address.
     * @param id - The ID of the address.
     * @param postalCode - The postal code of the address.
     * @param street1 - The first line of the address -- the street.
     * @param street2 - The second line of the address -- extra information regarding the street.
     * @param companyName - The name of the company associated with the address or the addressee.
     * @param name - The name of the addressee.
     */
    constructor(
        public city: string,
        public country: string,
        public id: string,
        public postalCode: string,
        public street1: string,
        public street2: string,
        public companyName?: string,
        public name?: Name
    ) {}
}
