const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

const resolve = (relativePath) => path.resolve(appDirectory, relativePath);


module.exports = {
  stories: [
      '../stories/**/*.stories.mdx',
      '../stories/**/*.stories.tsx',
      '../stories/**/*.ts',
      '../src/react/*.stories.tsx',
    ],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-storysource', '@storybook/addon-docs'],
  webpackFinal: async config => {

    Object.assign(config.resolve.alias, {
      'AUTO_CHART_SRC': resolve('src'),
      'src': resolve('src'),
      'AUTO_CHART_LIB': resolve('lib'),
    })

    // do mutation to the config
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
