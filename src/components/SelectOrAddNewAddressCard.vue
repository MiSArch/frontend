<template>
    <v-card>
        <v-card-item>
            <v-card-title class="text-capitalize"
                >{{ props.purpose }} address</v-card-title
            >
        </v-card-item>
        <v-card-text v-if="selectedAddress" class="text-body-2">
            {{ selectedAddress?.companyName }}<br />
            {{ selectedAddress?.street1 }}<br />
            {{ selectedAddress?.street2 }}<br />
            {{ selectedAddress?.city }}<br />
            {{ selectedAddress?.postalCode }}<br />
            {{ selectedAddress?.country }}<br />
        </v-card-text>
        <v-card-text>
            <v-select
                clearable
                hint="Select one of your previously saved addresses."
                item-title="street1"
                item-value="id"
                :items="addresses"
                :label="capitalize(props.purpose) + ' Address'"
                :persistent-hint="!selectedAddress"
                return-object
                v-model="selectedAddress"
            ></v-select>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                prepend-icon="mdi-home-plus"
                @click="userWantsToAddNewAddress"
                >use different address</v-btn
            >
        </v-card-actions>
        <v-expand-transition>
            <div v-show="showExpansion">
                <v-divider></v-divider>
                <v-card-text
                    >Enter your {{ props.purpose }} address.</v-card-text
                >
                <v-card-text>
                    <v-form v-model="newAddressIsValid">
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="name"
                                        prepend-icon="mdi-account"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="name"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        hint="optional"
                                        label="company name"
                                        persistent-hint
                                        prepend-icon="mdi-domain"
                                        type="input"
                                        variant="underlined"
                                        v-model="companyName"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="street 1"
                                        prepend-icon="mdi-mailbox"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="street"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="street 2"
                                        prepend-icon="mdi-mailbox"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="extraStreetInfo"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="city"
                                        prepend-icon="mdi-home-city"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="city"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="postal code"
                                        prepend-icon="mdi-numeric"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="postalCode"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="8">
                                    <v-text-field
                                        class="text-capitalize"
                                        clearable
                                        label="country"
                                        prepend-icon="mdi-earth"
                                        required
                                        :rules="[inputIsRequired]"
                                        type="input"
                                        variant="underlined"
                                        v-model="country"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :disabled="!newAddressIsValid"
                        prepend-icon="mdi-content-save"
                        @click="saveAddress"
                        >save address</v-btn
                    >
                </v-card-actions>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import {
    CreateUserAddressInput,
    CreateUserAddressMutation,
} from '@/graphql/generated'
import { AddressImpl } from '@/model/classes/AddressImpl'
import { Address } from '@/model/interfaces/Address'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import {
    awaitActionAndPushErrorIfNecessary,
    pushErrorNotification,
} from '@/util/errorHandler'
import { inputIsRequired } from '@/util/rules'
import { capitalize } from '@/util/string'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const props = defineProps({
    purpose: {
        type: String,
        required: true,
    },
    address: {
        type: [AddressImpl],
    },
    triggerForQueryingOfAddresses: {
        type: Number,
        default: 0,
    },
})

watch(
    () => props.address,
    () => onAddressChanged()
)

const emits = defineEmits(['update:address', 'newAddressSaved'])

const store = useAppStore()
const { currentUserId } = storeToRefs(store)

const client = useClient()

const selectedAddress = ref<Address | null | undefined>(props.address)

watch(
    () => selectedAddress.value,
    () => onSelectedAddressChanged()
)

const idOfSelectedAddress = ref<string | undefined>(props.address?.id)

const internalTriggerForQueryingOfAddresses = ref<number>(
    props.triggerForQueryingOfAddresses
)

watch(
    () => props.triggerForQueryingOfAddresses,
    () => onTriggerForQueryingOfAddressesChanged()
)

const getAddressesQuery = asyncComputed(
    async () => {
        internalTriggerForQueryingOfAddresses.value
        return await client.getActiveAddressesOfCurrentUser()
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getActiveAddressesOfCurrentUser,
                e
            ),
        shallow: false,
    }
)

watch(
    () => getAddressesQuery.value,
    () => onGetAddressQueryChanged()
)

