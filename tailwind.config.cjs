/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: "#c5dacc"
      }
    },
  },
  plugins: [ require('daisyui') ],
  daisyui: {
    themes: ["cupcake"]
  }
}
