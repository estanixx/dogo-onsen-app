import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Project specific rule customizations
  {
    rules: {
      // Enforce semicolons
      semi: ["error", "always"],
      // Trailing commas for multiline constructs
      "comma-dangle": ["error", "always-multiline"],
      // No unused variables
      // "no-unused-vars": ["error", { "args": "after-used", "ignoreRestSiblings": true }], ACTIVAR
      // Prefer const when variables are never reassigned
      "prefer-const": "error",
      // Require === and !==
      eqeqeq: ["error", "always"],
      // Require braces for all control statements
      curly: ["error", "all"],
      // Discourage console.log in production code (warn instead)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Always require parens for arrow functions
      "arrow-parens": ["error", "always"],
    },
  },
];

export default eslintConfig;
