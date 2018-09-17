import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/reports',
    component: Layout,
    redirect: 'noredirect',
    name: 'Reports',
    meta: {
      title: 'Reports',
      icon: '404'
    },
    children: [
      {
        path: 'estimations',
        component: () => import('@/views/reports/estimations/index'),
        name: 'Estimations',
        meta: { title: 'Estimations', noCache: true }
      },
      {
        path: 'weekly',
        component: () => import('@/views/reports/weekly/index'),
        name: 'Weekly',
        meta: { title: 'Weekly', noCache: true }
      },
      {
        path: 'absens',
        component: () => import('@/views/reports/absens/index'),
        name: 'Absens',
        meta: { title: 'Absens', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'time-entries',
        component: () => import('@/views/time-entries/index'),
        name: 'Time entries',
        meta: { title: 'Time entries', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'users',
        component: () => import('@/views/users/index'),
        name: 'Users',
        meta: { title: 'Users', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'teams',
        component: () => import('@/views/teams/index'),
        name: 'Teams',
        meta: { title: 'Teams', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'projects',
        component: () => import('@/views/projects/index'),
        name: 'Projects',
        meta: { title: 'Projects', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'holidays',
        component: () => import('@/views/holidays/index'),
        name: 'Holidays',
        meta: { title: 'Holidays', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'absense',
        component: () => import('@/views/absense/index'),
        name: 'Absense',
        meta: { title: 'Absense', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'admins',
        component: () => import('@/views/admins/index'),
        name: 'Admins',
        meta: { title: 'Admins', icon: 'icon', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
