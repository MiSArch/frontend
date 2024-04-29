/**
 * Represents a shipment method.
 * @interface
 * @property id - The unique identifier for the shipment method.
 * @property name - The name of the shipment method.
 * @property baseFees - The base fees associated with the shipment method.
 * @property feesPerItem - The additional fees per item for the shipment method.
 * @property feesPerKg - The additional fees per kilogram for the shipment method.
 * @property description - A description providing more details about the shipment method.
 */
export interface ShipmentMethod {
    id: string
    name: string
    baseFees: number
    feesPerItem: number
    feesPerKg: number
    description: string
}
