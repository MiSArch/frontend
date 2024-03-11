<template>
    <router-view />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from './store/app'
import { watch } from 'vue'

const store = useAppStore()

const { activeUserRole } = storeToRefs(store)

watch(
    () => activeUserRole.value,
    async () => {
        store.restoreTheShoppingCart()
    }
)

const tokenIsStillRequiredForTesting = true
const logToken =
    process.env.NODE_ENV === 'development' || tokenIsStillRequiredForTesting
store.initLogin(logToken)
</script>
