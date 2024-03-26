<template>
    <v-toolbar density="comfortable">
        <v-toolbar-title>Wishlists</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" @click="openAddWishlistDialog">
            Add Wishlist
        </v-btn>
        <AddWishlistDialog
            v-model="addWishlistDialogOpen"
            @add-wishlist="addWishlist"
            @close-addwishlistdialog="closeAddWishlistDialog"
        />
    </v-toolbar>
    <v-list
        v-if="wishlists && wishlists.totalCount > 0"
        class="mx-2"
        lines="two"
    >
        <v-list-item
            v-for="wishlist in wishlists.nodes"
            :title="wishlist.name"
            :value="wishlist.id"
            @click="navigateToWishlist(wishlist.id)"
        >
            <v-list-item-subtitle>
                Last updated <RelativeTime :time="wishlist.lastUpdatedAt" />
            </v-list-item-subtitle>
            <template v-slot:append>
                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    @click="deleteWishlist(wishlist.id)"
                >
                </v-btn>
            </template>
        </v-list-item>
    </v-list>
    <v-pagination
        v-model="currentPage"
        :length="pageCount"
        rounded="circle"
    ></v-pagination>
</template>

<script lang="ts" setup>
import AddWishlistDialog from '@/components/AddWishlistDialog.vue'
import RelativeTime from '@/components/RelativeTime.vue'
import { useClient } from '@/graphql/client'
import {
    CreateWishlistInput,
    OrderDirection,
    WishlistOrderField,
} from '@/graphql/generated'
import { routeNames } from '@/router/routeNames'
import { useAppStore } from '@/store/app'
import { errorMessages } from '@/strings/errorMessages'
import {
    pushErrorNotification,
    awaitActionAndPushErrorIfNecessary,
} from '@/util/errorHandler'
import { asyncComputed } from '@vueuse/core'
import { stringify } from 'querystring'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The app store.
 */
const store = useAppStore()

/**
 * The router.
 */
const router = useRouter()

/**
 * The page of wishlists that is displayed.
 */
const currentPage = ref(1)

/**
 * The maximum number of wishlists a page can contain.
 */
const perPage = ref(5)

/**
 * This prop is used for triggering a reevaluation
 * of the async computed prop 'wishlists'.
 */
const trigger = ref(0)

/**
 * The wishlists of the currently logged in user.
 */
const wishlists = asyncComputed(
    async () => {
        trigger.value

        if (store.isLoggedIn && typeof store.currentUserId === 'string') {
            const user = await client.getUserWithWishlists({
                userId: store.currentUserId,
                firstWishlists: perPage.value,
                skipWishlist: (currentPage.value - 1) * perPage.value,
                orderWishlistsBy: {
                    direction: OrderDirection.Desc,
                    field: WishlistOrderField.LastUpdatedAt,
                },
            })

            if (user.user.wishlists) {
                return user.user.wishlists
            } else {
                return null
            }
        }
    },
    null,
    {
        onError: (e) =>
            pushErrorNotification(errorMessages.getUserWithWishlists, e),
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
 * Computes how many pages there are
 * depending on the maximum number of wishlists a page can contain.
 */
const pageCount = computed(() => {
    const totalCount = wishlists.value?.totalCount
    if (!totalCount) {
        return 0
    } else {
        return Math.ceil(totalCount / perPage.value)
    }
})

/**
 * Deletes the wishlist matching the given id.
 * @param id The id of the wishlist to delete.
 */
async function deleteWishlist(id: any) {
    await awaitActionAndPushErrorIfNecessary(() => {
        return client.deleteWishlist({
            id: id,
        })
    }, errorMessages.deleteWishlist)

    reevaluateWishlists()
}

/**
 * Whether or not the "ADD WISHLIST" dialog is open.
 */
const addWishlistDialogOpen = ref(false)

/**
 * Opens the "ADD WISHLIST" dialog.
 */
function openAddWishlistDialog() {
    addWishlistDialogOpen.value = true
}

/**
 * Closes the "ADD WISHLIST" dialog.
 */
function closeAddWishlistDialog() {
    addWishlistDialogOpen.value = false
}

/**
 * Tries to add a new wishlist.
 * @param input The wishlist to add.
 */
async function addWishlist(input: CreateWishlistInput) {
    closeAddWishlistDialog()

    await awaitActionAndPushErrorIfNecessary(() => {
        return client.addWishlist({
            input: input,
        })
    }, errorMessages.addWishlist)

    reevaluateWishlists()
}

/**
 * Navigates to the wishlist matching the given ID.
 * @param wishlistId The ID of the wishlist to navigate to.
 */
function navigateToWishlist(wishlistId: any) {
    router.push({
        name: routeNames.wishlist,
        params: {
            wishlistid: wishlistId,
        },
    })
}
</script>
