/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/repo-studio/app/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/repo-studio/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
