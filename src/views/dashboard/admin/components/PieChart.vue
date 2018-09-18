<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
      default: '300px'
    },
    labelSector: {
      type: String,
      default: ''
    },
    color: {
      type: Array,
      default: () => { return [] }
    },
    legend: {
      type: Object,
      default: () => { return undefined }
    },
    payloadData: {
      type: Array,
      default: () => [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ]
    },
    title: {
      type: Object,
      default: () => {
        return {
          text: '',
          subtext: ''
        }
      }
    },
    legendData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: this.title.text,
          subtext: this.title.subtext,
          x: 'center'
        },
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: this.legend,
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            // roseType: 'radius',
            radius: [0, '60%'],
            center: ['50%', '50%'],
            data: this.payloadData,
            animationEasing: 'cubicInOut',
            animationDuration: 1600,
            label: {
              normal: {
                position: this.labelSector,
                distance: 0,
                backgroundColor: '#eee',
                borderColor: '#555',
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
                fontSize: 18,
                color: '#000'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
