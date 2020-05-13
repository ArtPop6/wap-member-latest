const path = require('path')
const prodEnv = require('./prod.env')
const devEnv = require('./dev.env')
let proxyHost = ''

switch (process.env.SERVER_ENV) {
  case 'dev': {
    // proxyHost = 'http://dev.m.ampmfit.net/api/' // 用作代理调试
    // proxyHost = 'http://192.168.0.21:9003/' // 用于调试某个开发机器上的应用
    proxyHost = 'http://yapi.ampmfit.net/mock/40/api' // mock server
    break
  }
  case 'qa': {
    proxyHost = 'http://qa.m.ampmfit.net/api/'
    break
  }
  case 'pre': {
    proxyHost = 'http://pre.m.ampmfit.cn/api/'
    break
  }
  default: {
    proxyHost = 'http://m.ampmfit.cn/api/'
    break
  }
}

module.exports = {
  build: {
    env: prodEnv,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './',
    assetsPublicPath: '/',
    productionSourceMap: false
  },
  dev: {
    env: devEnv,
    port: 10008,
    assetsSubDirectory: './',
    assetsPublicPath: '/',
    proxyTable: {
      // api: {
      //   filter: '/msg/v0.1/index/**',
      //   changeOrigin: true,
      //   target: 'http://dev.wechat.ampmfit.net',
      // },

      // 调试dev环境
      '/api': {
        target: proxyHost,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    cssSourceMap: false
  }
}
