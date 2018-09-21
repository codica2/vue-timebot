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
  name: 'Index',
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
  }
}
</script>

<style scoped>

</style>
