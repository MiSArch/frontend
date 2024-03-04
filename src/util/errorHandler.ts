import { Notification, useAppStore } from '@/store/app'

/**
 * Trys to await an action and pushes an error notification
 * if the action throws an error.
 * @param action The action to execute.
 * @param errorMessage The error message to display if an error occurres.
 * @param titleOfErrorNotification An optional title for the notification.
 */
export async function awaitActionAndPushErrorIfNecessary<T>(
    action: () => Promise<T>,
    errorMessage: string,
    titleOfErrorNotification?: string
): Promise<T> {
    try {
        return await action()
    } catch (error) {
        pushErrorNotification(errorMessage, error, titleOfErrorNotification)
        throw error
    }
}

/**
 * Trys to perform an action and pushes an error notification
 * if the action throws an error.
 * @param action The action to execute.
 * @param errorMessage The error message to display if an error occurres.
 * @param titleOfErrorNotification An optional title for the notification.
 */
export function doActionAndPushErrorIfNecessary<T>(
    action: () => T,
    errorMessage: string,
    titleOfErrorNotification?: string
): T {
    try {
        return action()
    } catch (error) {
        pushErrorNotification(errorMessage, error, titleOfErrorNotification)
        throw error
    }
}

/**
 * Pushes a new error notification to be displayed.
 * @param text The text of the error notification.
 * @param error The error 'behind' the notification.
 * @param title An optional title for the notification.
 */
export function pushErrorNotification(
    text: string,
    error: unknown,
    title?: string
) {
    logErrorWithToString(error)

    const errorNotification: Notification = {
        text: text,
        title: title,
        type: 'error',
    }
    pushNotification(errorNotification)
}

/**
 * Logs an error to the console.
 * @param error The error to log.
 * @param toString An optional function that is expected to return a string representation of the given error.
 */
function logErrorWithToString(
    error: unknown,
    toString: (error: unknown) => string = String
): void {
    if (typeof toString === 'function') {
        console.error(toString(error))
    } else {
        console.error(error)
    }
}

/**
 * Pushes the given notification to the app store's notification queue.
 * @param notification The notification to push to the app store's notification queue.
 */
function pushNotification(notification: Notification) {
    const store = useAppStore()
    store.pushNotification(notification)
}
