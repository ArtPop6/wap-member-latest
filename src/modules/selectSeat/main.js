import Vue from 'vue'
import http from '@utils/http'
import { Toast } from 'vant'
import 'vant/lib/index.css'

import App from './app'
Vue.use(Toast)

/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
