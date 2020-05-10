import Vue from 'vue'
import http from '@utils/http'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './app'

Vue.use((v) => {
  v.prototype.$http = http
})
Vue.use(VueAwesomeSwiper)
const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
