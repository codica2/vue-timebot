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
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'time-logs',
        component: () => import('@/views/time-logs/index'),
        name: 'Time logs',
        meta: { title: 'Time logs', icon: 'time', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'estimations',
        component: () => import('@/views/estimations-analysis/index'),
        name: 'Estimations',
        meta: { title: 'Estimations Analysis', icon: 'time', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'weekly-reports',
        component: () => import('@/views/time-reports/index'),
        name: 'TimeReports',
        meta: { title: 'Weekly reports', icon: 'calendar', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'user-reports',
        component: () => import('@/views/user-reports/index'),
        name: 'UserReports',
        meta: { title: 'Time to work', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'absence-reports',
        component: () => import('@/views/absence-report/index'),
        name: 'AbsenceReports',
        meta: { title: 'Absence Report', icon: 'sofa', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'Settings',
    meta: {
      title: 'Settings',
      icon: '404'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/settings/users/index'),
        name: 'Users',
        meta: { title: 'Users', icon: 'user', noCache: true }
      },
      {
        path: 'teams',
        component: () => import('@/views/settings/teams/index'),
        name: 'Teams',
        meta: { title: 'Teams', icon: 'teams', noCache: true }
      },
      {
        path: 'projects',
        component: () => import('@/views/settings/projects/index'),
        name: 'Projects',
        meta: { title: 'Projects', icon: 'projects', noCache: true }
      },
      {
        path: 'holidays',
        component: () => import('@/views/settings/holidays/index'),
        name: 'Holidays',
        meta: { title: 'Holidays', icon: 'rocket', noCache: true }
      },
      {
        path: 'admins',
        component: () => import('@/views/settings/admins/index'),
        name: 'Admins',
        meta: { title: 'Admins', icon: 'admins', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
