<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import API from '@/api/api_chart'
import {
  // getFirstDayOfWeek,
  // getLastDayOfWeek,
  debounce
} from '@/utils'

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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.getChartData()
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
    getChartData() {
      var that = this
      var param = {
        startTime: '2018-12-24 21:27:54', // getFirstDayOfWeek()
        endTime: '2018-12-30 21:27:54' // getLastDayOfWeek()
      }
      API.chartBar(param).then(function(result) {
        if (result.success) {
          that.initChart(result.data)
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    initChart(chartData) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '注册用户数量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        grid: {
          left: '8%',
          right: '5%',
          bottom: 5,
          top: 80,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // chartData.xData
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '注册用户数量',
          type: 'bar',
          barWidth: '60%',
          data: chartData.yData
        }]
      })
    }
  }
}
</script>
