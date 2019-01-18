import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import AppIndex from './components/AppIndex.vue'
import { store } from './store.js'

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: AppIndex, },
  ],
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
