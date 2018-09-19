const tables = {
  state: {
    tableData: {
      data: [
        {
          id: 1,
          project: 'africar',
          ticket: '',
          labels: '',
          users_worked_on: '',
          estimate: '',
          time: '36.0',
          children: [
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            }
          ]
        },
        {
          id: 2,
          project: 'africar',
          ticket: '',
          labels: '',
          users_worked_on: '',
          estimate: '',
          time: '36.0',
          children: [
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            }
          ]
        },
        {
          id: 3,
          project: 'africar',
          ticket: '',
          labels: '',
          users_worked_on: '',
          estimate: '',
          time: '36.0',
          children: [
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            },
            {
              project: '',
              ticket: 'code review',
              labels: '',
              users_worked_on: 'Rostislav Korin',
              estimate: '',
              time: '0.5'
            }
          ]
        }
      ]
    },
    tableData1: {
      data: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }
      ]
    }
  },
  getters: {
    tableData: (state) => path => { return state[path] }
  },
  actions: {},
  mutaions: {}
}
export default tables
