import { $themeBreakpoints } from '@themeConfig'

import orders from '@/api/orders'
export default {
  namespaced: true,
  state: {
    ORDERS: []
  },
  getters: {
  },
  mutations: {
    SET_ALL_ORDERS(state, payload) {
      state.ORDERS = payload
    }
  },
  actions: {
    FETCH_ALL_ORDERS({ commit }, payload) {
      orders.getAll(payload)
        .then(r => {
          commit("SET_ALL_ORDERS", r.data)
        })
    },
    CREATE_ORDER({ }, payload) {
      return orders.post(payload)

    },
    EDIT_ORDER({ }, payload) {
      return orders.put(payload)
    }
  },
}
