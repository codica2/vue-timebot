<template lang="pug">
  highcharts(
  style="height: height"
  :options="{series: series, tooltip: tooltip, plotOptions: plotOptions, chart: chart, xAxis: { categories: xAxisData }}")
</template>

<script>
import variablesPie from 'highcharts/modules/variable-pie'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '800px'
    },
    series: {
      type: Array,
      default: () => []
    },
    xAxisData: {
      type: Array,
      default: () => []
    },
    legend: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: {
        type: 'bar',
        marginLeft: 125,
        marginBottom: 90
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          stacking: 'normal'
        }
      }
    }
  }
}
</script>
