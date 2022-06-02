import { $themeBreakpoints } from "@themeConfig";

import orders from "@/api/orders";
export default {
  namespaced: true,
  state: {
    ORDERS: [
      {
        id: "id",
        type: "type",
        kw: "kw",
        task: "task",
        clientName: "clientName",
        phone: "phone",
        price: "price",
        prepayment: "prepayment",
        inputDate: "inputDate",
        outputDate: "outputDate",
        status: {
          title: "status",
        },
        photo: "https://resheto.net/images/mater/pozitivnye_kartinki_2.jpg",
        actions: "actions",
      },
    ],
  },
  getters: {},
  mutations: {
    SET_ALL_ORDERS(state, payload) {
      state.ORDERS = payload;
    },
  },
  actions: {
    FETCH_ALL_ORDERS({ commit }, payload) {
      orders.getAll(payload).then((r) => {
        commit("SET_ALL_ORDERS", r.data);
      });
    },
    CREATE_ORDER({}, payload) {
      return orders.post(payload);
    },
    EDIT_ORDER({}, payload) {
      return orders.put(payload);
    },
  },
};
