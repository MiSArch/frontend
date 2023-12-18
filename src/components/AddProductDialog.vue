<template>
    <v-dialog
        v-model="addProductDialogIsActive"
        fullscreen
        scrollable
        transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar
                dark
                color="primary"
            >
                <v-btn
                    dark
                    icon
                    @click="addProductDialogIsActive = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Product</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn>Add Product</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <div
                class="d-flex flex-column pa-4"
            >
                <v-switch
                    label="Visible"
                ></v-switch>
                <v-text-field
                    clearable
                    label="Product Name"
                >
                </v-text-field>
                <v-select
                    density="compact"
                    label="Default Product Variant"
                    :items="['Bar', 'Baz', 'Zep']"
                    variant="solo"
                ></v-select>
                <v-tabs
                    v-model="tabs"
                >
                    <v-tab
                        v-for="n in variants"
                        :key="n"
                        :value="'tab-' + n"
                    >
                        Product Variant {{ n }}
                    </v-tab>
                </v-tabs>
                <v-window
                    v-model="tabs"
                >
                    <v-window-item
                        v-for="n in variants"
                        :key="n"
                        :value="'tab-' + n"
                    >
                        <v-card
                            class="pa-8"
                            flat
                        >
                            <v-switch
                                label="Visible"
                            ></v-switch>
                            <v-text-field
                                clearable
                                label="Product Variant Name"
                            >
                            </v-text-field>
                            <v-textarea
                                clearable
                                label="Description"
                            >
                            </v-textarea>
                            <v-text-field
                                clearable
                                label="Retail Price"
                            >
                            </v-text-field>
                            <v-text-field
                                clearable
                                label="Actual Price"
                            >
                            </v-text-field>
                            <v-select
                                label="Categories"
                                :items="['Photography', 'Sports', 'Music']"
                                multiple
                                variant="solo"
                            ></v-select>
                            <v-file-input
                                accept="image/*"
                                chips
                                clearable
                                counter
                                label="Add Images"
                                multiple
                                show-size
                                variant="outlined"
                            ></v-file-input>
                            <v-card-actions>
                                <v-btn
                                    prepend-icon="mdi-close"
                                >Remove Product Variant</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
    import { ref } from "vue";

    const addProductDialogIsActive = ref(true);

    const tabs = ref(true);
    const variants = ref(3);
</script>