const charts = {
  state: {
    departments: {
      title: '',
      data: [
        { name: 'QA 200', value: 200 },
        { name: 'PM 25', value: 25 },
        { name: 'Review 100', value: 100 },
        { name: 'Development', value: 400 }
      ]
    },
    projects: {
      title: '',
      data: [
        { name: 'Qwerty', value: 100 },
        { name: 'Lorem', value: 33 }
      ]
    },
    developers: {
      title: '',
      data: [
        { name: 'Dima', value: 100 },
        { name: 'Alex', value: 33 },
        { name: 'Sasha', value: 77 }
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
    ]
  },
  getters: {
    chartData: (state) => path => {
      return state[path].data
    },
    tickets: (state) => state.tickets,
    chartDataNames: (state) => path => {
      let arr = []
      arr = JSON.parse(JSON.stringify(state[path].data))
      arr.filter(pt => {
        delete pt.value
        return pt
      })
      return arr
    }
  },
  mutations: {

  },
  actions: {

  }
}

export default charts
