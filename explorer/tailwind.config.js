/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#040405",
        foreground: "#f4f4f6",
        muted: "#777c8e",
        accent: {
          DEFAULT: "#ff6b1a",
          strong: "#ff8946",
        },
        card: {
          bg: "rgba(12, 13, 17, 0.85)",
          border: "rgba(255, 107, 26, 0.4)",
        },
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      maxWidth: {
        container: "1160px",
      },
      letterSpacing: {
        widest: "0.2em",
      },
      keyframes: {
        slideIn: {
          from: {
            opacity: "0",
            transform: "translateY(-20px)",
            borderColor: "#ff6b1a",
            boxShadow: "0 0 30px rgba(255, 107, 26, 0.6)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
            borderColor: "rgba(255, 137, 70, 0.2)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
