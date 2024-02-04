<template>
    <v-toolbar density="comfortable">
        <v-toolbar-title>Wishlists</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" @click="openAddWishlistDialog">
            Add Wishlist
        </v-btn>
        <AddWishlistDialog
            :user-id="userId"
            v-model="addWishlistDialogOpen"
            @add-wishlist="addWishlist"
            @close-addwishlistdialog="closeAddWishlistDialog"
        />
    </v-toolbar>
    <v-alert
        class="ma-2"
        closable
        density="comfortable"
        text="An error occurred when trying to add the wishlist."
        title="Could not add wishlist"
        type="error"
        v-model="addingWishlistFailed"
    ></v-alert>
    <v-alert
        class="ma-2"
        closable
        density="comfortable"
        text="An error occurred when trying to delete the wishlist."
        title="Could not delete wishlist"
        type="error"
        v-model="deletingWishlistFailed"
    ></v-alert>
    <v-list
        v-if="wishlists"
        v-for="wishlist in (wishlists as any).nodes"
        class="mx-2"
        lines="two"
        variant="outlined"
    >
        <v-list-item :title="wishlist.name">
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
    AddWishlistInput,
    OrderDirection,
    WishlistOrderField,
} from '@/graphql/generated'
import { asyncComputed } from '@vueuse/core'
import { computed, ref } from 'vue'

/**
 * The id of the currently logged in user.
 * As of now, there is no value available.
 */
const userId = ref('')

/**
 * The GraphQL client to use for all GraphQL requests.
 */
const client = useClient()

/**
 * The page of wishlists that is displayed.
 */
const currentPage = ref(1)

/**
 * The maximum number of wishlists a page can contain.
 */
const perPage = ref(5)

/**
 * Dummy data to dispaly some wishlists -- for testing and showcasing purposes only.
 */
const dummyWishlists = computed(() => {
    return {
        totalCount: 2,
        hasNextPage: false,
        nodes: [
            {
                id: '1',
                name: 'My Wishlist 1',
                createdAt: '2024-01-24T21:50:53.061Z',
                lastUpdatedAt: '2024-01-24T21:50:53.061Z',
                productVariants: {
                    totalCount: 0,
                },
            },
            {
                id: '2',
                name: 'My Wishlist 2',
                createdAt: '2024-01-26T10:29:07.398Z',
                lastUpdatedAt: '2024-01-26T10:29:07.398Z',
                productVariants: {
                    totalCount: 0,
                },
            },
        ],
    }
})

/**
 * The wishlists of the currently logged in user.
 */
const wishlists = asyncComputed(
    async () => {
        try {
            const user = await client.getUserWithWishlists({
                userId: userId,
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
        } catch (error) {
            console.log(error)

            return dummyWishlists.value
        }
    },
    null,
    { shallow: false }
)

/**
 * Triggers the reevaluation of the ref 'wishlists'.
 */
function triggerReevaluationOfWishlists() {
    // TODO Implement
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
 * Whether or not deleting a specific wishlist failed.
 * This property decides whether or not an alert has to be shown to the user.
 */
const deletingWishlistFailed = ref(false)

/**
 * Deletes the wishlist matching the given id.
 * @param id The id of the wishlist to delete.
 */
async function deleteWishlist(id: any) {
    deletingWishlistFailed.value = false
    try {
        console.log(id)
        await client.deleteWishlist(id)

        triggerReevaluationOfWishlists()
    } catch (error) {
        deletingWishlistFailed.value = true

        console.log(error)
    }
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
 * Whether or not adding a new wishlist failed.
 * This property decides whether or not an alert has to be shown to the user.
 */
const addingWishlistFailed = ref(false)

/**
 * Tries to add a new wishlist.
 * @param input The wishlist to add.
 */
async function addWishlist(input: AddWishlistInput) {
    closeAddWishlistDialog()

    addingWishlistFailed.value = false
    try {
        await client.addWishlist({
            input: input,
        })

        triggerReevaluationOfWishlists()
    } catch (error) {
        addingWishlistFailed.value = true

        console.error(error)
    }
}
</script>
