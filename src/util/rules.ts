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
 * Checks whether a given input is an empty string.
 * @param input - The input value to check.
 * @returns True if the given input value is a string and it is an empty one, false otherwise.
 */
export function isEmptyString(input: string): boolean {
    return typeof input === 'string' && input.length === 0
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
 * Checks if the provided string is a valid credit card validation code.
 * @param input - The CVC to validate.
 * @returns True if the CVC is valid, otherwise returns false if the given input is not a string or an empty string,
 * otherwise returns a string inidicating a validation error.
 */
export function isValidCreditCardValidationCode(
    input: string
): boolean | string {
    if (typeof input !== 'string' || input.length === 0) {
        return false
    }

    if ((input.length === 3 || input.length === 4) && isNumber(input)) {
        return true
    } else {
        return 'Please enter a valid CVC, e.g. 128.'
    }
}

/**
 * Checks if the provided string is a valid credit card expiration date in the MM/YY or MM/YYYY format.
 * @param input - The expiration date to validate.
 * @returns - Returns true if the input is a valid expiration date and is in the future,
 * otherwise returns a string indicating the validation error or false if the input is empty or not a string.
 */
export function isValidCreditCardExpirationDate(
    input: string
): boolean | string {
    if (typeof input !== 'string' || input.length === 0) {
        return false
    }

    const regex = /^(0[1-9]|1[0-2])\/(20)?\d{2}$/ // Regular expression to match MM/YY or MM/YYYY format

    if (!regex.test(input)) {
        return 'The input does not match the MM/YY or MM/YYYY format. Example: 01/24 or 01/2024'
    }

    const currentDate = new Date()
    const inputDateParts = input.split('/')
    const inputMonth = parseInt(inputDateParts[0], 10)
    const inputYear =
        parseInt(inputDateParts[1], 10) +
        (inputDateParts[1].length === 2 ? 2000 : 0)
    const expirationDate = new Date(inputYear, inputMonth - 1) // Months are 0 indexed in JavaScript

    if (expirationDate <= currentDate) {
        return 'The expiration date must be in the future.'
    }

    return true
}

/**
 * Checks whether the input is undefined, an empty string, or a valid VAT identification number (VATIN).
 * @param input - The string to be validated.
 * @returns Returns true if the input is undefined, an empty string, or a valid VATIN. Otherwise, returns a string error message indicating the validation failure.
 */
export function isUndefinedOrEmptyStringOrValidVATIN(
    input: string | undefined
): boolean | string {
    if (input == undefined) {
        return true
    }

    if (isEmptyString(input)) {
        return true
    }

    if (isValidVATIN(input)) {
        return true
    } else {
        return 'Please enter a valid VAT identification number.'
    }
}

/**
 * Checks whether the input string is a valid VAT identification number (VATIN).
 * The pattern to match was derived from the specification of a VATIN's structure on Wikipedia:
 * https://en.wikipedia.org/wiki/VAT_identification_number
 * @param input - The string to be validated as a VATIN.
 * @returns Returns true if the input is a valid VATIN, otherwise returns false.
 */
export function isValidVATIN(input: string): boolean {
    if (typeof input === 'string' && !isEmptyString(input)) {
        const pattern: RegExp = /^([A-Z]{2}|EU|EL|XI)(?:-?[A-Z\d]){2,13}$/
        return pattern.test(input)
    } else {
        return false
    }
}
