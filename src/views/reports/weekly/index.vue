<template lang="pug">
    div
      el-date-picker(
      v-model="date",
      :disabled="loader",
      type="daterange",
      range-separator="-",
      value-format="yyyy-MM-dd",
      start-placeholder="Start date",
      :picker-options="pickerOptions",
      @change="setDate"
      end-placeholder="End date")
      div(class="timebot-header") Weekly
      div(v-if="list('timeReports').length" v-for="team in list('timeReports')" :key="team.id")
        div {{team.name}}
        tree-table( :data="team.projects" :eval-func="func" :eval-args="args" border)
          el-table-column(label="Date")
            template(slot-scope="scope")
              span {{ scope.row.date }}
          el-table-column(label="Name")
            template(slot-scope="scope")
              span {{ scope.row.name }}
          el-table-column(label="Reason")
            template(slot-scope="scope")
              span {{ scope.row.reason }}
          el-table-column(label="Comment")
            template(slot-scope="scope")
              span {{ scope.row.comment }}
</template>
<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/customEval'
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
      loader: 'actionEntityTable/loader',
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
