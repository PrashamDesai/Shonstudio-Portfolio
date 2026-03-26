/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--base-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        elevated: "rgb(var(--elevated-rgb) / <alpha-value>)",
        stroke: "rgb(var(--border-rgb) / <alpha-value>)",
        muted: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
        mutedDeep: "rgb(var(--text-tertiary-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-primary-rgb) / <alpha-value>)",
        accentSoft: "rgb(var(--accent-tertiary-rgb) / <alpha-value>)",
        accentAlt: "rgb(var(--accent-secondary-rgb) / <alpha-value>)",
        textPrimary: "rgb(var(--text-primary-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        hoverGlow: "var(--shadow-hover)",
        soft: "var(--shadow-soft)",
      },
      backgroundImage: {
        "mesh-radial":
          "radial-gradient(circle at 12% 12%, rgb(var(--accent-primary-rgb) / 0.16), transparent 32%), radial-gradient(circle at 84% 0%, rgb(var(--accent-secondary-rgb) / 0.18), transparent 34%), radial-gradient(circle at 56% 100%, rgb(var(--accent-tertiary-rgb) / 0.10), transparent 26%), linear-gradient(180deg, rgb(255 255 255 / 0.03), rgb(255 255 255 / 0))",
        "theme-gradient":
          "linear-gradient(135deg, rgb(var(--accent-primary-rgb)), rgb(var(--accent-secondary-rgb)))",
        "theme-gradient-alt":
          "linear-gradient(135deg, rgb(var(--accent-tertiary-rgb)), rgb(var(--accent-primary-rgb)))",
      },
    },
  },
  plugins: [],
};
