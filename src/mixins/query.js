export default {
  beforeDestroy() {
    this.$store.dispatch('setPagination', { page: 1 })
  },
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('setLoader', true)
        this.$store.dispatch('actionEntityTable/setFilter', this.entity)
          .then(() => {
            this.$store.dispatch('actionEntityTable/fetchList', this.type)
              .then(() => {
                this.$store.dispatch('setLoader', false)
                resolve()
              })
          })
      })
    },
    removeEntity(row, status) {
      this.$confirm('This will permanently delete the entity. Continue?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('actionEntityTable/deleteEntity', { row, type: this.type })
          .then(() => {
            this.$notify({
              message: `${this.setMessageName(this.type)} was deleted`,
              type: 'success'
            })
            row.status = status
          })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    createEntity(entity) {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogFormLoading = true
            this.$store.dispatch('actionEntityTable/createEntity', { row: entity, type: this.type })
              .then((res) => {
                this.dialogFormVisible = false
                this.dialogFormLoading = false
                this.$notify({
                  title: 'Success',
                  message: `${this.setMessageName(this.type)} was created`,
                  type: 'success',
                  duration: 2000
                })
                resolve()
              })
              .catch(() => {
                this.dialogFormVisible = false
                this.dialogFormLoading = false
              })
          }
        })
      })
    },
    updateEntity(entity) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormLoading = true
          this.$store.dispatch('actionEntityTable/updateEntity', { row: entity, type: this.type })
            .then(() => {
              this.dialogFormVisible = false
              this.dialogFormLoading = false
              this.$notify({
                title: 'Success',
                message: `${this.setMessageName(this.type)} was updated`,
                type: 'success',
                duration: 2000
              })
            })
            .catch(err => {
              console.log(err)
              this.dialogFormVisible = false
              this.dialogFormLoading = false
            })
        }
      })
    },
    multipleDelete(action) {
      this.$confirm('This will permanently delete the entity. Continue?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('actionEntityTable/batchActions', { row: this.delete(), type: this.type, action: action, index: this.multipleSelection })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    setMessageName(type) {
      switch (type) {
        case 'projects': return 'Project'
        case 'time-entries': return 'Time entry'
        case 'users': return 'User'
        case 'teams': return 'Team'
        case 'holidays': return 'Holiday'
        case 'absences': return 'Absence'
        case 'admins': return 'Admin'
      }
    },
    remoteGetProjects(query) {
      if (typeof query !== 'string') {
        if (this.temp) {
          query = this.getIncluded(this.temp.project.id) || ''
        } else {
          query = ''
        }
      }
      this.loading = true
      this.$store.dispatch('actionEntityTable/fetchEntityByName', { type: 'projects', query: query })
        .then(() => {
          this.loading = false
        })
    },
    remoteGetUsers(query) {
      if (typeof query !== 'string') {
        if (this.temp) {
          query = this.getIncluded(this.temp.user.id) || ''
        } else {
          query = ''
        }
      }
      this.loading = true
      this.$store.dispatch('actionEntityTable/fetchEntityByName', { type: 'users', query: query })
        .then(() => {
          this.loading = false
        })
    },
    filter() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('setLoader', true)
        this.$store.dispatch('actionEntityTable/setFilter', this.entity)
          .then(() => {
            this.$store.dispatch('actionEntityTable/fetchList', this.type)
              .then(() => {
                this.$store.dispatch('setLoader', false)
                resolve()
              })
              .catch(() => {
                this.$store.dispatch('setLoader', false)
              })
          })
      })
    },
    handleSelectionChange(values) {
      const index = []
      for (let i = 0; i < values.length; i++) {
        index.push(values[i].id)
      }
      this.multipleSelection = index
    }
  }
}
