export default {
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
  },
  plugins: [],
};
