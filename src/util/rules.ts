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
 * Checks if the input is required.
 * Returns true if the input is a non-empty string, otherwise returns a string indicating it is mandatory.
 * @param input - The input to check.
 * @returns True if the input is a non-empty string, otherwise 'Mandatory'.
 */
export function inputIsRequired(input: string): boolean | string {
    if (typeof input === 'string' && input.length > 0) {
        return true
    } else {
        return 'Mandatory'
    }
}

/**
 * Checks if the provided string is a valid credit card number.
 * @param input - The credit card number to validate.
 * @returns - Returns true if the input is a valid credit card number,
 * otherwise returns a string indicating the validation error
 * or false if the input is empty or not a string.
 */
export function isValidCreditCardNumber(input: string): boolean | string {
    if (typeof input !== 'string' || input.length === 0) {
        return false
    }

    // Remove white space characters from the input string
    const strippedInput = input.replace(/\s/g, '')

    // Check if the stripped input contains only digits and has a length between 12 and 16
    if (/^\d{12,16}$/.test(strippedInput)) {
        return true
    } else {
        return 'Please enter a valid credit card number with 12 to 16 digits.'
    }
}

/**
 * Checks if the provided string is a valid credit card expiration date in the MM/YY or MM/YYYY format.
 * @param input - The expiration date to validate.
 * @returns - Returns true if the input is a valid expiration date,
 * otherwise returns a string indicating the validation error
 * or false if the input is empty or not a string.
 */
export function isValidCreditCardExpirationDate(
    input: string
): boolean | string {
    if (typeof input !== 'string' || input.length === 0) {
        return false
    }

    const regex = /^(0[1-9]|1[0-2])\/(20)?\d{2}$/ // Regular expression to match MM/YY or MM/YYYY format

    if (regex.test(input)) {
        return true
    } else {
        return 'The input does not match the MM/YY or MM/YYYY format. Example: 01/24 or 01/2024'
    }
}
