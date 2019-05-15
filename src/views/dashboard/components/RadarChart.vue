<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import {
  debounce
  // getFirstDayOfWeek,
  // getLastDayOfWeek
} from '@/utils'
import API from '@/api/api_chart'

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
      var params = {
        startTime: '2019-03-04 00:00:00', // getFirstDayOfWeek()
        endTime: '2019-03-10 23:59:59' // getLastDayOfWeek()
      }
      API.chartPie(params).then(function(result) {
        if (result.success) {
          if (result.data.seriesData.length !== 0) {
            that.initChart(result.data.seriesData)
          }
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    initChart(seriesData) {
      var legend = []
      var yData = []
      for (var i = 0; i < seriesData.length; i++) {
        legend.push({ text: seriesData[i].name, max: 10000 })
        yData.push(seriesData[i].value)
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '雷达图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '50%'],
          indicator: [
            { text: '外观', max: 100 },
            { text: '拍照', max: 100 },
            { text: '系统', max: 100 },
            { text: '性能', max: 100 },
            { text: '屏幕', max: 100 }
          ] // legend
        },
        series: [{
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: [
            {
              name: '销售',
              value: [85, 90, 90, 95, 95] // yData
            }
          ]
        }]
      })
    }
  }
}
</script>
