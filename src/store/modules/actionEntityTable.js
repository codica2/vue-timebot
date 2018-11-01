import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
import { mixEntities } from '@/mixins/index'
const actionEntityTable = {
  namespaced: true,
  state: {
    filters: {
    },
    projects: {
      list: [],
      filterable: []
    },
    'time-entries': {
      list: [],
      included: [],
      filterable: [],
      worked_time: []
    },
    users: {
      list: [],
      filterable: []
    },
    teams: {
      list: [],
      filterable: []
    },
    holidays: {
      list: [],
      filterable: []
    },
    absences: {
      list: [],
      included: [],
      filterable: []
    },
    timeReports: {
      list: []
    },
    admins: {
      list: []
    }
  },
  getters: {
    entity: (state) => (type, entity) => state[type][entity],
    list: (state) => type => state[type].list,
    filterable: (state) => type => state[type].filterable,
    included: (state) => type => state[type].included,
    filters: (state) => state.filters
  },
  actions: {
    fetchList({ state, commit, rootState, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload), { page: rootState.pagination.pagination.page, 'per_page': rootState.pagination.pagination.limit, ...state.filters })
          .then((response) => {
            const data = mixEntities.methods.createEntities(response)
            commit('FETCH_LIST', { data: data, type: payload })
            if (response.data.meta) {
              dispatch('setPagination', { total: response.data.meta['total-count'] || response.data.meta['total_count'] }, { root: true })
            }
            resolve()
          })
      })
    },
    fetchEntityByName({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchEntityByName(setQuery(payload.type), payload.query)
          .then((response) => {
            commit('FETCH_ENTITY_BY_NAME', { data: response.data.data.sort((a, b) => {
              if (a > b) return 1
              if (a < b) return -1
            }), type: payload.type })
            resolve()
          })
      })
    },
    fetchEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchEntity(payload.id, setQuery(payload.type))
          .then((response) => {
            resolve()
          })
      })
    },
    createEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.createEntity(payload.row, setQuery(payload.type))
          .then((response) => {
            const data = mixEntities.methods.createEntity(response)
            commit('CREATE_ENTITY', { data: data, type: payload.type })
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    updateEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.updateEntity(payload.row, setQuery(payload.type))
          .then((response) => {
            for (const v of state[payload.type].list) {
              if (v.id === payload.row.id) {
                const index = state[payload.type].list.indexOf(v)
                const data = mixEntities.methods.createEntity(response)
                commit('UPDATE_ENTITY', { index, data: data, type: payload.type })
                break
              }
            }
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    deleteEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.deleteEntity(payload.row, setQuery(payload.type))
          .then((res) => {
            const entityIndex = state[payload.type].list.findIndex((l) => {
              if (l.id === payload.row.id) return l
            })
            commit('DELETE_ENTITY', { index: entityIndex, type: payload.type })
            resolve()
          })
      })
    },
    batchActions({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.batchAction({ ...payload.row }, `${setQuery(payload.type)}/${payload.action}`)
          .then((res) => {
            for (let i = 0; i < payload.index.length; i++) {
              const entityIndex = state[payload.type].list.findIndex((l) => {
                if (l.id === payload.index[i]) return l
              })
              commit('BATCH_ACTIONS', { index: entityIndex, type: payload.type })
            }
            resolve()
          })
      })
    },
    fetchWorkedTime({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload.type), { ...state.filters })
          .then((response) => {
            commit('FETCH_WORKED_TIME', { data: response.data.data })
          })
      })
    },
    setFilter({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FILTER', { data: payload })
        resolve()
      })
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    }
  },
  mutations: {
    CLEAR_FILTERS(state) {
      state.filters = {
      }
    },
    FETCH_LIST(state, payload) {
      state[payload.type].list = payload.data.data
      if (payload.data.included) {
        state[payload.type].included = payload.data.included
      }
    },
    SET_FILTER(state, payload) {
      state.filters = payload.data
    },
    CREATE_ENTITY(state, payload) {
      state[payload.type].list.unshift(payload.data.data)
      if (payload.data.included) {
        state[payload.type].included = [...state[payload.type].included, ...payload.data.included]
      }
    },
    FETCH_ENTITY_BY_NAME(state, payload) {
      payload.data.filter(q => {
        q.id = `${q.id}`
        return q
      })
      state[payload.type].filterable = payload.data
    },
    UPDATE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1, payload.data.data)
      if (payload.data.included) {
        state[payload.type].included = [...state[payload.type].included, ...payload.data.included]
      }
    },
    DELETE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1)
    },
    BATCH_ACTIONS(state, payload) {
      state[payload.type].list.splice(payload.index, 1)
    },
    FETCH_WORKED_TIME(state, payload) {
      state['time-entries'].worked_time = payload.data
    }
  }
}

export default actionEntityTable
