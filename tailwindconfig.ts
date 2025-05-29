/** @type {import('tailwindcss').Config} */
const config = {

  darkMode: "class", // Use class strategy for dark mode
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      
    },
  },
  plugins: [],
};

export default config;