import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
const actionEntityTable = {
  namespaced: true,
  state: {
    pagination: {
      page: 1,
      limit: 30,
      total: 10,
      sort: '+id'
    },
    filters: {
    },
    projects: {
      list: []
    },
    'time-entries': {
      list: [],
      included: []
    },
    users: {
      list: []
    },
    teams: {
      list: []
    },
    holidays: {
      list: []
    },
    absences: {
      list: [],
      included: []
    }
  },
  getters: {
    list: (state) => type => state[type].list,
    included: (state) => type => state[type].included,
    pagination: (state) => state.pagination
  },
  actions: {
    clearStore({ state, commit }) {
      commit('CLEAR_STORE')
    },
    setFilter({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_FILTER', { data: payload })
        resolve()
      })
    },
    fetchList({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload), { pagination: { page: state.pagination.page, 'per_page': state.pagination.limit }, params: state.filters })
          .then((response) => {
            commit('FETCH_LIST', { data: response.data, type: payload })
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
            console.log(response)
            resolve()
          })
      })
    },
    createEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.createEntity(payload.row, setQuery(payload.type))
          .then((response) => {
            console.log(response)
            commit('CREATE_ENTITY', { data: response.data.data, type: payload.type })
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
          .then((res) => {
            for (const v of state[payload.type].list) {
              if (v.id === payload.row.id) {
                const index = state[payload.type].list.indexOf(v)
                commit('UPDATE_ENTITY', { index, data: res.data.data, type: payload.type })
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
            const entityIndex = state[payload.type].list.findIndex((l, lInd) => {
              if (l.id === payload.row.id) return l
            })
            commit('DELETE_ENTITY', { index: entityIndex, type: payload.type })
            resolve()
          })
          .catch(err => console.log(err))
      })
    },
    setPagination({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_PAGINATION', payload)
        resolve()
      })
    }
  },
  mutations: {
    FETCH_LIST(state, payload) {
      console.log(payload)
      state[payload.type].list = payload.data.data
      if (payload.data.included) {
        state[payload.type].included = payload.data.included
      }
      if (payload.data.meta) {
        state.pagination.total = payload.data.meta['total-count']
      }
    },
    SET_FILTER(state, payload) {
      state.filters = payload
    },
    CREATE_ENTITY(state, payload) {
      console.log(payload)
      state[payload.type].list.unshift(payload.data)
    },
    FETCH_ENTITY_BY_NAME(state, payload) {
      payload.data.data.filter(q => {
        q.id = `${q.id}`
        return q
      })
      state[payload.type].list = payload.data.data
    },
    UPDATE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1, payload.data)
    },
    DELETE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1)
    },
    SET_PAGINATION(state, payload) {
      if (payload.size) {
        state.pagination.limit = payload.limit
      } else {
        state.pagination.page = payload.page
      }
    },
    CLEAR_STORE(state, payload) {
      state.projects = {
        list: []
      }
      state['time-entries'] = {
        list: [],
        included: []
      }
      state.users = {
        list: []
      }
      state.teams = {
        list: []
      }
      state.holidays = {
        list: []
      }
      state.absences = {
        list: [],
        included: []
      }
      state.pagination = {
        page: 1,
        limit: 30,
        total: 10,
        sort: '+id'
      }
    }
  }
}

export default actionEntityTable
