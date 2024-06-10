<template>
    <div class="d-flex justify-center">
        <div class="d-flex flex-column w-75 ga-4">
            <SelectOrAddNewAddressCard
                purpose="delivery"
                :trigger-for-querying-of-addresses="
                    triggerForQueryingOfDeliveryAddresses
                "
                v-model:address="selectedDeliveryAddress"
                @new-address-saved="triggerForQueryingOfBillingAddresses++"
            />
            <v-text-field
                clearable
                hint="A valid VATIN consists of uppercase letters and digits. It starts with a country code, followed by 2 to 13 digits or letters. Hyphens are allowed for readability."
                label="VAT Identification Number"
                prepend-icon="mdi-card-account-details"
                :rules="[isUndefinedOrEmptyStringOrValidVATIN]"
                type="input"
                variant="underlined"
                v-model="order.vatNumber"
            ></v-text-field>
            <v-checkbox
                label="The billing address differs from the delivery address."
                v-model="billingAddressDiffersFromDeliveryAddress"
            ></v-checkbox>
            <SelectOrAddNewAddressCard
                v-show="billingAddressDiffersFromDeliveryAddress"
                purpose="billing"
                :trigger-for-querying-of-addresses="
                    triggerForQueryingOfBillingAddresses
                "
                v-model:address="selectedBillingAddress"
                @new-address-saved="triggerForQueryingOfDeliveryAddresses++"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import SelectOrAddNewAddressCard from '@/components/SelectOrAddNewAddressCard.vue'
import { AddressImpl } from '@/model/classes/addressImpl'
import { useAppStore } from '@/store/app'
import { isUndefinedOrEmptyStringOrValidVATIN } from '@/util/rules'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const store = useAppStore()
const { upcomingOrder: order } = storeToRefs(store)

const triggerForQueryingOfDeliveryAddresses = ref<number>(0)

const selectedDeliveryAddress = ref<AddressImpl | undefined>(
    order.value.deliveryAddress
)

watch(
    () => selectedDeliveryAddress.value,
    () => onSelectedDeliveryAddressChanged()
)

const triggerForQueryingOfBillingAddresses = ref<number>(0)

const selectedBillingAddress = ref<AddressImpl | undefined>(
    order.value.billingAddress
)

watch(
    () => selectedBillingAddress.value,
    () => updateBillingAddressOfOrderInformation()
)

const billingAddressDiffersFromDeliveryAddress = ref(
    order.value.billingAddress?.id !== order.value.deliveryAddress?.id
)

watch(
    () => billingAddressDiffersFromDeliveryAddress.value,
    () => {
        if (billingAddressDiffersFromDeliveryAddress.value === false) {
            selectedBillingAddress.value = selectedDeliveryAddress.value
        } else {
            selectedBillingAddress.value = undefined
        }
    }
)

/**
 * Function called when the selected delivery address is changed.
 * Updates the delivery address of the order information.
 * If the billing address does not differ from the delivery address,
 * sets the selected billing address to the selected delivery address.
 */
function onSelectedDeliveryAddressChanged() {
    updateDeliveryAddressOfOrderInformation()

    if (billingAddressDiffersFromDeliveryAddress.value === false) {
        selectedBillingAddress.value = selectedDeliveryAddress.value
    }
}

/**
 * Updates the delivery address of the order information to the currently selected delivery address.
 */
function updateDeliveryAddressOfOrderInformation(): void {
    order.value.deliveryAddress = selectedDeliveryAddress.value
}

/**
 * Updates the billing address of the order information to the currently selected billing address.
 */
function updateBillingAddressOfOrderInformation() {
    order.value.billingAddress = selectedBillingAddress.value
}
</script>
