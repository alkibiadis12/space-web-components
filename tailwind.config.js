module.exports = {
  content: [
    "./public/**/*.html", // Include HTML files
    "./src/client/**/*.ts", // Include TypeScript files in the client folder
    "./src/client/components/**/*.ts", // Specifically include components
    "./src/client/pages/**/*.ts", // Include pages
  ],
  theme: {
    fontFamily: {
      serif: ["Bellefair", "serif"],
      sans: ["Barlow", "sans-serif"],
      sans_cond: ["Barlow Condensed", "sans-serif"],
    },
    extend: {
      boxShadow: {
        custom: "0 0 0 10px hsl(231 77% 90% / 0.15)",
      },
    },
  },
  plugins: [],
};
