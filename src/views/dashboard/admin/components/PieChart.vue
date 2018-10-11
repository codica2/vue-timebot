<template lang="pug">
  highcharts(
  :style="{height: height, width: width}"
  :options="{title: {text: title}, legend: legend, series: [{name: 'Hours', innerSize: innerSize, data: payloadData}], tooltip: tooltip, plotOptions: plotOptions, chart: chart}")
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
      default: '600px'
    },
    labelSector: {
      type: String,
      default: ''
    },
    innerSize: {
      type: String,
      default: ''
    },
    color: {
      type: Array,
      default: () => { return [] }
    },
    title: {
      type: String,
      default: () => { return '' }
    },
    plotOptions: {
      type: Object,
      default: () => { return {} }
    },
    chart: {
      type: Object,
      default: () => { return {} }
    },
    tooltip: {
      type: Object,
      default: () => { return {} }
    },
    payloadData: {
      type: Array,
      default: () => [
      ]
    },
    legendData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      legend: {
        padding: 3,
        itemMarginTop: 2,
        itemMarginBottom: 2
      }
    }
  }
}
</script>
