import nextPlugin from "eslint-config-next";
import tseslint from "typescript-eslint";

export default [
  ...nextPlugin,
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  }),
];
