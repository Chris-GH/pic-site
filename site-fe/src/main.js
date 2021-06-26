import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "./assets/css/index.styl";
import "./assets/css/over-write.styl";

import router from "./router.js";
import store from './store/'

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

// const app = Vue.createApp({});
// app.mount('#app');