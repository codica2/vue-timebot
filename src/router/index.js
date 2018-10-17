import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

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
        meta: { title: 'Dashboard', icon: 'dashboard', noCache: true }
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
        meta: { title: 'Estimations', icon: 'time', noCache: true }
      },
      {
        path: 'time-reports',
        component: () => import('@/views/reports/timeReports/index'),
        name: 'timeReports',
        meta: { title: 'Time reports', icon: 'calendar', noCache: true }
      }
      // {
      //   path: 'absence',
      //   component: () => import('@/views/reports/absence/index'),
      //   name: 'Absence',
      //   meta: { title: 'Absence', noCache: true }
      // }
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
        meta: { title: 'Time entries', icon: 'time', noCache: true }
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
        meta: { title: 'Users', icon: 'user', noCache: true }
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
        meta: { title: 'Teams', icon: 'teams', noCache: true }
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
        meta: { title: 'Projects', icon: 'projects', noCache: true }
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
        meta: { title: 'Holidays', icon: 'rocket', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'absence',
        component: () => import('@/views/absence/index'),
        name: 'Absence',
        meta: { title: 'Absence', icon: 'sofa', noCache: true }
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
        meta: { title: 'Admins', icon: 'admins', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
