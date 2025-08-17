/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', "stylelint-config-clean-order"],
  rules: {
    'at-rule-no-deprecated': null,
    'custom-property-pattern': null,
    'selector-class-pattern': "^[a-z][a-zA-Z0-9]+$",
  },
};