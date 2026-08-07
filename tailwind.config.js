/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        diner: {
          bg: "#0B0B0D",
          sheet: "#121214",
          header: "#1A1A1C",
          surface: "#1C1C1E",
          elevated: "#2A2A2C",
          tag: "#1E1E20",
          border: "rgba(255, 255, 255, 0.10)",
          borderSubtle: "rgba(255, 255, 255, 0.06)",
          textPrimary: "#F5F5F7",
          textSecondary: "#8E8E93",
          textPlaceholder: "#3A3A3C",
          green: "#34C759",
          red: "#E8505B",
          incomePillBg: "#E9E9EC",
          incomePillText: "#1C1C1E",
          expensePillBg: "#2A2A2C",
          expensePillText: "#F5F5F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "Baloo 2", "-apple-system", "system-ui", "sans-serif"],
      },
      borderRadius: {
        'pill': '999px',
        'bar': '24px',
        'sheet': '32px',
        'squircle': '22%',
        'input': '16px',
      },
      boxShadow: {
        'elevation': '0 12px 40px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'slide-up': 'slideUp 260ms cubic-bezier(0.32, 0.72, 0.28, 1) forwards',
        'fade-in': 'fadeIn 160ms ease-out forwards',
        'scale-up': 'scaleUp 160ms cubic-bezier(0.32, 0.72, 0.28, 1) forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
