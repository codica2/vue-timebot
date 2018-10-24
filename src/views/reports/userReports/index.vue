<template lang="pug">
  div(v-loading="loader")
    div(class="timebot-header") User reports
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          el-date-picker(
          v-model="date",
          type="daterange",
          range-separator="-",
          value-format="yyyy-MM-dd",
          start-placeholder="Start date",
          :picker-options="pickerOptions",
          @change="getTimeReports"
          end-placeholder="End date"
          prefix-icon="date-calendar")
    el-table(:data="list('userReports')")
      el-table-column(
        prop="name",
        label="Users")
      el-table-column(
        prop="hours_worked",
        label="Hours worked")
      el-table-column(
        prop="hours_to_work",
        label="	Estimated Hours Worked")
      el-table-column(
        prop="difference"
        label="Difference"
      )
        template(slot-scope="scope") {{scope.row.difference.toFixed(2)}}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'UserReports',
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'userReports'
  }),
  computed: {
    ...mapGetters({
      loader: 'reportsTable/loader',
      list: 'reportsTable/list'
    })
  },
  created() {
    this.getTimeReports()
  },
  methods: {
    getTimeReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('reportsTable/setLoader', true)
      this.$store.dispatch('reportsTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('reportsTable/fetchList', this.type)
          this.$store.dispatch('reportsTable/setLoader', false)
        })
    }
  }
}
</script>
