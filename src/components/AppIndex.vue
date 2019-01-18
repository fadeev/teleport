<template>
  <div>
    <div class="app-index">
      <div class="app-index__sidebar">
        <h3>Projects</h3>
        <div :class="['app-index__project__item', {'app-index__project__item--deselected': (selectedProject && project.id != selectedProject)}]"
             v-for="project in projectList"
             :key="project.id"
             @click="projectSelect(project.id)">
          {{project.name}}
        </div>
        <h3>Payment Systems</h3>
        <svg viewBox="0 0 100 200" fill="black" xmlns="http://www.w3.org/2000/svg">
          <g v-for="(payment, index) in paymentMethodList" :key="payment.id">
            <rect x="0" :y="20*index+10" height="10" :width="payment.count"/>
            <text :x="0" :y="20*index-2+10" style="font-size: 4">{{payment.name}}</text>
            <text :x="payment.count+3" :y="20*index+17.5" style="font-size: 7">{{payment.count}}</text>
          </g>
        </svg>
      </div>
      <div>
        <h3>Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                <input v-model="userSearch" type="text" placeholder="User" class="app-index__table__input">
              </th>
              <th class="app-index__table__amount">
                Amount
              </th>
              <th>

              </th>
              <th>
                Project
              </th>
              <th class="app-index__table__status">
                <select name="123" v-model="selectedStatus">
                  <option value="">All</option>
                  <option value="created">Created</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody v-for="transaction in transactionList"
                 :key="transaction.transaction.id">
            <tr v-if="transactionIsVisible(transaction)">
              <td>
                {{transaction.transaction.transfer_date.substring(0,10).replace(/-/g, '.')}}
              </td>
              <td class="app-index__table__name">
                <div><strong>{{transaction.user.name}}</strong> <span style="color: rgba(0,0,0,.25)"> {{transaction.user.country}}</span></div>
                <div>{{transaction.user.email}}</div>
              </td>
              <td class="app-index__table__amount">
                {{transaction.payment_details.payment.amount.toFixed(2)}}
              </td>
              <td>
                {{transactionCurrency(transaction)}}
              </td>
              <td>
                {{transaction.transaction.project.name}}
              </td>
              <td class="app-index__table__status">
                {{transactionStatus(transaction)}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .app-index { display: flex; }
  .app-index__sidebar { width: 250px; padding: 0 20px; box-sizing: border-box; }
  .app-index__table__amount { text-align: right; padding-right: 0; }
  th, td { padding: 0; border-spacing: 0; text-align: left; }
  td { padding: .5em .5em .5em 0; }
  input, select { font-size: inherit; font-family: inherit; }
  .app-index__project__item { margin-bottom: 1em; cursor: pointer; }
  .app-index__table__name { font-size: .75em; }
  .app-index__table__status { text-align: center; }
  .app-index__table__input { border: 1px solid rgba(0,0,0,.25); border-radius: 5px; padding: .25em; margin-right: 1em; }
  .app-index__project__item--deselected { color: rgba(0,0,0,.5); }
</style>


<script>
  import { mapState } from 'vuex'
  import { uniqBy, countBy, groupBy, orderBy } from 'lodash'

  export default {
    data: function() {
      return {
        selectedProject: null,
        userSearch: null,
        selectedStatus: null,
      }
    },
    mounted() {
      this.$store.dispatch('fetchTransactionList')
    },
    computed: {
      ...mapState([
        'transactionList'
      ]),
      projectList() {
        return uniqBy((this.transactionList || []).map(t => t.transaction.project), 'id')
      },
      paymentMethodList() {
        let transactionList = this.transactionList || []
        let count = countBy(transactionList.map(t => t.transaction.payment_method), 'id')
        return orderBy(uniqBy(transactionList.map(t => t.transaction.payment_method), 'id').map(t => {
          return {...t, count: count[t.id] }
        }), ['count', 'asc'])
      },
    },
    methods: {
      transactionCurrency(transaction) {
        let currency = transaction.payment_details.payment.currency
        let symbol = {'USD': '$', 'EUR': '€', 'RUB': '₽', 'JPY': '¥', 'THB': '฿', 'BRL': 'R$'}
        return symbol[currency] || currency
      },
      transactionStatus(transaction) {
        let status = {'canceled': '✕', 'done': '✓', 'created': '–'}
        return status[transaction.transaction.status]
      },
      projectSelect(id) {
        this.selectedProject = (this.selectedProject == id ? null : id)
      },
      transactionIsVisible(transaction) {
        let byProject = !this.selectedProject || (this.selectedProject && this.selectedProject == transaction.transaction.project.id)
        let byUserSearch = !this.userSearch || (this.userSearch && ((transaction.user.name + ' ' + transaction.user.email + ' ' + transaction.user.country).toLowerCase().match(this.userSearch.toLowerCase())))
        let byStatus = !this.selectedStatus || (transaction.transaction.status == this.selectedStatus)
        return byProject && byUserSearch && byStatus
      },
    },
  }
</script>
