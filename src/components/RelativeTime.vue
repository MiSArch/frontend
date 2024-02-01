<template>
    <span v-if="timePropIsValid">
        {{ formatRelativeTime(new Date(), new Date(time)) }}
        <v-tooltip activator="parent" location="bottom">
            {{ formatAbsoluteTime(new Date(time)) }}
        </v-tooltip>
    </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    time: {
        type: String,
        required: true,
    },
    locales: {
        type: String,
        required: false,
    },
})

const timePropIsValid = computed(() => {
    return dateIsValid(new Date(props.time))
})

const units = {
    year: 365 * 24 * 60 * 60 * 1000,
    month: (365 / 12) * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
}

const relativeTime = new Intl.RelativeTimeFormat(props.locales ?? 'en-US', {
    numeric: 'auto',
})
const absoluteTime = new Intl.DateTimeFormat(props.locales ?? 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
})

/**
 * Formats the relative time between two dates.
 *
 * @param {Date} from - The starting date from which the relative time is calculated. For the UI, in most cases, this will be today's date.
 * @param {Date} to - The ending date to which the relative time is calculated. This can be 'older' than the starting date.
 * @returns {string} A string representing the relative time between the two dates.
 *                  The format is determined based on the elapsed time.
 * @throws {Error} Throws an error if an unreachable condition is encountered during
 *                 the process of determining the relative time.
 */
function formatRelativeTime(from: Date, to: Date): string {
    const elapsed = to.getTime() - from.getTime()
    for (const [unit, unitLength] of Object.entries(units)) {
        if (Math.abs(elapsed) > unitLength || unit == 'second') {
            return relativeTime.format(
                Math.round(elapsed / unitLength),
                unit as Intl.RelativeTimeFormatUnit
            )
        }
    }
    throw new Error('unreachable')
}

/**
 * Takes a Date object and uses the `absoluteTime.format` method
 * to generate a string representation of the Date object based on the
 * formatting rules of 'absoluteTime'.
 *
 * @param {Date} date - The Date object representing the absolute date and time.
 * @returns {string} A formatted string representing the given Date object.
 * 
 * @throws {Error} Throws an error if the formatting process encounters an issue.
 * 
 * @example
 * const currentDate = new Date();
 * const formattedTime = formatAbsoluteTime(currentDate);
 * console.log(formattedTime); // Prints the formatted absolute date and time
 */
function formatAbsoluteTime(date: Date): string {
    return absoluteTime.format(date)
}

/**
 * Checks if a given Date object is valid.
 *
 * A Date object is considered valid if its `getDate` method returns a valid day
 * of the month. The `getDate` method returns the day (1-31) for the specified date.
 *
 * @param {Date} date - The Date object to be checked for validity.
 * @returns {boolean} Returns true if the provided Date is valid, otherwise returns false.
 * 
 * @example
 * const validDate = new Date('2022-01-15');
 * const isValid = dateIsValid(validDate); // Returns true
 * 
 * const invalidDate = new Date('invalid date');
 * const isValid = dateIsValid(invalidDate); // Returns false
 */
function dateIsValid(date: Date): boolean {
    return !isNaN(date.getDate())
}
</script>
