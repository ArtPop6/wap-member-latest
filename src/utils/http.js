import axios from 'axios'
import toast from '../components/toast'

window.BaseUrl = '/api/'

const instance = axios.create({})

// 每次请求的中间件-拦截器 通过中间件注入必要的参数 appid 与 token
instance.interceptors.request.use(
  config => {
    // prefix api
    config.url = `${window.BaseUrl}${config.url.replace(/^\/?/, '')}`
    const token = localStorage.getItem('access_token')
    const appId = localStorage.getItem('appid')

    config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Co-App'] = `${appId}`

    if (!config.params) config.params = {}
    Object.assign(config.params, { _r: Math.random(), appid: appId })

    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => response,
  error => {
    // error handler
    const { config, response } = error
    const { status } = response
    const macCode = localStorage.getItem('macCode')
    const appid = localStorage.getItem('appid')

    // 登录失败后 则跳转至注册页面去获得对应token后回跳到跳转页面
    function _gotoLogin() {
      window.location.href = `/login.html?mac_code=${macCode}&appid=${appid}#url=${window.location.href}`
    }

    // status code
    if (status === 403 || status === 401) {
      // 授权跳页
      const errMsg = response.data.err_msg
      toast(errMsg)
      _gotoLogin()
    } else if (status >= 400 && status < 600 && response && response.data) {
      if (!Object.hasOwnProperty.call(config, 'errorHandler')) {
        const errMsg = response.data.err_msg
        if (errMsg && typeof errMsg === 'string') {
          toast(errMsg)
        } else if (errMsg && Array.isArray(errMsg)) {
          toast(errMsg[0])
        }
      }
    } else if (status >= 500) {
      _gotoLogin()
    }
    // else if (status >= 400 && status < 500) {}
    return Promise.reject(error)
  }
)

export default instance
