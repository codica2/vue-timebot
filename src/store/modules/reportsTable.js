import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'

const reportsTable = {
  namespaced: true,
  state: {
    estimationReports: {
      list: []
    },
    timeReports: {
      list: []
    },
    userReports: {
      list: []
    },
    absenceReports: {
      list: []
    },
    filters: {
    },
    loader: false
  },
  getters: {
    list: (state) => type => state[type].list,
    included: (state) => type => state[type].included,
    loader: (state) => state.loader,
    filters: (state) => state.filters
  },
  actions: {
    fetchList({ state, commit, dispatch, rootState }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload), { page: rootState.pagination.pagination.page, 'per_page': rootState.pagination.pagination.limit, ...state.filters })
          .then((response) => {
            commit('FETCH_LIST', { data: response.data, type: payload })
            if (response.data.meta) {
              dispatch('setPagination', { total: response.data.meta['total-count'] || response.data.meta['total_count'] }, { root: true })
            }
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    setFilter({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FILTER', { data: payload })
        resolve()
      })
    },
    setLoader({ state, commit }, payload) {
      commit('SET_LOADER', payload)
    }
  },
  mutations: {
    FETCH_LIST(state, payload) {
      state[payload.type].list = payload.data.data
      if (payload.data.included) {
        state[payload.type].included = payload.data.included
      }
    },
    SET_FILTER(state, payload) {
      state.filters = payload.data
    },
    SET_LOADER(state, payload) {
      state.loader = payload
    },
    SET_PAGINATION(state, payload) {
      if (payload.limit) {
        state.pagination.limit = payload.limit
      } else {
        state.pagination.page = payload.page
      }
    }
  }
}

export default reportsTable
