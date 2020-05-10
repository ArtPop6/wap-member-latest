import Vue from 'vue'
import http from '@utils/http'
// import YDUI from 'vue-ydui'
// import 'vue-ydui/dist/ydui.rem.css'
/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */
// import Vconsole from 'vconsole'
import Vant from 'vant'
import 'vant/lib/index.css'

import App from './app'
// const vConsole = new Vconsole()
// Vue.use(vConsole)
// Vue.use(YDUI, Vant)
Vue.use(Vant)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
