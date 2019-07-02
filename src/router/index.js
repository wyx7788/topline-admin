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
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'articleComment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
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
router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  // ...
  // 如果不在登录页面
  if (to.path !== '/login') {
    if (!userInfo) {
      // 如果登录了,就不能访问登录页面了
      next({ name: 'login' })
    } else {
      // 没有登录
      next()
    }
  } else {
    // 在登录页面
    if (userInfo) {
      // 如果登录了
      next(false)
    } else {
      // 没有登录
      next()
    }
  }
})
router.afterEach((to, from) => {
  // ...
  nprogress.done()
})

export default router
