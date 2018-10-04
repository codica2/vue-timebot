<template lang="pug">
  div(v-loading="!isAnswered" style="overflow: hidden;")
    div(style="max-width: 500px")
      strong(v-if="date") Statistics for {{date[0]}} - {{date[1]}}
      div
        div Hours to work: {{staticData('hours_to_work')}}
        div Hours worked: {{staticData('hours_worked')}}
        div Holidays:
          div(v-for="(holiday, holidayIndex) in staticData('holidays')" :key="holidayIndex")
            div Name {{holiday[0]}}
            div Date {{holiday[1]}}
      div
        el-date-picker(
            v-model="date",
            :disabled="!isAnswered",
            type="daterange",
            range-separator="-",
            value-format="yyyy-MM-dd",
            start-placeholder="Start date",
            :picker-options="pickerOptions",
            @change="setDate"
            end-placeholder="End date")
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
        :innerSize="chartData('projects').innerSize"
        :chart="{ plotBackgroundColor: null, plotBorderWidth: 0, plotShadow: false, type: 'pie' }"
        :plotOptions="{ pie: { dataLabels: { enabled: true, format: '<span><b>{point.name}</b>: {point.percentage:.1f}</span>', connectorColor: 'silver' }, showInLegend: true, startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: '70%' } }"
        :payloadData="chartData('projects').data"
        )
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
        :chart="{ type: 'variablepie' }"
        :payloadData="chartData('departments').data"
        )
    el-col(:xs="24" :sm="24" :lg="24" v-if="staticData('series')")
      .chart-wrapper
        BarChart(
        :xAxisData="staticData('xAxisData')"
        :series="staticData('series')"
        )
    tree-table(v-if="staticData('absent').length" :data="staticData('absent')" :eval-func="func" :eval-args="args" border)
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
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { mixDate } from '@/mixins/index.js'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/customEval'
import treeTable from '@/components/TreeTable/index'
import { Chart } from 'highcharts-vue'

export default {
  name: 'DashboardAdmin',
  components: {
    PieChart,
    BarChart,
    treeTable,
    highcharts: Chart
  },
  mixins: [mixDate],
  data: () => ({
    type: 'dashboardChart',
    func: treeToArray,
    args: [null, null, 'timeLine']
  }),
  computed: {
    ...mapGetters([
      'chartDataNames',
      'chartData',
      'tickets',
      'staticData',
      'barDataNames'
    ])
  },
  methods: {
    setDate() {
      this.isAnswered = false
      if (this.date) {
        this.$store.dispatch('fetchChartByDate', { type: this.type, params: { start_date: this.date[0], end_date: this.date[1] }})
          .then(() => {
            this.isAnswered = true
          })
      } else {
        this.$store.dispatch('fetchChartByDate', { type: this.type, params: {}})
          .then(() => {
            this.isAnswered = true
          })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .chart-container {
    display: flex;
    flex-direction: row;
    .chart-wrapper{
      width: 33%;
      border: 2px solid #eaeaec;
      border-radius: 2px;
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }
  .highcharts-grid.highcharts-yaxis-grid {
    display: none;
  }
</style>
