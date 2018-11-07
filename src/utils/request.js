import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.BASE_API,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  },
  timeout: 125000
})
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)
    Message({
      message: error.response ? (error.response.data.message ? error.response.data.message : error.message) : error.message,
      type: 'error',
      duration: 5 * 1000
    })
    if (store.getters.roles.length && error.response && error.response.status === 401) {
      store.dispatch('LogOut').then(() => { location.reload() })
    }
    return Promise.reject(error)
  }
)

export default service
