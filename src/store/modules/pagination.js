const pagination = {
  state: {
    pagination: {
      page: 1,
      limit: 30,
      total: 10,
      sort: '+id'
    }
  },
  getters: {
    pagination: (state) => state.pagination
  },
  actions: {
    setPagination: {
      root: true,
      handler({ state, commit }, payload) {
        return new Promise((resolve, reject) => {
          commit('SET_PAGINATION', payload)
          resolve()
        })
      }
    },
    setDefault({ state, commit }) {
      commit('SET_DEFAULT')
    }
  },
  mutations: {
    SET_PAGINATION(state, payload) {
      if (payload.limit) {
        state.pagination.limit = payload.limit
      } else if (payload.page) {
        state.pagination.page = payload.page
      } else if (payload.total) {
        state.pagination.total = payload.total
      }
    },
    SET_DEFAULT(state) {
      state.pagination = {
        page: 1,
        limit: 30,
        total: 10,
        sort: '+id'
      }
    }
  }
}

export default pagination
