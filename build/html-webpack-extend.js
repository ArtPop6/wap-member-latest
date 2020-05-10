
const cdn = require('../config/cdn');

function HtmlWebpackExtend(options) {
  this.options = options || {};
}

HtmlWebpackExtend.prototype.apply = (compiler) => {
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
      // css
      const css = [];
      cdn.css.forEach((url) => { css.push(url); });
      htmlPluginData.assets.css = css.concat(htmlPluginData.assets.css);
      // js
      const js = [];
      cdn.js.forEach((url) => { js.push(url); });
      htmlPluginData.assets.js = js.concat(htmlPluginData.assets.js);
      // callback
      callback(null, htmlPluginData);
    });
  });
};

module.exports = HtmlWebpackExtend;
