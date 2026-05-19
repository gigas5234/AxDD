import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // Brand & accent
        primary: "#E60012", // KT Real Red
        "primary-focus": "#FF1A2C",
        "primary-on-dark": "#FF5A6A",

        // Surface
        canvas: "#ffffff",
        "canvas-parchment": "#F4F4F6",
        "surface-pearl": "#FAFAFB",
        "surface-tile-1": "#1B1B1B",
        "surface-tile-2": "#232323",
        "surface-tile-3": "#161616",
        "surface-black": "#000000",
        "surface-chip-translucent": "#D4D4D8",

        // Text
        ink: "#1B1B1B",
        body: "#1B1B1B",
        "body-on-dark": "#ffffff",
        "body-muted": "#CCCCCC",
        "ink-muted-80": "#2E2E2E",
        "ink-muted-48": "#767676",

        // Hairlines
        "divider-soft": "#EFEFF1",
        hairline: "#DEDEE1",
      },
      borderRadius: {
        none: "0px",
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px",
        pill: "9999px",
      },
      fontSize: {
        // Apple-tight scale from DESIGN.md
        "hero-display": [
          "56px",
          { lineHeight: "1.07", letterSpacing: "-0.28px", fontWeight: "600" },
        ],
        "display-lg": [
          "40px",
          { lineHeight: "1.10", letterSpacing: "0px", fontWeight: "600" },
        ],
        "display-md": [
          "34px",
          { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "600" },
        ],
        lead: [
          "28px",
          { lineHeight: "1.14", letterSpacing: "0.196px", fontWeight: "400" },
        ],
        tagline: [
          "21px",
          { lineHeight: "1.19", letterSpacing: "0.231px", fontWeight: "600" },
        ],
        "body-strong": [
          "17px",
          { lineHeight: "1.24", letterSpacing: "-0.374px", fontWeight: "600" },
        ],
        body: [
          "17px",
          { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "400" },
        ],
        caption: [
          "14px",
          { lineHeight: "1.43", letterSpacing: "-0.224px", fontWeight: "400" },
        ],
        "caption-strong": [
          "14px",
          { lineHeight: "1.29", letterSpacing: "-0.224px", fontWeight: "600" },
        ],
        "button-utility": [
          "14px",
          { lineHeight: "1.29", letterSpacing: "-0.224px", fontWeight: "400" },
        ],
        "fine-print": [
          "12px",
          { lineHeight: "1.45", letterSpacing: "0", fontWeight: "400" },
        ],
        "nav-link": [
          "13px",
          { lineHeight: "1.2", letterSpacing: "0", fontWeight: "400" },
        ],
      },
      boxShadow: {
        // The single product shadow from DESIGN.md (reserved use)
        product: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0",
      },
    },
  },
  plugins: [],
};

export default config;
