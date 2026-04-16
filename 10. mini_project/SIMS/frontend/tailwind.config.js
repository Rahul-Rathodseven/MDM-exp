/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef7ff",
          100: "#d8ecff",
          200: "#baddff",
          300: "#8bc7ff",
          400: "#58a6ff",
          500: "#2d7ff9",
          600: "#1f64d6",
          700: "#1d50ad",
          800: "#1d468f",
          900: "#1e3d76"
        },
        slate: {
          950: "#020617"
        }
      },
      boxShadow: {
        panel: "0 24px 80px -32px rgba(15, 23, 42, 0.25)",
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
