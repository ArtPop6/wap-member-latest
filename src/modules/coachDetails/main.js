import Vue from 'vue'
import http from '@utils/http'
import App from './app'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'

Vue.use(YDUI)

Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
