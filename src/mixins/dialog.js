export default {
  data() {
    return {
      dialogFormLoading: false,
      loading: false,
      textMap: {
        update: 'Edit',
        create: 'Create',
        view: 'View'
      }
    }
  },
  methods: {
    handleUpdate(row) {
      let temp = {}
      temp = Object.assign({}, JSON.parse(JSON.stringify(row)))
      if (!row.team) {
        Object.assign(temp, { team: { id: '', type: 'teams' }})
      }
      this.$store.dispatch('modals/toggleModal', { visible: { edit: true }, status: 'update', temp: temp })
    },
    handleCreate() {
      this.$store.dispatch('modals/toggleModal', { visible: { edit: true }, status: 'create', temp: {}})
    },
    handleView(row) {
      let temp = {}
      temp = Object.assign({}, JSON.parse(JSON.stringify(row)))
      if (!row.team) {
        Object.assign(temp, { team: { id: '', type: 'teams' }})
      }
      this.$store.dispatch('modals/toggleModal', { visible: { view: true }, status: 'view', temp: temp })
    }
  },
  watch: {
    temp() {
      if (this.$refs['dataForm']) this.$refs['dataForm'].clearValidate()
    }
  },
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearFilters')
  }
}
