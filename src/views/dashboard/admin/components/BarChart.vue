<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { mapGetters } from 'vuex'
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
    legend : {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {
    xAxisData() {
      // this.initChart()
    },
    series() {
      this.initChart()
    },
    legend() {
      this.initChart()
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
    window.addEventListener('scroll', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    window.removeEventListener('scroll', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      console.log(this.legend)
      console.log(this.sidebar)
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          padding: [0, 0, 125, 0],
          data: this.legend.data
        },
        xAxis: [{
          type: 'value'
        }],
        yAxis: [
          {
            type: 'category',
            data: this.xAxisData
          }
        ],
        series: this.series
      })
    }
  }
}
</script>
