import Vue from 'vue'
import http from '@utils/http'

import Vant from 'vant'
import 'vant/lib/index.css'

import App from './app'
Vue.use(Vant)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
