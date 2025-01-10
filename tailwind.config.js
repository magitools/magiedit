const { addIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./templates/**/*.templ"],
    theme: {
        extend: {},
    },
    plugins: [
        require("daisyui"),
        addIconSelectors(["devicon"])
    ],
    daisyUi: {
        themes: ["cupcake", "night"]
    }
}

