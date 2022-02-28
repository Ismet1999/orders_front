import { $themeBreakpoints } from '@themeConfig'

import statuses from '@/api/statuses'
export default {
  namespaced: true,
  state: {
    STATUSES: []
  },
  getters: {
  },
  mutations: {
    SET_ALL_STATUSES(state, payload) {
      state.STATUSES = payload
    }
  },
  actions: {
    FETCH_ALL_STATUSES({ commit }, payload) {
      statuses.getAll({ payload })
        .then(r => {
          commit("SET_ALL_STATUSES", r.data)
        })
    }
  },
}
