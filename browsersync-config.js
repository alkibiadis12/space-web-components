// browsersync-config.js (ESM format)
import browserSync from "browser-sync";
import historyApiFallback from "connect-history-api-fallback";

// Create the BrowserSync instance
const bs = browserSync.create();

// BrowserSync configuration with middleware for SPA routing
bs.init({
  server: {
    baseDir: "public", // Serve your static files from the 'public' folder
    middleware: [historyApiFallback()], // Redirect all routes to index.html
  },
  files: ["public/index.html", "public/js/bundle.js", "public/css/style.css"], // Watch for changes
  port: 3000, // Set the port you want BrowserSync to run on
  ui: false, // Disable the UI
  open: false, // Don't automatically open the browser
  notify: false, // Disable notification bubbles in the browser,
  host: "localhost", // Bind BrowserSync to localhost only
  online: false, // Ensure it doesn't try to access the external network
});

export default bs;
