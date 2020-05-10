
process.env.NODE_ENV = 'production';

const rm = require('rimraf');
const path = require('path');
// const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');

process.stdout.write('building for production...\n');

rm(path.join(config.build.assetsRoot), (err) => {
  if (err) throw err;
  webpack(webpackConfig, (webpackErr, stats) => {
    if (webpackErr) throw webpackErr;
    const statCtx = stats.toString({
      assetsSort: 'chunks',
      colors: false,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    });
    process.stdout.write(`${statCtx}\n\n`);
    process.stdout.write('build complete.\n');
    // process.stdout.write(chalk.cyan('build complete.\n'));
  });
});
