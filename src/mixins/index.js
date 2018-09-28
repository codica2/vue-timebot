import { mapGetters } from 'vuex'
export const mixDate = {
  data: () => ({
    pickerOptions: {
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
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.$store.dispatch('setRangeDate', [this.formatDate(start), this.formatDate(end)])
      this.isAnswered = false
      this.$store.dispatch('fetchChartByDate', { type: this.type, params: { start_date: this.date[0], end_date: this.date[1] }})
        .then(() => {
          this.isAnswered = true
        })
    }
  }
}
export const mixValidationRules = {
  data() {
    const checkName = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkProject = (rule, value, callback) => {
      console.log(value)
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
        alias: [{ validator: checkName, required: true, message: 'Alias of project is requires', trigger: 'change' }]
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
      listLoading: true,
      textMap: {
        update: 'Edit',
        create: 'Create',
        view: 'View'
      },
      temp: {
        id: undefined,
        type: '',
        date: '',
        attributes: {},
        relationships: {
          team: {},
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
        attributes: {},
        relationships: {
          team: {},
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
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$store.dispatch('actionEntityTable/fetchList', this.type)
          .then(() => {
            this.listLoading = false
          })
        resolve()
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
    createEntity() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogFormLoading = true
            this.$store.dispatch('actionEntityTable/createEntity', { row: this.temp, type: this.type })
              .then((res) => {
                this.dialogFormVisible = false
                this.dialogFormLoading = false
                this.$notify({
                  title: 'Success',
                  message: 'Entity was created',
                  type: 'success',
                  duration: 2000
                })
                resolve()
              })
              .catch(err => {
                console.log(err)
                this.dialogFormVisible = false
                this.dialogFormLoading = false
              })
          }
        })
      })
    },
    updateEntity() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormLoading = true
          const tempData = Object.assign({}, this.temp)
          this.$store.dispatch('actionEntityTable/updateEntity', { row: tempData, type: this.type })
            .then(() => {
              this.dialogFormVisible = false
              this.dialogFormLoading = false
              this.$notify({
                title: 'Success',
                message: 'Entity was updated',
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
    }
  }
}
