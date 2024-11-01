import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Magiedit Docs",
    description: "Magiedit Documentation",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: "local"
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'API', link: '/api' }
        ],
        sidebar: [
            {
                text: "API",
                items: [
                    { text: "Requirements", link: "/api/requirements" },
                    { text: "Endpoints", link: "/api/endpoints" },
                    { text: "Definitions", link: "/api/definitions" }
                ]
            },
            {
                text: "Guide",
                items: [
                    { text: "Getting Started", link: "/guide/getting-started" },
                    { text: "VPS Installation", link: "/guide/vps" },
                ]

            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/magitools/magiedit' }
        ]
    }
})