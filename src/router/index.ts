import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.VITE_RES_URL),//修改后
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: "/all/"
    },
    {
      path: '/all',
      name: '/all',
      redirect: "/all/"
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/all/:pathMatch(.*)',
      name: '/all/',
      component: HomeView
    },
    {
      path: '/sign',
      name: 'sign',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignView.vue')
    },
    {
      path: '/s',
      name: 'setting',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingView.vue')
    },
  ]
})

//导航守卫、路由守卫、路由拦截
router.beforeEach((to, from, next) =>{
  //验证token,只有存在token的时候，才能跳转到内容页

  let token = Cookies.get("token");

  if(to.path === '/s' || token || to.path === '/sign') {
    next();
  } else {
    next("/sign");
  }

  window.scrollTo(0, 0)
})

export default router
