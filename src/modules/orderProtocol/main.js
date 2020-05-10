import Vue from 'vue'
import http from '@utils/http'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */

import App from './app'
Vue.use(YDUI)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
