
const _ = require('lodash');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackExtend = require('./html-webpack-extend');
const utils = require('./utils');

const webpackConfig = {
  entry: {},
  plugins: [
    new HtmlWebpackExtend(),
  ],
};

const pages = utils.pages();
_.forEach(pages, (item) => {
  const htmlPluginConfig = {
    filename: item.uri,
    chunks: ['vendor'],
    chunksSortMode: 'manual',
    inject: true,
  };

  if (item.js) {
    webpackConfig.entry[item.path] = path.join(item.dir, item.js);
    htmlPluginConfig.chunks.push(item.path);
  }

  if (item.html) {
    htmlPluginConfig.template = path.join(item.dir, item.html);
  }

  // prod options
  if (process.env.NODE_ENV === 'production') {
    htmlPluginConfig.chunks.unshift('manifest');
    Object.assign(htmlPluginConfig, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    });
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlPluginConfig));
});

module.exports = webpackConfig;
