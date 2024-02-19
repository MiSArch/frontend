<template>
    <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from './store/app'

const store = useAppStore()

const logToken = process.env.NODE_ENV === 'development'
store.initLogin(logToken)
</script>
