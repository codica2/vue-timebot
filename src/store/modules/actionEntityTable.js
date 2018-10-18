import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
import { mixEntities } from '@/mixins/index'
const actionEntityTable = {
  namespaced: true,
  state: {
    loader: false,
    filters: {
    },
    projects: {
      list: [],
      filterable: []
    },
    'time-entries': {
      list: [],
      included: [],
      filterable: []
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
    list: (state) => type => state[type].list,
    filterable: (state) => type => state[type].filterable,
    included: (state) => type => state[type].included,
    loader: (state) => state.loader
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
            commit('FETCH_ENTITY_BY_NAME', { data: response.data, type: payload.type })
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
    clearStore({ state, commit }) {
      commit('CLEAR_STORE')
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
    CREATE_ENTITY(state, payload) {
      state[payload.type].list.unshift(payload.data.data)
      if (payload.data.included) {
        state[payload.type].included = [...state[payload.type].included, ...payload.data.included]
      }
    },
    FETCH_ENTITY_BY_NAME(state, payload) {
      payload.data.data.filter(q => {
        q.id = `${q.id}`
        return q
      })
      state[payload.type].filterable = payload.data.data
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
    CLEAR_STORE(state) {
      state.projects = {
        list: [],
        filterable: []
      }
      state['time-entries'] = {
        list: [],
        included: [],
        filterable: []
      }
      state.users = {
        list: [],
        filterable: []
      }
      state.teams = {
        list: [],
        filterable: []
      }
      state.holidays = {
        list: [],
        filterable: []
      }
      state.absences = {
        list: [],
        included: [],
        filterable: []
      }
      state.filters = {
      }
      state.pagination = {
        page: 1,
        limit: 30,
        total: 10,
        sort: '+id'
      }
      state.estimationReports = {
        list: []
      }
      state.timeReports = {
        list: []
      }
      state.admins = {
        list: []
      }
    },
    SET_LOADER(state, payload) {
      state.loader = payload
    }
  }
}

export default actionEntityTable