const addresses = computed(() => {
    if (getAddressesQuery.value == undefined) {
        return
    }

    const nodes = getAddressesQuery.value.currentUser?.addresses.nodes
    if (nodes == undefined) {
        return
    }

    return nodes.map(
        (address) =>
            new AddressImpl(
                address.id,
                address.street1,
                address.street2,
                address.city,
                address.postalCode,
                address.country,
                address.companyName ?? undefined
            )
    )
})

const showExpansion = ref<boolean>(false)

const name = ref<string | null | undefined>(null)
const companyName = ref<string | null | undefined>(null)
const street = ref<string | null | undefined>(null)
const extraStreetInfo = ref<string | null | undefined>(null)
const city = ref<string | null | undefined>(null)
const postalCode = ref<string | null | undefined>(null)
const country = ref<string | null | undefined>(null)

const newAddressIsValid = ref<boolean | null | undefined>(null)

const newAddressIsNotValid = computed(() => {
    return (
        newAddressIsValid.value == undefined ||
        newAddressIsValid.value === false
    )
})

/**
 * Sets the selected address to null and shows the expansion.
 */
function userWantsToAddNewAddress(): void {
    selectedAddress.value = null
    showExpansion.value = true
}

/**
 * Saves the address information.
 * If the new address is not valid or if any required fields are undefined, the function returns early.
 * @returns A Promise that resolves once the address is saved.
 */
async function saveAddress(): Promise<void> {
    if (newAddressIsNotValid.value) {
        return
    }

    if (
        city.value == undefined ||
        country.value == undefined ||
        postalCode.value == undefined ||
        street.value == undefined ||
        extraStreetInfo.value == undefined
    ) {
        return
    }

    const input: CreateUserAddressInput = {
        city: city.value,
        companyName: companyName.value,
        country: country.value,
        postalCode: postalCode.value,
        street1: street.value,
        street2: extraStreetInfo.value,
        userId: currentUserId.value,
    }

    const response: CreateUserAddressMutation =
        await awaitActionAndPushErrorIfNecessary(() => {
            return client.createUserAddress({
                input: input,
            })
        }, errorMessages.createUserAddress)

    emits('newAddressSaved')
    idOfSelectedAddress.value = response.createUserAddress.id
    queryAddressesOnceAgain()
    clearInputForm()
}

/**
 * Triggers querying of addresses once again:
 * Decrements the internal trigger count for querying of addresses.
 */
function queryAddressesOnceAgain(): void {
    internalTriggerForQueryingOfAddresses.value--
}

/**
 * Clears the input fields of the form.
 */
function clearInputForm(): void {
    name.value = null
    companyName.value = null
    street.value = null
    extraStreetInfo.value = null
    city.value = null
    postalCode.value = null
    country.value = null
}

/**
 * Applies the value of the address prop to the refs selectedAddress and idOfSelectedAddress.
 */
function onAddressChanged(): void {
    selectedAddress.value = props.address
    idOfSelectedAddress.value = props.address?.id
}

/**
 * Emits the update event for the address prop and closes the expansion if a selected address is present.
 */
function onSelectedAddressChanged(): void {
    emits('update:address', selectedAddress.value)

    if (selectedAddress.value) {
        showExpansion.value = false
    }
}

/**
 * Sets the internal trigger for querying of addresses to the value from the triggerForQueryingOfAddresses prop.
 */
function onTriggerForQueryingOfAddressesChanged(): void {
    internalTriggerForQueryingOfAddresses.value =
        props.triggerForQueryingOfAddresses
}

/**
 * If the idOfSelectedAddress ref is different from the selected address, triggers selection of that address.
 */
function onGetAddressQueryChanged(): void {
    if (
        idOfSelectedAddress.value &&
        idOfSelectedAddress.value !== selectedAddress.value?.id
    ) {
        selectAddress(idOfSelectedAddress.value)
    }
}

/**
 * Selects an address by its ID.
 * @param id - The ID of the address to select.
 */
function selectAddress(id: string): void {
    if (typeof id !== 'string') {
        return
    }
    const foundAddress =
        addresses.value?.find((address) => address.id === id) ?? null
    console.log(foundAddress)
    selectedAddress.value = foundAddress
}
</script>
