<template lang="pug">
    div
      strong(v-if="date") Statistics for {{date[0]}} - {{date[1]}}
      el-select(v-model="value" placeholder="Select")
        el-option(
          v-for="item in list"
          :key="item.id"
          :label="item.attributes.name"
          :value="item.id")
      el-date-picker(
        v-model="date",
        type="daterange",
        range-separator="-",
        value-format="dd-MM-yyyy",
        start-placeholder="Start date",
        :picker-options="pickerOptions",
        end-placeholder="End date")
      el-col(:xs="24" :sm="24" :lg="24")
        .chart-wrapper
          PieChart(
          :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('developers')}"
          :legendData="true"
          :payloadData="chartData('developers')")
        .chart-wrapper
          PieChart(
            :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('departments')}"
            :payloadData="chartData('departments')"
          )
      filters
      projectsTable
      el-table(:data="tableData('tableData1').data" style="width: 100%")
        el-table-column(
        v-for="(row, rowIndex) in tableData('tableData1').data"
        :key="rowIndex"
        v-if="Object.keys(row)[rowIndex]"
        :prop="Object.keys(row)[rowIndex]",
        :label="Object.keys(row)[rowIndex][0].toUpperCase() + Object.keys(row)[rowIndex].slice(1)"
        width="180")
      tree-table(:data="tableData('tableData').data" :eval-func="func" :eval-args="args" border)
        el-table-column(label="Project")
          template(slot-scope="scope")
            span {{ scope.row.project }}
        el-table-column(label="Ticket")
          template(slot-scope="scope")
            span {{ scope.row.ticket }}
        el-table-column(label="Labels")
          template(slot-scope="scope")
            span {{ scope.row.labels }}
        el-table-column(label="Users worked on")
          template(slot-scope="scope")
            span {{ scope.row.users_worked_on }}
        el-table-column(label="Estimate")
          template(slot-scope="scope")
            span {{ scope.row.estimate }}
        el-table-column(label="Time")
          template(slot-scope="scope")
            span {{ scope.row.time }}
</template>

<script>
import { mixDate } from '@/mixins/index.js'
import PieChart from '../dashboard/admin/components/PieChart'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/customEval'
import treeTable from '@/components/TreeTable/index'
import projectsTable from './projectsTable'
import filters from './filters'
export default {
  name: 'Projects',
  components: {
    PieChart,
    treeTable,
    projectsTable,
    filters
  },
  mixins: [mixDate],
  data: () => ({
    options: [
      {
        value: '1',
        label: 'Timebot'
      },
      {
        value: '2',
        label: 'Africar'
      }
    ],
    value: '',
    func: treeToArray,
    args: [null, null, 'timeLine']
  }),
  computed: {
    ...mapGetters([
      'chartDataNames',
      'chartData',
      'tableData'
    ]),
    ...mapGetters({
      list: 'actionEntityTable/list'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
