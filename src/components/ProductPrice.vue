<template>
    <v-card flat>
        <v-card-item>
            <v-card-title>{{ price }} EUR</v-card-title>
            <v-card-subtitle
                class="text-decoration-line-through"
                v-if="price !== retailPrice"
            >
                {{ retailPrice }} EUR
            </v-card-subtitle>
        </v-card-item>
    </v-card>
</template>

<script lang="ts" setup>
const props = defineProps({
    price: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
})
</script>
