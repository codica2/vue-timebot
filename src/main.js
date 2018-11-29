import Vue from 'vue'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'
import './icons'
import './permission'
import * as filters from './filters'
const VueScrollTo = require('vue-scrollto')
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import variablePie from 'highcharts/modules/variable-pie'
import JsonExcel from 'vue-json-excel'
import { VueMaskDirective } from 'v-mask'
import VueLodash from 'vue-lodash'

const options = { name: 'lodash' } // customize the way you want to call it

Vue.use(VueLodash, options)
Vue.directive('mask', VueMaskDirective)

Vue.use(HighchartsVue)
variablePie(Highcharts)
Vue.component('downloadExcel', JsonExcel)

Vue.use(VueScrollTo)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
