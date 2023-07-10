export const state = () => ({
  isLoggedIn: false,
  userInfo: {},
})

export const mutations = {
  login(state: any, payload: any) {
    state.isLoggedIn = true
    state.userInfo = payload
  },
  logout(state: any) {
    state.isLoggedIn = false
    state.userInfo = null
  },
}

export const actions = {
  login({ commit }: any, payload: any) {
    commit('login', payload)
  },
  logout({ commit }: any) {
    commit('logout')
  },
}
