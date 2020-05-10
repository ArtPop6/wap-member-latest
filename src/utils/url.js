const { protocol } = window.location

const env = process.env.SERVER_ENV.match(/^(dev|qa|pre|prod)/)[0]
const domainPrefix = env === 'prod' ? '' : `${env}-`
const moduleSuffix = env !== 'test' ? '' : '-test'

const secure = window.location.protocol === 'https:'

const vdir = {
  site: `/basic-wechat${moduleSuffix}`,
  api: ''
}

const host = {
  site: `${domainPrefix}jstlq.yunkai.com` // (dev-|test-)jstlq.yunkai.com
}

const im = `${secure ? 'wss' : 'ws'}://${host.site}/api/im` // (dev-|test-)jstlq.yunkai.com/api/im

const url = {
  site: `${protocol}//${host.site}${vdir.site}`,
  api: `${protocol}//${host.site}${vdir.api}` // http(s)://(dev-|test-)jstlq.yunkai.com/basic-api
}

function getUrl (str) {
  const to = str.replace(/^\//, '')
  return `${url.site}/${to}`
}

export default getUrl
export {
  im, // im 地址
  host,
  vdir, // 虚拟目录
  url
}
