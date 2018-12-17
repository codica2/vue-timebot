import { mapGetters } from 'vuex'

export default {
  data: () => ({
    pickerOptions: {
      shortcuts: [
        {
          text: 'Today',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Yesterday',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 1)
            end.setDate(end.getDate() - 1)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Current week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() - 1))
            end.setTime(end.setDate(end.getDate() - end.getDay() + 7))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Previous week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() + 6))
            end.setTime(end.getTime() - 3600 * 1000 * 24 * (end.getDay()))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Current month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            if (start.getDate() >= 16) {
              start.setMonth(start.getMonth())
              end.setMonth(end.getMonth() + 1)
            } else {
              start.setMonth(start.getMonth() - 1)
            }
            start.setDate(16)
            end.setDate(15)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            if (start.getDate() >= 16) {
              start.setMonth(start.getMonth() - 1)
              end.setMonth(end.getMonth())
            } else {
              start.setMonth(start.getMonth() - 2)
              end.setMonth(end.getMonth() - 1)
            }
            start.setDate(16)
            end.setDate(15)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Current month(Calendar)',
          onClick(picker) {
            const start = new Date()
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last month(Calendar)',
          onClick(picker) {
            const start = new Date()
            const end = new Date(start.getFullYear(), start.getMonth(), 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
            start.setMonth(start.getMonth() - 1)
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
