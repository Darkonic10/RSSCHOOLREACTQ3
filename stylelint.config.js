/** @type {import('stylelint').Config} */
const config = {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order"],
  rules: {
    "at-rule-no-deprecated": null,
    "custom-property-pattern": null,
  },
};

export default config;
