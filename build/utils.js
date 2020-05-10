
const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config');

exports.assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = (_options) => {
  const options = _options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader];
    if (loader) {
      const loaderConfig = {
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      };

      loaders.push(loaderConfig);
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }
    return ['vue-style-loader'].concat(loaders);
  }

  // stylus options
  const stylusOptions = {
    import: [
      path.join(__dirname, '..', 'src/styles/helpers/index.styl'),
    ],
  };

  return {
    css: generateLoaders(),
    stylus: generateLoaders('stylus', stylusOptions),
    styl: generateLoaders('stylus', stylusOptions),
  };
};

exports.styleLoaders = (options) => {
  const output = [];
  const loaders = exports.cssLoaders(options);
  _.forEach(loaders, (loader, extension) => {
    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loader,
    });
  });
  return output;
};

const pageExt = uri => `${uri.replace(/index$/i, '')}.html`.replace(/^\//ig, '');
exports.pages = () => {
  const pageroot = path.resolve(__dirname, '../src/modules/');
  const pages = {};
  glob.sync('**/{main.js,main.jsx,tmpl.html}', {
    cwd: pageroot,
  }).forEach((file) => {
    const opt = path.parse(file);

    if (!pages[opt.dir]) {
      pages[opt.dir] = {
        uri: pageExt(opt.dir),
        path: opt.dir,
        dir: path.join(pageroot, opt.dir),
      };
    }
    const data = pages[opt.dir];

    if (opt.ext === '.html') data.html = opt.base;
    else if (opt.ext === '.js' || opt.ext === '.jsx') data.js = opt.base;
  });

  return pages;
};

