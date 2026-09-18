import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          bright: "var(--primary-bright)",
          dark: "var(--primary-dark)",
        },
        cyber: {
          violet: "var(--violet)",
          cyan: "var(--cyan)",
          danger: "var(--danger)",
          warning: "var(--warning)",
          success: "var(--success)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          glow: "var(--border-glow)",
        },
      },
      boxShadow: {
        glass: "0 20px 60px var(--glass-shadow)",
        "glass-glow": "0 0 25px rgba(37, 99, 255, 0.2)",
        "cyan-glow": "0 0 30px rgba(0, 217, 255, 0.25)",
        "danger-glow": "0 0 25px rgba(255, 59, 79, 0.25)",
        "shield-glow": "0 0 40px rgba(77, 141, 255, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
        "hero-glow": "radial-gradient(circle at 60% 30%, rgba(37, 99, 255, 0.15) 0%, rgba(124, 58, 237, 0.1) 40%, transparent 70%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "scan-line": "scanline 8s linear infinite",
        "border-flow": "borderFlow 6s ease infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
