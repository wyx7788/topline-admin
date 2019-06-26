import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/index.less'
import 'nprogress/nprogress.css'

import axios from 'axios'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 配置axios 的基础路由
// 不用每次再写那么长的请求地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

Vue.prototype.$http = axios
// 放在Vue.prototype 原形中，然后就可以在组件中直接  this.xxx  使用了

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
