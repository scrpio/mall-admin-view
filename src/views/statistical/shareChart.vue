<template>
  <div class="chart-container">
    <div id="chart" style="height:100%;width:100%;"/>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import API from '@/api/api_chart'

export default {
  data() {
    return {
    }
  },
  mounted() {
    this.getChartData()
  },
  methods: {
    getChartData() {
      var that = this
      var params = {
        year: 2019
      }
      API.chartShare(params).then(function(result) {
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
      var myChart = echarts.init(document.getElementById('chart'))
      var option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: chartData
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            encode: {
              itemName: chartData[0][0],
              value: chartData[0][1],
              tooltip: chartData[0][1]
            }
          }
        ]
      }
      myChart.on('updateAxisPointer', function(event) {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding-top: 30px;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
