import Vue from 'vue'
import http from '@utils/http'
import { Button, Icon } from 'vant'

import App from './app'

Vue.use(Button)
Vue.use(Icon)
Vue.use((v) => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
