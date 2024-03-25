/**
 * Capitalizes the first letter of a given string.
 * If the input is not a string, returns undefined.
 * @param string - The string to capitalize.
 * @returns The capitalized string, or undefined if the input is not a string.
 */
export function capitalize(string: string): string | undefined {
    if (typeof string !== 'string') {
        return
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}
