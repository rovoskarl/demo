module.exports = {
  root: true,
  extends: ['@react-native'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': 'off',
    'react-native/no-inline-styles': 'off',
  },
  ignorePatterns: ['metro.config.js'],
};
