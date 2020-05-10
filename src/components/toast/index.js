
import Vue from 'vue';
import component from './main';

const Constructor = Vue.extend(component);

const group = {};

function Toast(message) {
  const instance = new Constructor({
    data: {
      message,
    },
  });
  const vm = instance.$mount();
  document.body.appendChild(vm.$el);
  return instance;
}

export default Toast;
