<template>
  <div class="dashboard-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!-- hearder -->
        <panel-group/>
        <!-- 图表 -->
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :lg="16">
            <el-card style="margin-bottom: 20px">
              <div slot="header">
                <el-button type="text" @click="getChartData(0)">本周</el-button>
                <el-button type="text" @click="getChartData(1)">本月</el-button>
                <el-button type="text" @click="getChartData(2)">全年</el-button>
                <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" @change="getChartData(-1)"/>
              </div>
              <line-chart :chart-data="chartData"/>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <info-board/>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <bar-chart/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <pie-chart/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <radar-chart/>
            </div>
          </el-col>
        </el-row>
        <!-- footer -->
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :lg="10">
            <extra-table/>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <todo-list/>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <box-card/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_chart'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import RadarChart from './components/RadarChart'
import InfoBoard from './components/InfoBoard'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import ExtraTable from './components/ExtraTable'
import {
  timeFormat,
  // getFirstDayOfWeek,
  // getLastDayOfWeek,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getFirstDayOfYear,
  getLastDayOfYear
} from '@/utils'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    BarChart,
    PieChart,
    RadarChart,
    ExtraTable,
    InfoBoard,
    TodoList,
    BoxCard
  },
  data() {
    return {
      dateRange: [],
      newsData: [],
      chartData: {}
    }
  },
  mounted() {
    this.getChartData(0)
  },
  methods: {
    getChartData(index) {
      var that = this
      var type, startDate, endDate, params
      if (index === -1) {
        type = 0
        startDate = timeFormat(that.dateRange[0])
        endDate = timeFormat(that.dateRange[1])
      } else if (index === 0) {
        type = 0
        startDate = '2019-03-04 00:00:00' // getFirstDayOfWeek()
        endDate = '2019-03-10 23:59:59' // getLastDayOfWeek()
      } else if (index === 1) {
        type = 0
        startDate = getFirstDayOfMonth()
        endDate = getLastDayOfMonth()
      } else if (index === 2) {
        type = 1
        startDate = getFirstDayOfYear()
        endDate = getLastDayOfYear()
      }
      params = {
        type: type,
        year: new Date().getFullYear(),
        startTime: startDate,
        endTime: endDate
      }
      API.chartOrder(params).then(function(result) {
        if (result.success) {
          that.chartData = result.data
        } else {
          that.$message.error({ showClose: true, message: result.message, duration: 2000 })
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px;
    margin-bottom: 20px;
  }
  .el-button {
    padding: 5px;
  }
}
</style>
