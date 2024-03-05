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
