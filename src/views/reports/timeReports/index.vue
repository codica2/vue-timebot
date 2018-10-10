<template lang="pug">
  div
    div(class="timebot-header") Weekly
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          el-date-picker(
          v-model="date",
          :disabled="loader",
          type="daterange",
          range-separator="-",
          value-format="yyyy-MM-dd",
          :picker-options="pickerOptions",
          @change="setDate"
          start-placeholder="Start date",
          end-placeholder="End date",
          placeholder="Please pick a date",
          prefix-icon="date-calendar")
    div(v-if="list('timeReports').length" v-for="team in list('timeReports')" :key="team.id")
      div(class="highcharts-header") {{team.name}}
      tree-table( :data="team.projects" :eval-func="func" :eval-args="args" border)
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.name }}
        el-table-column(label="Collaborators")
          template(slot-scope="scope")
            span {{ scope.row.collaborators }}
        el-table-column(label="Details")
          template(slot-scope="scope")
            span {{ scope.row.details }}
        el-table-column(label="Total time")
          template(slot-scope="scope")
            span {{ scope.row.total_time }}
        el-table-column(label="Trello labels")
          template(slot-scope="scope")
            span {{ scope.row.trello_labels }}
        el-table-column(label="Time")
          template(slot-scope="scope")
            span {{ scope.row.time }}
</template>
<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/timeEntries'
import treeTable from '@/components/TreeTable/index'
export default {
  name: 'Weekly',
  components: {
    treeTable
  },
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'timeReports',
    func: treeToArray,
    args: [null, null, 'timeLine']
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
    })
  },
  mounted() {
    this.setDate()
  },
  methods: {
    setDate(date) {
      if (date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('actionEntityTable/setLoader', true)
      this.$store.dispatch('actionEntityTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.getList()
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', false)
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
