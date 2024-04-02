<template></template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
})

onMounted(() => {
    console.log(props.orderId)
})
</script>
