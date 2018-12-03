import { mapGetters } from 'vuex'

export default {
  data: () => ({
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      shortcuts: [
        {
          text: 'Current week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() - 1))
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: 'Last month',
          onClick(picker) {
            const start = new Date()
            const end = new Date(start.getFullYear(), start.getMonth(), 0)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1))
            start.setMonth(start.getMonth() - 1)
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
