
const path = require('path');
const merge = require('webpack-merge');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const webpackPageConfig = require('./webpack.page.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const webpackConfig = {
  entry: {
    vendor: [
      resolve('src/utils/hack'),
      resolve('src/styles/common.styl'),
    ],
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    // 'vue-router': 'VueRouter',
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    modules: [
      resolve('src'),
      resolve('node_modules'),
    ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@utils': resolve('src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
};

module.exports = merge(webpackConfig, webpackPageConfig);
