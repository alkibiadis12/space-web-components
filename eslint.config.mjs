// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwindcss from "eslint-plugin-tailwindcss";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      tailwindcss, // Add the Tailwind CSS plugin
    },
    rules: {
      "no-console": "warn", // Set "no-console" rule to show as a warning
      "tailwindcss/classnames-order": "warn", // Warn if Tailwind classes are not in recommended order
      "tailwindcss/no-custom-classname": "off", // Optionally disable custom classname warnings
    },
  },
);
