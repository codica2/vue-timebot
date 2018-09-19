const globalData = {
  state: {
    rangeDate: []
  },
  getters: {
    rangeDate: (state) => state.rangeDate
  },
  actions: {
    setRangeDate({ state, commit }, payload) {
      commit('SET_RANGE_DATE', payload)
    }
  },
  mutations: {
    SET_RANGE_DATE(state, payload) {
      state.rangeDate = payload
    }
  }
}
export default globalData
