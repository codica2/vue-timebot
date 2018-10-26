<template lang="pug">
  div.pagination-container
    el-pagination(v-show="pagination.total > 0"
      :current-page="pagination.page"
      :page-sizes="[10,20,30,50]"
      :page-size="pagination.limit"
      :total="pagination.total"
      background layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange" @current-change="handleCurrentChange")
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Pagination',
  mixins: [mixin.mixPagination, mixin.mixQuery],
  props: {
    type: {
      type: String,
      require: true,
      default: ''
    },
    store: {
      type: String,
      require: true,
      default: 'actionEntityTable'
    }
  },
  computed: {
    ...mapGetters({
      pagination: 'pagination'
    })
  },
  methods: {
    handleSizeChange(limit) {
      this.$store.dispatch('setPagination', { limit: limit }, { root: true })
        .then(() => {
          this.$store.dispatch(`${this.store}/setLoader`, true)
          this.$store.dispatch(`${this.store}/fetchList`, this.type)
            .then(() => {
              this.$store.dispatch(`${this.store}/setLoader`, false)
            })
        })
    },
    handleCurrentChange(page) {
      this.$store.dispatch('setPagination', { page: page }, { root: true })
        .then(() => {
          this.$store.dispatch(`${this.store}/setLoader`, true)
          this.$store.dispatch(`${this.store}/fetchList`, this.type)
            .then(() => {
              this.$store.dispatch(`${this.store}/setLoader`, false)
              this.$scrollTo('body', 1000)
            })
        })
    }
  }
}
</script>

<style scoped>
</style>
