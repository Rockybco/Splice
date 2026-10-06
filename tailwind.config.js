/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./splice/**/*.{js,jsx,md}"],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#0D7377" },
        cream: "#F4E8DC",
        amber: { DEFAULT: "#D4A574" },
        ink: "#0F1419",
        danger: "#E63946",
        success: "#2A9D8F",
        paper: "#F8F6F2",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: []
};
