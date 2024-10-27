import './bootstrap';
import { createInertiaApp } from '@inertiajs/svelte';
import Layout from "./Components/Layout.svelte"

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        const page = pages[`./Pages/${name}.svelte`]
        return { default: page.default, layout: page.layout || Layout }
    },
    setup({ el, App, props }) {
        new App({ target: el, props })
    }
})
