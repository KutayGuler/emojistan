/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        18: "repeat(18, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        12: "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("daisyui")],
};
