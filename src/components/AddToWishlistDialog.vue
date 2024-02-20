<template>
    <v-dialog max-height="504" max-width="504">
        <v-card>
            <v-card-item>
                <v-card-title>Add Or Remove Product</v-card-title>
            </v-card-item>
            <v-card-text>
                By selecting or deselecting a wishlist, you decide whether the
                product variant should be on the wishlist or not.
            </v-card-text>
            <v-card-text v-if="wishlists != null && wishlists">
                <v-list lines="one" select-strategy="classic">
                    <v-list-subheader>Wishlists</v-list-subheader>
                    <v-list-item
                        v-for="wishlist in (wishlists as any).nodes"
                        :key="wishlist.id"
                        :active="idsOfSelectedWishlists.includes(wishlist.id)"
                        :value="wishlist.id"
                        @click="changeSelection(wishlist.id)"
                    >
                        <template v-slot:prepend="{ isActive }">
                            <v-list-item-action start>
                                <v-checkbox-btn
                                    :model-value="isActive"
                                ></v-checkbox-btn>
                            </v-list-item-action>
                        </template>
                        <v-list-item-title>{{
                            wishlist.name
                        }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    density="compact"
                    prepend-icon="mdi-open-in-new"
                    @click="goToWishlists"
                    >Go To Wishlists</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-close" @click="cancel"> Cancel </v-btn>
                <v-btn prepend-icon="mdi-content-save" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useClient } from '@/graphql/client'
import { UpdateWishlistInput } from '@/graphql/generated'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import { pushErrorNotification } from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { computed, ref } from 'vue'

/**
 * The props of this component.
 */
const props = defineProps({
    productVariantId: {
        type: String,
        required: true,
    },
})

/**
 * The emits of this component:
 * close-addtowishlistdialog -- The dialog has to be closed.
 * update-wishlists -- The given wishlists have to be updated.
 * go-to-wishlists -- The user wants to navigate to the wishlists view.
 */
const emit = defineEmits<{
    (event: 'close-addtowishlistdialog'): void
    (event: 'update-wishlists', input: UpdateWishlistInput[]): void
    (event: 'go-to-wishlists'): void
}>()

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The IDs of the wishlists that have been selected by the user.
 * Wishlists already containing the given product variant
 * before the user has made any interaction with the dialog
 * are also contained in this array.
 */
const idsOfSelectedWishlists = ref<string[]>([])

/**
 * This prop is used for triggering a reevaluation
 * of the async computed prop 'wishlists'.
 */
const trigger = ref(0)

/**
 * The wishlists of the  user.
 */
const wishlists = asyncComputed(
    async () => {
        trigger.value

        const userId = useAppStore().currentUserId
        if (userId == null || !userId) {
            return
        }

        const user = await client.getUserWithWishlistsWithProductVariants({
            userId: userId,
        })

        if (user.user.wishlists) {
            idsOfSelectedWishlists.value = user.user.wishlists.nodes
                .filter(
                    (wishlist) =>
                        wishlist.productVariants.nodes.filter(
                            (productVariant) =>
                                productVariant.id == props.productVariantId
                        ).length > 0
                )
                .map((wishlist) => wishlist.id)

            return user.user.wishlists
        } else {
            return null
        }
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(
                errorMessages.getUserWithWishlistsWithProductVariants,
                e
            ),
        shallow: false,
    }
)

/**
 * Triggers the reevaluation of the wishlists.
 */
function reevaluateWishlists() {
    trigger.value++
}

/**
 * The wishlists already containing the given product variant
 * before the user has made any interaction with the dialog.
 */
const wishlistsAlreadyContainingProductVariant = computed(() => {
    if (wishlists.value != null) {
        return wishlists.value?.nodes.filter(
            (wishlist) =>
                wishlist.productVariants.nodes.filter(
                    (productVariant) =>
                        productVariant.id == props.productVariantId
                ).length > 0
        )
    } else {
        return []
    }
})

/**
 * The IDs of the wishlists already containing the given product variant
 * before the user has made any interaction with the dialog.
 */
const idsOfWishlistsAlreadyContainingProductVariant = computed(() => {
    return wishlistsAlreadyContainingProductVariant.value.map(
        (wishlist) => wishlist.id
    )
})

/**
 * Resets every mutable property of this view.
 */
function resetViewModel() {
    idsOfSelectedWishlists.value =
        idsOfWishlistsAlreadyContainingProductVariant.value
}

/**
 * Removes a wishlist ID from idsOfSelectedWishlists if it is part of the array or
 * adds a wishlist ID to idsOfSelectedWishlists if it is not part of the array.
 * @param wishlistId The ID to remove or add.
 */
function changeSelection(wishlistId: string) {
    if (idsOfSelectedWishlists.value.includes(wishlistId)) {
        idsOfSelectedWishlists.value = idsOfSelectedWishlists.value.filter(
            (id) => id != wishlistId
        )
    } else {
        idsOfSelectedWishlists.value = idsOfSelectedWishlists.value.concat([
            wishlistId,
        ])
    }
}

/**
 * Has the view model reset and
 * emits the 'close-addtowishlistdialog' event.
 */
function cancel() {
    emit('close-addtowishlistdialog')

    resetViewModel()
}

/**
 * Emits the 'update-wishlists' event and
 * has the view model reset
 * if there are any wishlists and
 * if a selection has been made.
 */
function save() {
    if (
        wishlists.value == null ||
        !wishlists.value ||
        wishlists.value.totalCount == 0 ||
        idsOfSelectedWishlists.value ==
            idsOfWishlistsAlreadyContainingProductVariant.value
    ) {
        cancel()
    } else {
        var input: UpdateWishlistInput[] = []

        idsOfSelectedWishlists.value.forEach((wishlistId) => {
            if (
                !idsOfWishlistsAlreadyContainingProductVariant.value.includes(
                    wishlistId
                )
            ) {
                const addToWishlistInput: UpdateWishlistInput = {
                    id: wishlistId,
                    productVariantIds: wishlists.value?.nodes
                        .find((wishlist) => wishlist.id == wishlistId)
                        ?.productVariants.nodes.map(
                            (productVariant) => productVariant.id
                        )
                        .concat([props.productVariantId]),
                }

                input = input.concat([addToWishlistInput])
            }
        })

        idsOfWishlistsAlreadyContainingProductVariant.value.forEach(
            (wishlistId) => {
                if (!idsOfSelectedWishlists.value.includes(wishlistId)) {
                    const removeFromWishlistInput: UpdateWishlistInput = {
                        id: wishlistId,
                        productVariantIds: wishlists.value?.nodes
                            .find((wishlist) => wishlist.id == wishlistId)
                            ?.productVariants.nodes.map(
                                (productVariant) => productVariant.id
                            )
                            .filter((id) => id != props.productVariantId),
                    }

                    input = input.concat([removeFromWishlistInput])
                }
            }
        )

        emit('update-wishlists', input)

        reevaluateWishlists()
    }
}

/**
 * Emits the 'go-to-wishlists' event and
 * has the view model reset.
 */
function goToWishlists() {
    emit('go-to-wishlists')

    resetViewModel()
}
</script>
