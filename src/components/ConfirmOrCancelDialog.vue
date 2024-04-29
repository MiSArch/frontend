<template>
    <v-dialog max-width="500">
        <v-card>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="emits('confirmed')"
                    >Confirm</v-btn
                >
                <v-btn color="error" @click="emits('canceled')">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
defineProps({
    message: {
        type: String,
        required: true,
    },
})

const emits = defineEmits<{
    (event: 'canceled'): void
    (event: 'confirmed'): void
}>()
</script>
