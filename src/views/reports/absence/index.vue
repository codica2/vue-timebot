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
          @change="getAbsenceReports"
          end-placeholder="End date"
          prefix-icon="date-calendar")
    el-table(:data="list(type)")
      el-table-column(
        prop="name",
        label="Users")
      el-table-column(
        prop="vacation",
        label="Vacation")
      el-table-column(
        prop="illness",
        label="	Illness")
      el-table-column(
        prop="other"
        label="Other"
      )
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'UserReports',
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'absenceReports'
  }),
  computed: {
    ...mapGetters({
      loader: 'reportsTable/loader',
      list: 'reportsTable/list'
    })
  },
  created() {
    this.getAbsenceReports()
  },
  methods: {
    getAbsenceReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('reportsTable/setLoader', true)
      this.$store.dispatch('reportsTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('reportsTable/fetchList', this.type)
            .then(() => {
              this.$store.dispatch('reportsTable/setLoader', false)
            })
        })
    }
  }
}
</script>
