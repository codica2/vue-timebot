<template lang="pug">
  div
    strong(v-if="date") Statistics for {{date[0]}} - {{date[1]}}
    div
      div Hours to work: {{staticData('hours_to_work')}}
      div Hours worked: {{staticData('hours_worked')}}
      div Holidays:
        div(v-for="(holiday, holidayIndex) in staticData('holidays')" :key="holidayIndex")
          div Name {{holiday[0]}}
          div Date {{holiday[1]}}
      div(v-if="staticData('absent').length") Absent
        div(v-for="(user, userIndex) in staticData('absent')" :key="userIndex")
          div User {{user.user_name}}
          div Date {{user.date}}
          div Reason {{user.reason}}
          div(v-if="user.comment") Comment {{user.comment}}
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
    el-col(:xs="24" :sm="24" :lg="12", v-if="chartData('projects').length")
      .chart-wrapper
        PieChart(
        :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('projects')}"
        :legendData="true"
        :payloadData="chartData('projects')")
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
        :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('departments')}"
        :payloadData="chartData('departments')"
        )
    el-col(:xs="24" :sm="24" :lg="24" v-if="staticData('series').length")
      .chart-wrapper
        BarChart(
        :legend="{data: barDataNames}"
        :xAxisData="staticData('xAxisData')"
          :series="staticData('series')"
        )
</template>

<script>
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { mixDate } from '@/mixins/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardAdmin',
  components: {
    PieChart,
    BarChart
  },
  mixins: [mixDate],
  data: () => ({
    type: 'dashboardChart'
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
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }
</style>
