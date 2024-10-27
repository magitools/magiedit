import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from "node:path"

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        svelte()
    ],
    resolve: {
        alias: {
            $lib: path.resolve("./resources/js/Lib"),
            "@": path.resolve("./resources/js")
        }
    }
});
