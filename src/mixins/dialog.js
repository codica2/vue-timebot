export default {
  data() {
    return {
      dialogStatus: '',
      dialogFormVisible: false,
      dialogViewVisible: false,
      dialogFormLoading: false,
      textMap: {
        update: 'Edit',
        create: 'Create',
        view: 'View'
      },
      temp: {
        id: undefined,
        type: '',
        date: '',
        details: '',
        'estimated-time': '',
        time: '',
        'trello-labels': [],
        project: {},
        user: {},
        team: {},
        'is-active': true
      }
    }
  },
  methods: {
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      if (!row.team) {
        Object.assign(this.temp, { team: { id: '', type: 'teams' }})
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView(row) {
      this.temp = Object.assign({}, row)
      if (!row.team) {
        Object.assign(this.temp, { team: { id: '', type: 'teams' }})
      }
      this.dialogStatus = 'view'
      this.dialogViewVisible = true
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        type: '',
        date: '',
        details: '',
        'estimated-time': '',
        time: '',
        'trello-labels': [],
        project: {},
        user: {},
        team: {},
        'is-active': true
      }
    }
  },
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearFilters')
  }
}
