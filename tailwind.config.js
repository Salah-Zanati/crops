/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        main: "#4CAF50",
        mainAlt: "#3e9d41",
        eee: "#eee",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        messiri: ["El Messiri", "sans-serif"],
      },
      inset: {
        "50vw": "50vw",
        "-25vw": "-25vw",
        "50hw": "50vh",
        "-50hw": "-50vh",
      },
    },
  },
  plugins: [],
};
