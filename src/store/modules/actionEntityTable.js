import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
const actionEntityTable = {
  namespaced: true,
  state: {
    pagination: {
      page: 1,
      limit: 20,
      total: 10,
      sort: '+id'
    },
    projects: {
      list: []
    },
    'time-entries': {
      list: []
    }
  },
  getters: {
    list: (state) => type => state[type].list,
    pagination: (state) => state.pagination
  },
  actions: {
    clearStore({ state, commit }) {
      commit('CLEAR_STORE')
    },
    fetchList({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload))
          .then(response => {
            console.log(response)
            commit('FETCH_LIST', { data: response.data, type: payload })
            resolve()
          })
          .catch(err => console.log(err))
      })
    },
    fetchEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchEntity(payload.id, setQuery(payload.type))
          .then((res) => {
            resolve()
          })
      })
    },
    fetchAllEntities({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchAllEntities(setQuery(payload.type))
          .then((res) => {
            console.log(res)
            commit('FETCH_ALL_ENTITIES', { type: payload.type, data: res.data.data })
            resolve()
          })
      })
    },
    createEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.createEntity(payload.row, setQuery(payload.type))
          .then((res) => {
            commit('CREATE_ENTITY', { data: res.data.data, type: payload.type })
            resolve()
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
      state[payload.type].list = payload.data.data
      state.pagination.total = payload.data.data.length
    },
    CREATE_ENTITY(state, payload) {
      state[payload.type].list.unshift(payload.data)
    },
    FETCH_ALL_ENTITIES(state, payload) {
      state[payload.type].list = payload.data
    },
    UPDATE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1, payload.data)
    },
    DELETE_ENTITY(state, payload) {
      state[payload.type].list.splice(payload.index, 1)
    },
    SET_PAGINATION(state, payload) {
      console.log(payload)
      state.pagination[payload.type] = payload.value
    },
    CLEAR_STORE(state, payload) {
      state.pagination = {
        page: 1,
        limit: 20,
        total: 10,
        sort: '+id'
      }
    }
  }
}

export default actionEntityTable
