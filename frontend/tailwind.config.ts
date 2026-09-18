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
        background: "#020817",
        surface: {
          DEFAULT: "#071426",
          2: "#0B1B32",
          3: "#112444",
        },
        primary: {
          DEFAULT: "#2563FF",
          bright: "#4D8DFF",
          dark: "#1A49B8",
        },
        cyber: {
          violet: "#7C3AED",
          cyan: "#00D9FF",
          danger: "#FF3B4F",
          warning: "#F59E0B",
          success: "#00E5A8",
        },
        text: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        border: {
          DEFAULT: "rgba(100, 150, 255, 0.18)",
          glow: "rgba(0, 217, 255, 0.35)",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(0, 0, 0, 0.35)",
        "glass-glow": "0 0 25px rgba(37, 99, 255, 0.2)",
        "cyan-glow": "0 0 30px rgba(0, 217, 255, 0.25)",
        "danger-glow": "0 0 25px rgba(255, 59, 79, 0.25)",
        "shield-glow": "0 0 40px rgba(77, 141, 255, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(to right, rgba(100, 150, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 150, 255, 0.05) 1px, transparent 1px)",
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
