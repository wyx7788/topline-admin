import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/index.less'
import 'nprogress/nprogress.css'

import axios from 'axios'

// import json-bigint from 'json-bigint'
import JSONbig from 'json-bigint'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 配置axios 的基础路由
// 不用每次再写那么长的请求地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

Vue.prototype.$http = axios
// 放在Vue.prototype 原形中，然后就可以在组件中直接  this.xxx  使用了
// 使用JSONbig 处理返回数据中超出 js 安全整数范围的数字
// JSONbig 自己会分析数据中的哪个数字超出最大范围
axios.defaults.transformResponse = [function (data) {
  // data 是未经处理的后端相应数据JSON 格式字符串
  // 如果 data 不是一个JSON 格式的字符串， 会导致 JSONbig.parse 或者JSON.parse 转换失败并报异常
  // return JSONbig.parse(data)
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
    // 无法转换的数据直接原样返回
  }
}]
// 添加请求拦截器   请求接口时：先经过这里
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // 在Authorization 请求头中携带的token，格式为"Bearer "拼接上token，注意Bearer后有一个空格
  // console.log(userInfo.token)
  if (userInfo) {
    // 如果登录了，才需要token 的接口统一添加 token 令牌
    config.headers.Authorization = `Bearer ${userInfo.token}`
    // config.headers.Authorization = `Bearer 123`
  }
  return config
  // 运行通过 config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  // console.log('response=>' + response)
  // console.log(typeof response.data)
  // return response.data.data // 统一处理相应的数据格式
  // 判断返回的数据类型是对象 和 是否有data 成员
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    // 如果没有 就原样返回
    return response.data
  }
}, (error) => {
  // 对响应错误做点什么
  // console.dir(error)
  // 401错误的时候， 跳转到登录页面
  if (error.response.status === 401) {
    // 清除登录存储的信息
    window.localStorage.removeItem('user_info')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
