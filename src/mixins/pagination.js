export default {
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
