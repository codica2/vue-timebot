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
        :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('developers')}"
        :legendData="true"
        :payloadData="chartData('developers')")
    el-col(:xs="24" :sm="24" :lg="12")
      .chart-wrapper
        PieChart(
        :legend="{orient: 'horizontal', bottom: '10', data: chartDataNames('departments')}"
        :payloadData="chartData('departments')"
        )
    el-col(:xs="24" :sm="24" :lg="24")
      h2 Tickets in work:
      .chart-container
        .chart-wrapper(v-for="(ticket, ticketIndex) in tickets" :key="ticketIndex")
          PieChart(
            :labelSector="'center'"
            :payloadData="ticket.data"
            :title="ticket.title"
            :color="ticket.color"
          )
</template>

<script>
import PieChart from './components/PieChart'
import { mixDate } from '@/mixins/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardAdmin',
  components: {
    PieChart
  },
  mixins: [mixDate],
  data: () => ({
  }),
  computed: {
    ...mapGetters([
      'chartDataNames',
      'chartData',
      'tickets'
    ])
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
