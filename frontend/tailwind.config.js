/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0F",
        surface: "#11111A",
        elevated: "#1A1A26",
        stroke: "rgba(255,255,255,0.08)",
        muted: "#D8DDF3",
        mutedDeep: "#BCC4DF",
        accent: "#00D4FF",
        accentSoft: "#00FFC6",
        accentAlt: "#7A5CFF",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 212, 255, 0.25)",
        hoverGlow: "0 0 25px rgba(122, 92, 255, 0.35)",
        soft: "0 24px 64px rgba(3, 6, 18, 0.38)",
      },
      backgroundImage: {
        "mesh-radial":
          "radial-gradient(circle at 14% 10%, rgba(0,212,255,0.18), transparent 34%), radial-gradient(circle at 84% 0%, rgba(122,92,255,0.16), transparent 30%), radial-gradient(circle at 55% 100%, rgba(0,255,198,0.08), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        "theme-gradient": "linear-gradient(135deg, #00D4FF, #7A5CFF)",
        "theme-gradient-alt": "linear-gradient(135deg, #00FFC6, #00D4FF)",
      },
    },
  },
  plugins: [],
};
