import { loginByUsername } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setQuery } from '@/api/queryConst'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = ['admin']
    }
  },

  actions: {
    LoginByUsername({ commit }, userInfo) {
      const email = userInfo.payload.email.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(setQuery(userInfo.type), email, userInfo.payload.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token, data.exp)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES')
        resolve({ data: { roles: ['admin'] }})
        // getUserInfo(state.token).then(response => {
        //   if (!response.data) {
        //     reject('error')
        //   }
        //   const data = response.data
        //
        //   if (data.roles && data.roles.length > 0) {
        //     commit('SET_ROLES', data.roles)
        //   } else {
        //     reject('getInfo: roles must be a non-null array !')
        //   }
        //
        //   commit('SET_NAME', data.name)
        //   commit('SET_AVATAR', data.avatar)
        //   commit('SET_INTRODUCTION', data.introduction)
        //   resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
