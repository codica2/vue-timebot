import * as Api from '@/api/charts'
import { setQuery } from '@/api/queryConst'
const charts = {
  state: {
    absent: [],
    hours_worked: '',
    hours_to_work: '',
    holidays: [],
    departments: {
      title: '',
      data: [
      ]
    },
    projects: {
      title: '',
      data: [
      ]
    },
    tickets: [
      {
        title: { text: 'Development' },
        qty: 50,
        color: [],
        data: [
          { name: '50', value: 100 }
        ]
      },
      {
        title: { text: 'Staging' },
        qty: 45,
        color: ['#333'],
        data: [
          { name: '45', value: 200 }
        ]
      },
      {
        title: { text: 'Production' },
        qty: 250,
        color: ['#666'],
        data: [
          { name: '250', value: 300 }
        ]
      }
    ],
    rangeDate: [],
    series: [],
    xAxisData: []
  },
  getters: {
    chartData: (state) => path => {
      return state[path].data
    },
    staticData: (state) => path => state[path],
    rangeDate: (state) => state.rangeDate,
    tickets: (state) => state.tickets,
    chartDataNames: (state) => path => {
      let arr = []
      arr = JSON.parse(JSON.stringify(state[path].data))
      arr.filter(pt => {
        delete pt.value
        return pt
      })
      return arr
    },
    barDataNames: (state) => {
      let arr = []
      let arrNames = []
      arr = JSON.parse(JSON.stringify(state.series))
      arr.forEach(item => {
        for (const prop in item) {
          if (item.hasOwnProperty(prop) && prop !== 'name') {
            Reflect.deleteProperty(item, prop)
          }
        }
        arrNames.push(item.name)
      })
      return arrNames
    }
  },
  mutations: {
    FETCH_CHART_BY_DATE(state, payload) {
      console.log(payload.data)
      state.departments = payload.data.users_chart
      state.projects = payload.data.projects_chart
      state.absent = payload.data.absent
      state.holidays = payload.data.holidays
      state.hours_to_work = payload.data.hours_to_work
      state.hours_worked = payload.data.hours_worked
      state.rangeDate = [payload.data.start_of_week, payload.data.end_of_week]
      state.series = payload.data.series
      state.xAxisData = payload.data.xAxisData
    },
    SET_RANGE_DATE(state, payload) {
      state.rangeDate = payload
    }
  },
  actions: {
    async fetchChartByDate({ state, commit }, payload) {
      console.log(payload)
      await Api.fetchChartByDate(setQuery(payload.type), payload.params)
        .then((res) => {
          commit('FETCH_CHART_BY_DATE', res)
        })
    },
    setRangeDate({ state, commit }, payload) {
      commit('SET_RANGE_DATE', payload)
    }
  }
}

export default charts
