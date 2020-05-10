import Vue from 'vue'
import http from '@utils/http'
import { PullRefresh, Uploader } from 'vant'
import 'vant/lib/index.css'

import App from './app'

/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(PullRefresh).use(Uploader)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
