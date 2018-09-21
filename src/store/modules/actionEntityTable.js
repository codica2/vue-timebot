import * as Api from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
const actionEntityTable = {
  namespaced: true,
  state: {
    list: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 10,
      sort: '+id'
    }
  },
  getters: {
    list: (state) => state.list,
    pagination: (state) => state.pagination
  },
  actions: {
    fetchList({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.fetchList(setQuery(payload))
          .then(response => {
            console.log(response)
            commit('FETCH_LIST', response.data)
            resolve()
          })
          .catch(err => console.log(err))
      })
    },
    createEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.createEntity(payload.row, setQuery(payload.type))
          .then((res) => {
            commit('CREATE_ENTITY', res.data.data)
            resolve()
          })
      })
    },
    updateEntity({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.updateEntity(payload.row, setQuery(payload.type))
          .then(() => {
            for (const v of state.list) {
              if (v.id === payload.row.id) {
                const index = state.list.indexOf(v)
                commit('UPDATE_ENTITY', { index, data: payload.row })
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
            const entityIndex = state.list.findIndex((l, lInd) => {
              if (l.id === payload.row.id) return l
            })
            commit('DELETE_PROJECT', entityIndex)
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
      state.list = payload.data
      state.pagination.total = payload.data.length
    },
    CREATE_ENTITY(state, payload) {
      state.list.unshift(payload)
    },
    UPDATE_ENTITY(state, payload) {
      state.list.splice(payload.index, 1, payload.data)
    },
    DELETE_PROJECT(state, payload) {
      state.list.splice(payload, 1)
    },
    SET_PAGINATION(state, payload) {
      state.pagination[payload.type] = payload.value
    }
  }
}

export default actionEntityTable
