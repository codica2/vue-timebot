import { mapGetters } from 'vuex'
export const mixDate = {
  data: () => ({
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      shortcuts: [{
        text: 'Last week',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last month',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last 3 months',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    },
    isAnswered: true
  }),
  methods: {
    formatDate(date) {
      if (date) {
        let dd = date.getDate()
        if (dd < 10) dd = '0' + dd
        let mm = date.getMonth() + 1
        if (mm < 10) mm = '0' + mm
        let yy = date.getFullYear()
        if (yy < 10) yy = '0' + yy
        return yy + '-' + mm + '-' + dd
      }
    }
  },
  computed: {
    ...mapGetters([
      'rangeDate'
    ]),
    date: {
      get() { return this.rangeDate },
      set(value) { this.$store.dispatch('setRangeDate', value) }
    }
  },
  created() {
  },
  mounted() {
    if (this.date) {
      const end = new Date('2018-08-18')
      const start = new Date('2018-08-12')
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.$store.dispatch('setRangeDate', [this.formatDate(start), this.formatDate(end)])
    }
  }
}

export const mixValidationRules = {
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkProject = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        date: [{ validator: checkDate, type: 'date', required: true, message: 'Date is required', trigger: 'blur' }],
        time: [{ validator: checkDate, type: 'datetime', required: true, message: 'Time is required', trigger: 'blur' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        id: [{ validator: checkName, required: true, message: 'User is required', trigger: 'change' }],
        project: [{ validator: checkProject, required: true, message: 'Project is required', trigger: 'change' }],
        name: [{ validator: checkName, required: true, message: 'Name of project is requires', trigger: 'change' }],
        team: [{ required: true, message: 'Team is requires', trigger: 'change' }]
      }
    }
  }
}

export const mixDialog = {
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
        attributes: {
          'is-active': false
        },
        relationships: {
          team: {
            data: {}
          },
          user: {
            data: {}
          },
          project: {
            data: {}
          }
        }
      }
    }
  },
  methods: {
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
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
      this.dialogStatus = 'view'
      this.dialogViewVisible = true
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        type: '',
        date: '',
        attributes: {
          'is-active': false
        },
        relationships: {
          team: {
            data: {}
          },
          user: {
            data: {}
          },
          project: {
            data: {}
          }
        }
      }
    }
  }
}

export const mixPagination = {
  data: () => ({
  }),
  methods: {
    handleSizeChange(val) {
      this.$store.dispatch('actionEntityTable/setPagination', { type: 'limit', value: val })
        .then(() => {
          this.getList()
        })
    },
    handleCurrentChange(val) {
      this.$store.dispatch('actionEntityTable/setPagination', { type: 'page', value: val })
        .then(() => {
          this.getList()
        })
    }
  }
}

export const mixClean = {
  methods: {
    cleanObj(obj) {
      const object = Object.assign({}, obj)
      for (const prop in object) {
        if (object.hasOwnProperty(prop) && !object[prop]) {
          Reflect.deleteProperty(object, prop)
        }
      }
      return object
    }
  }
}

export const mixQuery = {
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearStore')
  },
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('actionEntityTable/setLoader', true)
        this.$store.dispatch('actionEntityTable/fetchList', this.type)
          .then(() => {
            this.$store.dispatch('actionEntityTable/setLoader', false)
            resolve()
          })
      })
    },
    removeEntity(row, status) {
      this.$confirm('This will permanently delete the entity. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('actionEntityTable/deleteEntity', { row, type: this.type })
          .then(() => {
            this.$message({
              message: 'Project was deleted',
              type: 'success'
            })
            row.status = status
          })
      }).catch(() => {
        this.$message({
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
          query = this.getIncluded(this.temp.relationships.project.data.id) || ''
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
          query = this.getIncluded(this.temp.relationships.user.data.id) || ''
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
        this.$store.dispatch('actionEntityTable/setLoader', true)
        this.$store.dispatch('actionEntityTable/setFilter', this.entity)
          .then(() => {
            this.$store.dispatch('actionEntityTable/fetchList', this.type)
              .finally(() => {
                this.$store.dispatch('actionEntityTable/setLoader', false)
                resolve()
              })
          })
      })
    }
  }
}

export const mixIncludes = {
  methods: {
    getIncluded(id) {
      if (this.included(this.type)) {
        const findInclude = this.included(this.type).find(pj => {
          if (pj.id === id) return pj
        })
        if (findInclude) {
          return findInclude.attributes.name
        }
      }
    }
  }
}
