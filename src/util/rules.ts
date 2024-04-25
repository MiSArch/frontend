/**
 * Checks if the input is not null.
 * @param input - The input value to check.
 * @returns True if the input is not null, false otherwise.
 */
export function isNotNull(input: string): boolean {
    return input !== null
}

/**
 * Checks if the input is a valid number.
 * @param input - The input value to check.
 * @returns True if the input is a valid number, false otherwise.
 */
export function isNumber(input: string): boolean {
    if (isNotNull(input)) {
        return !isNaN(parseInt(input))
    }

    return false
}

/**
 * Validates the weight input: The input must be a) not null, b) a number, and c) bigger than 0.
 * @param input - The input value to validate.
 * @returns True if the weight is valid, otherwise a string describing the error.
 */
export function weightInputIsValid(input: string): boolean | string {
    if (isNumber(input) && parseFloat(input) > 0) {
        return true
    }

    return 'The weight of the product must be specified. It must be entered as a positive decimal number, e.g., 0.5'
}

/**
 * Determines whether the input string is a valid representation of the number of days within which a product version can be returned.
 * @param input The input string representing the number of days.
 * @returns Returns true if the input is a valid positive integer or 0, else returns a descriptive error message.
 */
export function canBeReturnedWithinNumberOfDaysInputIsValid(
    input: string
): boolean | string {
    if (isNumber(input) && parseInt(input) >= 0) {
        return true
    }

    return 'Information on how long the product version can be returned must be provided. It must be entered as a positive integer or 0.'
}
