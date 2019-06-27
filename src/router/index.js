import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // $router.push({name:'home'})
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          // $router.push({name:'home'})
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
export default router

// const userInfo = window.localStorage.getItem('user_info')

router.beforeEach((to, from, next) => {
  // ...
  // 如果在登录页面
  // if (to.name === 'login') {
  //   if (userInfo) {
  //     // 如果登录了,就不能访问登录页面了
  //     next(false)
  //   } else {
  //     // 没有登录
  //     next()
  //   }
  // } else {
  //   // 不在登录页面
  //   if (userInfo) {
  //     // 如果登录了
  //     next()
  //   } else {
  //     // 没有登录
  //     next({ name: 'login' })
  //   }
  // }
  nprogress.start()
})
router.afterEach((to, from) => {
  // ...
  nprogress.done()
})
