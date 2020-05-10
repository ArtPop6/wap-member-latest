import Vue from 'vue';
import http from '@utils/http';
import App from './app';

Vue.use((v) => {
  v.prototype.$http = http;
});

const instance = new Vue({
  render: h => h(App),
});

instance.$mount('#app');
