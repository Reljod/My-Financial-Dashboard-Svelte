/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        card: {
          primary: "#EBF1ED",
          "primary-hover": "#bacfc1"
        }
      }
    },
  },
  plugins: [require("daisyui")],
}
