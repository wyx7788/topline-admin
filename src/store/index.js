
// VUEx 容器 ：集中式数据管理状态

// 这里的数据与组件无关

// 任何组件都可以：  读取   this.$store.state.xxx
//                         state 中的数据是相应式的 数据改变也会改变驱动试图的更新
//                  修改   不要在组件中  this.$store.state.xxx=xxx 修改容器中数据

//                         在容器中定义的 mutation  函数修改state 状态
//                         在组件中提交  mutation 完成对状态的修改

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  mutations: {
    changeUser (state, data) {
      // console.log(state)
      Object.assign(state.user, data)
      window.localStorage.setItem('user_info', JSON.stringify(state.user))
    }
  }
})

export default store

// main.js 中
// import  加载
// new Vue({
//   store
// })
