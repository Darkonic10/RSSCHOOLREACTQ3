/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
  ],
  "src/**/*.css": [
    "stylelint --fix"
  ],
  "src/**/*.html": [
    "eslint --fix"
  ]
};

export default config;