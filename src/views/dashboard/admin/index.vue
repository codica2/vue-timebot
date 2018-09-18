<template lang="pug">
  div
    strong(v-if="date") Statistics for {{date[0]}} - {{date[1]}}
    div
      div Hours to work: 250
      div Hours worked: 245
      div Holidays: 25.12.2018 Christmas
      div Adsent: 20.12.2018 Alex, Bill, Max
    el-date-picker(
        v-model="date",
        type="daterange",
        range-separator="-",
        value-format="dd-MM-yyyy",
        start-placeholder="Start date",
        :picker-options="pickerOptions",
        end-placeholder="End date")
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
        :legend="{orient: 'horizontal', bottom: '10', data: [{name: 'Qwerty'}, {name: 'Lorem'}]}"
        :legendData="true"
        :payloadData="[{name: 'Qwerty', value: 100}, {name: 'Lorem', value: 33}]")
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
          :payloadData="[{name: 'QA 200', value: 200}, {name: 'PM 25', value: 25}, {name: 'Review 100', value: 100}, {name: 'Development', value: 400}]"
        )
    el-col(:xs="24" :sm="24" :lg="24")
      h2 Tickets in work:
      .chart-container
        .chart-wrapper
          PieChart(
            :labelSector="'center'"
            :payloadData="[{name: '50', value: 100}]"
            :title="{text: 'Development'}"
          )
        .chart-wrapper
          PieChart(
            :labelSector="'center'"
            :color="['#333']",
            :payloadData="[{name: '45', value: 200}]"
            :title="{text: 'Staging'}"
          )
        .chart-wrapper
          PieChart(
            :labelSector="'center'"
            :color="['#666']",
            :payloadData="[{name: '250', value: 300}]"
            :title="{text: 'Production'}"
          )
</template>

<script>
import PieChart from './components/PieChart'
export default {
  name: 'DashboardAdmin',
  components: {
    PieChart
  },
  data: () => ({
    date: ['16-09-2018', '17-09-2018'],
    pickerOptions: {
      shortcuts: [{
        text: 'Last week',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last month',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last 3 months',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    }
  }),
  created() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.date = [this.formatDate(start), this.formatDate(end)]
  },
  methods: {
    formatDate(date) {
      if (date) {
        let dd = date.getDate()
        if (dd < 10) dd = '0' + dd
        let mm = date.getMonth() + 1
        if (mm < 10) mm = '0' + mm
        let yy = date.getFullYear()
        if (yy < 10) yy = '0' + yy
        return dd + '-' + mm + '-' + yy
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
