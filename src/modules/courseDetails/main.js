import Vue from 'vue'
import http from '@utils/http'
import { DropdownMenu, DropdownItem, RadioGroup, Radio, Lazyload, Swipe, SwipeItem } from 'vant'
import 'vant/lib/index.css'
import VueVideoPlayer from 'vue-video-player'

import App from './app'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')

Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(VueVideoPlayer)

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
