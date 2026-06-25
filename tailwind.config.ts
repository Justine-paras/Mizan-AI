import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#070708",
          surface: "#121316",
          elevated: "#1C1E24",
          overlay: "#262933",
        },
        accent: {
          DEFAULT: "#7C5CFF",
          muted: "#7C5CFF26",
          subtle: "#7C5CFF14",
        },
        success: {
          DEFAULT: "#22C55E",
          muted: "#22C55E26",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "#F59E0B26",
        },
        critical: {
          DEFAULT: "#EF4444",
          muted: "#EF444426",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
          tertiary: "#71717A",
          disabled: "#3F3F46",
        },
        border: {
          DEFAULT: "#222429",
          subtle: "#181A1F",
          strong: "#31353E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "16px", letterSpacing: "0.04em" }],
        xs: ["12px", { lineHeight: "18px", letterSpacing: "0.02em" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "22px" }],
        md: ["15px", { lineHeight: "24px" }],
        lg: ["17px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "44px" }],
        "5xl": ["48px", { lineHeight: "56px" }],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)",
        elevated: "0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
        accent: "0 0 0 1px #7C5CFF40",
        "accent-glow": "0 0 20px rgba(124,92,255,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
