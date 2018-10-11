<template lang="pug">
  div(v-loading="!isAnswered" style="overflow: hidden;")
    div(class="datepicker-header-container")
      div(class="timebot-header") Dashboard
      div(class="dashboard-statistics-datepicker")
        el-date-picker(
            v-model="date",
            :disabled="!isAnswered",
            type="daterange",
            range-separator="-",
            value-format="yyyy-MM-dd",
            :picker-options="pickerOptions",
            @change="setDate"
            start-placeholder="Start date",
            end-placeholder="End date",
            placeholder="Please pick a date",
            prefix-icon="date-calendar")
    div
      div(class="dashboard-flex-container")
        div(class="dashboard-flex-block")
          div(class="dashboard-header-statistics")(v-if="date")
            div(class="dashboard-header-image")
              <img src="src/icons/svg/analysis.svg">
            div(class="dashboard-stat-padding")
              div Statistics for
              span {{date[0]}} - {{date[1]}}
        div(class="dashboard-flex-block")
          div(class="dashboard-header-statistics")
            div(class="dashboard-header-image")
              <img src="src/icons/svg/deadline.svg">
            div(class="dashboard-stat-padding")
              div Hours to work:
              span {{staticData('hours_to_work')}}
        div(class="dashboard-flex-block")
          div(class="dashboard-header-statistics")
            div(class="dashboard-header-image")
              <img src="src/icons/svg/task.svg">
            div(class="dashboard-stat-padding")
              div Hours worked:
              span {{Math.round(staticData('hours_worked'))}}
      div(class="dashboard-flex--holiday-container")
        div(class="dashboard-flex-block mw-32")
          div(class="dashboard-header-statistics")(v-if="staticData('holidays').length")
            div(class="dashboard-header-image")
              <img src="src/icons/svg/holiday.svg">
            div(class="dashboard-stat-padding")
              div Holidays:
              span(class="mr-2" v-for="(holiday, holidayIndex) in staticData('holidays')" :key="holidayIndex")
                span {{ holiday[0] }}&nbsp;
                span {{ holiday[1] }}
    div(class="dashboard-graphics")
      el-col(:xs="24" :sm="24" :lg="12")(class="dashboard-graphics-margin")
        div(class="highcharts-header") Projects
        .chart-wrapper
          PieChart(
          :title="chartData('projects').title"
          :innerSize="chartData('projects').innerSize"
          :chart="{ plotBackgroundColor: null, plotBorderWidth: 0, plotShadow: false, type: 'pie' }"
          :plotOptions="{ pie: { dataLabels: { enabled: true, format: '<span><b>{point.name}</b>: {point.percentage:.1f}</span>', connectorColor: 'silver' }, showInLegend: true, startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: '70%' } }"
          :payloadData="chartData('projects').data"
          )#project-chart
      el-col(:xs="24" :sm="24" :lg="12")
        div(class="highcharts-header") Users
        .chart-wrapper
          PieChart(
          :title="chartData('departments').title"
          :chart="{ type: 'variablepie' }"
          :payloadData="chartData('departments').data"
          )
    el-col(:xs="24" :sm="24" :lg="24" v-if="staticData('series')")(class="dashboard-bt-graphics-margin")
      div(class="highcharts-header") Projects
      .chart-wrapper
        BarChart(
        :xAxisData="staticData('xAxisData')"
        :series="staticData('series')"
        )
    div(v-if="staticData('absent').length" class="dashboard-header-statistics") Absence
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
      'chartData',
      'tickets',
      'staticData'
    ])
  },
  mounted() {
    this.isAnswered = false
    this.$store.dispatch('fetchChartByDate', { type: this.type, params: { date_from: this.date[0], date_to: this.date[1] }})
      .then(() => {
        this.isAnswered = true
      })
  },
  methods: {
    setDate() {
      this.isAnswered = false
      if (this.date) {
        this.$store.dispatch('fetchChartByDate', { type: this.type, params: { date_from: this.date[0], date_to: this.date[1] }})
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
      border-radius: 4px;

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
