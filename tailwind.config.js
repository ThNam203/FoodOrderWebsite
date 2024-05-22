/** @type {import('tailwindcss').Config} */
// tailwind.config.js
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)"],
      },
      colors: {
        primary: "#fc8019",
        secondary: "#d56c16",
        third: "#1f1f23",
        primaryWord: "#000000",
        secondaryWord: "#777777",
        disableColor: "#d8d8d8",
        borderColor: "#e3e3e6",
        momoBorderColor: "#d82d8b",
        momoBgColor: "#fff0f6",
      },
      boxShadow: {
        primaryShadow: "0 0 45px -15px rgba(0,0,0,0.3)",
        hoverShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      flex: {
        "0_0_100": "0 0 100%",
      },
      keyframes: {
        move_to_left: {
          "0%": { transform: "translateX(0)", width: "0px", opacity: 1 },
          "100%": {
            transform: "translateX(-100%)",
            width: "400px",
            opacity: 0,
          },
        },
        move_to_right: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": {
            transform: "translateX(100%)",
            width: "0px",
            opacity: 0,
          },
        },
        disappear_to_left: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
        },
      },
      animation: {
        "row-disappear": "disappear_to_left .3s linear",
        "col-move-to-right": "move_to_right .3s linear forwards",
        "col-move-to-left": "move_to_left .3s linear forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("tailwind-scrollbar")],
};
