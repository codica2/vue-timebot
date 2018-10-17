<template lang="pug">
  highcharts(
  :style="{height: height}"
  :options="{title: {text: 'Projects'}, series: series,legend: legend, tooltip: tooltip, plotOptions: plotOptions, chart: chart, xAxis: { categories: xAxisData }}")
</template>

<script>
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        padding: 3,
        itemMarginTop: 5,
        itemMarginBottom: 5
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
