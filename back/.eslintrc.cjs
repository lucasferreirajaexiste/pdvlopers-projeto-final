// Classic ESLint config (CommonJS) for the backend
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ["dist", "node_modules", ".next"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    "no-console": "off",
  },
  overrides: [
    {
      files: ["src/**/*.js", "tests/**/*.js"],
      env: { node: true },
    },
  ],
};
