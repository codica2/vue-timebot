import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import charts from './modules/charts'
import user from './modules/user'
import globalData from './modules/globalData'
import tables from './modules/tables'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    charts,
    user,
    globalData,
    tables
  },
  getters
})

export default store
