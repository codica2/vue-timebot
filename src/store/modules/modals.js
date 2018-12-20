const temp = {
  id: undefined,
  type: '',
  date: '',
  details: '',
  name: '',
  description: '',
  'estimated-time': '',
  time: '',
  'trello-labels': [],
  project: {},
  user: {},
  team: {},
  'is-active': true
}
const modals = {
  namespaced: true,
  state: {
    visible: {
      view: false,
      edit: false
    },
    loading: false,
    status: '',
    temp: JSON.parse(JSON.stringify(temp))
  },
  getters: {
    visible: (state) => type => state.visible[type],
    status: (state) => state.status,
    temp: (state) => state.temp,
    loading: (state) => state.loading
  },
  actions: {
    toggleModal({ commit }, payload) {
      commit('TOGGLE_MODAL', payload)
    },
    setLoading({ commit }, payload) {
      commit('SET_LOADING', payload)
    }
  },
  mutations: {
    TOGGLE_MODAL(state, payload) {
      state.temp = Object.assign(JSON.parse(JSON.stringify(temp)), payload.temp)
      Object.assign(state, state.visible, { visible: payload.visible }, { status: payload.status })
    },
    SET_LOADING(state, payload) {
      state.loading = payload.loading
    }
  }
}

export default modals
