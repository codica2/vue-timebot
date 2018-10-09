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
    }
  },
  computed: {
    ...mapGetters({
      pagination: 'actionEntityTable/pagination'
    })
  },
  methods: {
    handleSizeChange(size) {
      this.$store.dispatch('actionEntityTable/setPagination', { size: size })
        .then(() => {
          this.$store.dispatch('actionEntityTable/setLoader', true)
          this.getList()
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', false)
              this.$scrollTo('body', 1000)
            })
        })
    },
    handleCurrentChange(page) {
      this.$store.dispatch('actionEntityTable/setPagination', { page: page })
        .then(() => {
          this.$store.dispatch('actionEntityTable/setLoader', true)
          this.getList()
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', false)
              this.$scrollTo('body', 1000)
            })
        })
    }
  }
}
</script>

<style scoped>

</style>
