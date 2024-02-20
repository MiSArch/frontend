<template>
    <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from './store/app'

const store = useAppStore()

const tokenIsStillRequiredForTesting = true
const logToken =
    process.env.NODE_ENV === 'development' || tokenIsStillRequiredForTesting
store.initLogin(logToken)
</script>
