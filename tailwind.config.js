/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  safelist: [
    {
      pattern: /border-(red|green|sky|purple|gray)/,
      variants: ['before', 'dark'],
    },
    {
      pattern: /bg-(red|sky|green|purple|gray|primary|grey)/,
    }
  ],
  theme: {
    fontSize: {
      xs: "0.8rem",
      sm: "0.875rem",
      base: "1rem",
      xl: "1.25rem",
      lg: "1.125rem",
      "2xl": "1.5rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    screens: {
      //Responsive breakpoints default can be change
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      keyframes: {
        "slide-in-right-fade": {
          "0%": { transform: "translateX(150%)", opacity: "0" }, // Empieza fuera de la pantalla con opacidad 0
          "100%": { transform: "translateX(0%)", opacity: "1" }, // Llega a la posición final con opacidad 100%
        },
      },
      animation: {
        "slide-in-right-fade": "slide-in-right-fade 1s ease-out forwards", // Nombre de la animación
      },
      colors: {
        primary: "#F3CD00",
        secondary: "#FFE75C",
        accent: "#ff9d00",
        neutral: "#2b3440",
        "base-100": "#ffffff",
        originLight: "338BFF",
        "danger-color": "#dc2626",

        "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
        "--rounded-btn": "3rem", // border radius rounded-btn utility class, used in buttons and similar element
        "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
        "--animation-btn": "0.25s", // duration of animation when you click on button
        "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
        "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
        "--border-btn": "1px", // border width of buttons
        "--tab-border": "1px", // border width of tabs
        "--tab-radius": "0.5rem", // border radius of tabs
      },
      fontFamily: {
        //Custom font can be change
        Montserrat: ["Montserrat", "sans-serif"],
      },
      backgroundColor: {
        "light-blue-100": "#e8f1fc",
        "light-blue-200": "#c2dcff",
        "background-whitesmoke": "#f5f5f5",
        "background-button-table": "#E5F0FF",
        "background-active-button": "#12B76A",
        "background-blur-modal": "#002E6A",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
