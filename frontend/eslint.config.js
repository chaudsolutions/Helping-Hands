import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        process: "readonly", // Add process as a global variable
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Disable the rule for React 18
    },
  },
];
