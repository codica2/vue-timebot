<template lang="pug">
  div
    el-date-picker(
        v-model="date"
        type="daterange"
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date")
    el-col(:xs="24" :sm="24" :lg="8")
      .chart-wrapper
        PieChart(:legendData="true" :payloadData="[{name: 'Qwerty', value: 100}, {name: 'Lorem', value: 33}]")
    el-col(:xs="24" :sm="24" :lg="8")
      .chart-wrapper
        PieChart(:payloadData="[{name: 'QA 200', value: 200}, {name: 'PM 25', value: 25}, {name: 'Review 100', value: 100}, {name: 'Development', value: 400}]")
      .chart-wrapper
        PieChart(:labelSector="'inner'" :payloadData="[{name: '50', value: 100}]")
</template>

<script>
import PieChart from './components/PieChart'
export default {
  name: 'DashboardAdmin',
  components: {
    PieChart
  },
  data: () => ({
    date: ''
  })
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
