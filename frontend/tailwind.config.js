/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter"],
      },
      colors: {
        primary: "var(--primary-bg-color)",
        secondary: "var(--secondary-bg-color)",

        "text-primary": "var(--primary-text-color)",
        "text-secondary": "var(--secondary-text-color)",

        "border-primary": "var(--primary-border-color)",

        "btn-solid-bg": "var(--button-solid-background-color)",
        "btn-solid-text": "var(--button-solid-text-color)",

        "btn-outline-bg": "var(--button-outlined-bg-color)",
        "btn-outline-text": "var(--button-outlined-text-color)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
