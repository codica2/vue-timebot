import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import charts from './modules/charts'
import user from './modules/user'
import actionEntityTable from './modules/actionEntityTable'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    charts,
    user,
    actionEntityTable
  },
  getters
})

export default store
