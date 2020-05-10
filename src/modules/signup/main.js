import Vue from 'vue'
import http from '@utils/http'
import App from './app'
import { Col, Row, Form, DatetimePicker } from 'vant'

Vue.use(Col).use(Row).use(Form).use(DatetimePicker)

Vue.use((v) => {
  v.prototype.$http = http
})

const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
