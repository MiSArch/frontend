<template>
    <div class="d-flex justify-center">
        <div class="d-flex h-auto w-75">
            <v-virtual-scroll :items="order.items">
                <template v-slot:default="{ item }">
                    <v-list-item>
                        <OrderItem :order-item="item">
                            <template v-slot:shipmentMethod>
                                <div class="my-4">
                                    <ShipmentMethodOfOrderItem
                                        :order-item="item"
                                    />
                                </div>
                            </template>
                        </OrderItem>
                    </v-list-item>
                </template>
            </v-virtual-scroll>
        </div>
    </div>
</template>

<script lang="ts" setup>
import OrderItem from '@/components/OrderItem.vue'
import ShipmentMethodOfOrderItem from '@/components/ShipmentMethodOfOrderItem.vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'

const { order } = storeToRefs(useAppStore())
</script>
