/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: (theme, { breakpoints }) => {
        const spacings = {
          px: "1px",
        };
        for (let i = 2; i < 10; i++) {
          spacings[`${i}px`] = `${i}px`;
        }
        for (let i = 0; i < 10; i += 0.5) {
          spacings[i] = `${i * 0.25}rem`;
        }
        for (let i = 10; i < 512; i++) {
          spacings[i] = `${i * 0.25}rem`;
        }
        return {
          ...spacings,
          ...breakpoints(theme("screens")),
        };
      },
      fontSize: {
        "3xs": ["0.5rem", { lineHeight: "0.5rem" }],
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
      },
      zIndex: () => {
        const indices = { auto: "auto" };
        for (let i = 0; i < 100; i++) {
          indices[i] = i.toString();
        }
        return indices;
      },
      maxWidth: (theme) => ({
        ...theme("spacing"),
      }),
      minWidth: (theme) => ({
        ...theme("spacing"),
      }),
      minHeight: (theme) => ({
        ...theme("spacing"),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
