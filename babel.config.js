module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    'babel-plugin-transform-typescript-metadata',
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@/src': './src',
          '@/utils': './src/utils',
          '@/client': './src/client',
          '@/screens': './src/screens',
          '@/types': './src/interfaces',
        },
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        version: 'legacy',
      },
    ],
    'nativewind/babel',
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
