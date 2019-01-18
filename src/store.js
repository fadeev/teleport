import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    transactionList: null,
  },
  actions: {
    fetchTransactionList({commit}) {
      axios.get('/raw.json').then(({data}) => {
        commit('updateTransactionList', data)
      })
    },
  },
  mutations: {
    updateTransactionList(state, data) {
      state.transactionList = data
    }
  }
})