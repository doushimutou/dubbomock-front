import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/weekreport',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'weekreport',
        name: '周报',
        component: () => import('@/views/table/index'),
        meta: { title: '周报', icon: 'table' }
      },
      {
        path: 'from',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'user' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单', icon: 'menu' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色', icon: 'role' }
      }
    ]
  },


  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '表格1',
        component: () => import('@/views/form/index'),
        meta: { title: '表格', icon: 'form' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]



const createRouter = () => new Router({
  
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}


export default router
