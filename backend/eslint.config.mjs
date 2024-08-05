import globals from "globals";
import pluginJs from "@eslint/js";
import nodePlugin from "eslint-plugin-node";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Include Node.js globals here
      },
    },
    rules: {
      "no-console": "off", // Example: allow console statements
      quotes: ["error", "double"], // Example: enforce double quotes
    },
  },
  pluginJs.configs.recommended,
  nodePlugin.configs.recommended,
];
