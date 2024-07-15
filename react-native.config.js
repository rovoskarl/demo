module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    ...(process.env.NO_FLIPPER // When set, skip flipper includes for iOS archive builds (release buidls)
      ? { 'react-native-flipper': { platforms: { ios: null } } }
      : {}),
  },
  assets: ['./node_modules/@tamagui/font-inter/otf', './node_modules/react-native-vector-icons/Fonts'],
};
