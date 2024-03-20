import { Address } from '../interfaces/Address'

/**
 * Class representing an address.
 * @implements {Address}
 */
export class AddressImpl implements Address {
    /**
     * Creates an instance of AddressImpl.
     * @param id - The ID of the address.
     * @param street1 - The first line of the address -- the street.
     * @param street2 - The second line of the address -- extra information regarding the street.
     * @param city - The city of the address.
     * @param postalCode - The postal code of the address.
     * @param country - The country of the address.
     * @param companyName - The name of the company associated with the address.
     */
    constructor(
        public id: string,
        public street1: string,
        public street2: string,
        public city: string,
        public postalCode: string,
        public country: string,
        public companyName?: string
    ) {}
}
