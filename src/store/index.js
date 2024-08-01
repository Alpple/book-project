import { createStore } from 'vuex'
// vuex-persistedstate 【前段时间开始停止了维护】
import persistedState from "vuex-persistedstate"

export default createStore({
  // 状态
  state: {
    user: {}
  },
  // mutations才能直接改变 state里面的值. 这里只能执行[同步操作]
  mutations: {
    setUser(state, _user) {
      state.user = _user;
    }
  },
  // mutations 用来提交 。 这里可以执行[异步操作]
  actions: {
    setUser(context, _user) {
      context.commit('setUser', _user)
    }
  },
  modules: {},
  plugins: [
    // state 持久化，防止刷新后丢失
    persistedState({
      storage: window.sessionStorage,
    })
  ]
})
