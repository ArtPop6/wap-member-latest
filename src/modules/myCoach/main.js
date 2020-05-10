import Vue from 'vue'
import http from '@utils/http'
import { DropdownMenu, DropdownItem, RadioGroup, Radio, Lazyload, Swipe, SwipeItem } from 'vant'
import 'vant/lib/index.css'

import App from './app'
Vue.use(Swipe)
Vue.use(SwipeItem)

/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */
// import Vconsole from 'vconsole'
Vue.use(Lazyload)
// const vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(v => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
