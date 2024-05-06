<template>
    <v-app>
        <v-main>
            <TheAppBar />
            <div ref="reactContainer" class="graphiql-container" />
        </v-main>
    </v-app>
</template>
<script setup lang="ts">
import TheAppBar from '@/layouts/default/TheAppBar.vue'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { onMounted, ref } from 'vue'
import { GraphiQL, GraphiQLProps } from 'graphiql'
import { explorerPlugin } from '@graphiql/plugin-explorer'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import 'graphiql/graphiql.min.css'
import '@graphiql/plugin-explorer/dist/style.css'
import { useAppStore } from '@/store/app'

const reactContainer = ref()
const store = useAppStore()

/**
 * Fetcher for GraphiQL that includes the Authorization header.
 */
const gqlFetcher = createGraphiQLFetcher({
    url: '/api/graphql',
    fetch: async (input, init) => {
        const headers = init?.headers
            ? new Headers(init.headers)
            : new Headers()
        headers.set(
            'Authorization',
            `Bearer ${await store.getAccessToken(true)}`
        )
        return fetch(input, { ...init, headers })
    },
})

/**
 * A GraphiQL component with the Explorer plugin.
 */
function GraphiQLWithExplorer() {
    var [query, setQuery] = React.useState('')
    var [variables, setVariables] = React.useState('')
    // @ts-ignore-next-line taken from official example, however types seem to be incorrect
    const plugin = explorerPlugin()
    const props: GraphiQLProps = {
        fetcher: gqlFetcher,
        isHeadersEditorEnabled: false,
        shouldPersistHeaders: true,
        plugins: [plugin],
        query: query,
        onEditQuery: setQuery,
        variables: variables,
        onEditVariables: setVariables,
    }
    // @ts-ignore-next-line taken from official example, however some types seem to conflict
    return React.createElement(GraphiQL, props)
}

onMounted(() => {
    const root = createRoot(reactContainer.value)
    root.render(React.createElement(GraphiQLWithExplorer))
})
</script>
<style scoped>
.graphiql-container {
    height: calc(100vh - 56px);
}
</style>
