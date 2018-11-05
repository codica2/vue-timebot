import { mapGetters } from 'vuex'
export const mixDate = {
  data: () => ({
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      shortcuts: [
        {
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() - 1))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last 7 days',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last 30 days',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last 90 days',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
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
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() - 1))
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
      if (!value.id) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkUser = (rule, value, callback) => {
      if (!value.id) {
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
    const checkRole = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      rules: {
        date: [{ validator: checkDate, type: 'date', required: true, message: 'Date is required', trigger: 'blur' }],
        time: [{ validator: checkDate, type: 'datetime', required: true, message: 'Time is required', trigger: 'blur' }],
        project: [{ validator: checkProject, required: true, message: 'Project is required', trigger: 'change' }],
        user: [{ validator: checkUser, required: true, message: 'User is required', trigger: 'change' }],
        name: [{ validator: checkName, required: true, message: 'Name is required', trigger: 'change' }],
        role: [{ validator: checkRole, required: true, message: 'Role is required', trigger: 'change' }],
        reason: [{ validator: checkRole, required: true, message: 'Reason is required', trigger: 'change' }],
        team: [{ required: false, message: 'Team is required', trigger: 'change' }],
        description: [{ validator: checkName, required: true, message: 'Description is required', trigger: 'change' }],
        password: [{ validator: checkName, required: true, message: 'Password is required', trigger: 'change' }],
        email: [{ required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }]
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
        details: '',
        'estimated-time': '',
        time: '',
        'trello-labels': [],
        project: {},
        user: {},
        team: {}
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
        details: '',
        'estimated-time': '',
        time: '',
        'trello-labels': [],
        project: {},
        user: {},
        team: {}
      }
    }
  },
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearFilters')
  }
}

export const mixPagination = {
  data: () => ({
  }),
  methods: {
    handleSizeChange(val) {
      this.$store.dispatch('setPagination', { type: 'limit', value: val }, { root: true })
        .then(() => {
          this.getList()
        })
    },
    handleCurrentChange(val) {
      this.$store.dispatch('setPagination', { type: 'page', value: val }, { root: true })
        .then(() => {
          this.getList()
        })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('setDefault')
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
    multipleDelete(action) {
      this.$confirm('This will permanently delete the entity. Continue?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('actionEntityTable/batchActions', { row: this.delete(), type: this.type, action: action, index: this.multipleSelection })
      }).catch(() => {
        this.$message({
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

export const mixIncludes = {
  methods: {
    getIncluded(id) {
      if (this.included(this.type)) {
        const findInclude = this.included(this.type).find(pj => {
          if (pj.id === id) return pj
        })
        if (findInclude) {
          return findInclude.name
        }
      }
    }
  }
}

export const mixEntities = {
  methods: {
    createEntities(response) {
      const entities = []
      const included = []
      const data = {}
      response.data.data.forEach(dt => {
        const entity = {}
        for (const key in dt.attributes) {
          if (dt.attributes.hasOwnProperty(key)) {
            entity[key] = dt.attributes[key]
          }
        }
        for (const key in dt.relationships) {
          if (dt.relationships.hasOwnProperty(key)) {
            entity[key] = dt.relationships[key].data
          }
        }
        entity.id = dt.id
        entities.push(entity)
      })
      if (response.data.included) {
        response.data.included.forEach(ic => {
          const entity = {}
          for (const key in ic.attributes) {
            if (ic.attributes.hasOwnProperty(key)) {
              entity[key] = ic.attributes[key]
            }
          }
          entity.id = ic.id
          included.push(entity)
        })
      }
      data.data = entities
      data.included = included
      data.meta = response.data.meta
      return data
    },
    createEntity(response) {
      const included = []
      const data = {}
      const entity = {}
      for (const key in response.data.data.attributes) {
        if (response.data.data.attributes.hasOwnProperty(key)) {
          entity[key] = response.data.data.attributes[key]
        }
      }
      for (const key in response.data.data.relationships) {
        if (response.data.data.relationships.hasOwnProperty(key)) {
          entity[key] = response.data.data.relationships[key].data
        }
      }
      if (response.data.included) {
        response.data.included.forEach(ic => {
          const entity = {}
          for (const key in ic.attributes) {
            if (ic.attributes.hasOwnProperty(key)) {
              entity[key] = ic.attributes[key]
            }
          }
          entity.id = ic.id
          included.push(entity)
        })
      }
      entity.id = response.data.data.id
      data.data = entity
      data.included = included
      return data
    }
  }
}
