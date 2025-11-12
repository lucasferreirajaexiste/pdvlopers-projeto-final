// Flat config compatible with ESLint's flat configuration loader.
// We keep the config minimal and avoid importing '@eslint/js' or 'eslint/config'
// so it works across ESLint versions that may restrict package exports.
module.exports = [
  {
    files: ["**/*.js"],
    ignores: ["dist", "node_modules", ".next"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { process: true, Buffer: true, console: true },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "no-console": "off",
    },
  },
];
