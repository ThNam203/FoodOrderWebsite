/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)"],
      },
      colors: {
        primary: "#fc8019",
        secondary: "#d56c16",
        primaryWord: "#1f1f23",
        secondaryWord: "#777777",
        hoverColor: "#e3e3e6",
        leftBarColor: "#efeff1",
      },
      boxShadow: {
        primaryShadow: "0 0 45px -15px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};