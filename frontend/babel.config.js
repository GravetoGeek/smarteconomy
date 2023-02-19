module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "react-native-dotenv"
      }],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@config': './src/config',
            '@controllers': './src/controllers',
            '@models': './src/models',
            '@routes': './src/routes',
            '@utils': './src/utils',
            '@views': './src/views',
            '@assets': './src/assets',
            '@schemas': './src/schemas',
            '@middlewares': './src/middlewares',
            '@services': './src/services',
            '@helpers': './src/helpers',
            '@hooks': './src/hooks',
            '@config/env': './src/config/env',
            '@config/database': './src/config/database',
            '@config/logger': './src/config/logger',
            '@config/mail': './src/config/mail',
            '@config/passport': './src/config/passport',
            '@config/redis': './src/config/redis',
            '@config/sentry': './src/config/sentry'
          }
        }
      ]
    ]
  };
};
