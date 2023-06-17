/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  plugins: [ require('daisyui') ],
  daisyui: {
    themes: ["forest"]
  }
}
