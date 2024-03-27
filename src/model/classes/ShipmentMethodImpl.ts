import { ShipmentMethod } from '../interfaces/ShipmentMethod'

/**
 * Class representing a shipment method.
 * @implements {ShipmentMethod}
 */
export class ShipmentMethodImpl implements ShipmentMethod {
    /**
     * Create a new ShipmentMethodImpl.
     * @constructor
     * @param id - The unique identifier for the shipment method.
     * @param name - The name of the shipment method.
     * @param baseFees - The base fees associated with the shipment method.
     * @param feesPerItem - The additional fee sper item for the shipment method.
     * @param feesPerKg - The additional fees per kilogram for the shipment method.
     * @param description - A description providing more details about the shipment method.
     */
    constructor(
        public id: string,
        public name: string,
        public baseFees: number,
        public feesPerItem: number,
        public feesPerKg: number,
        public description: string
    ) {}
}
