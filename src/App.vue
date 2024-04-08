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

store.initLogin(true)
</script>
