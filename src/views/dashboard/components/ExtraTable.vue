<template>
  <el-card class="box-card">
    <div slot="header">
      <span>线上热门搜索</span>
    </div>
    <div id="userSum" style="height:100px;width:100%;"/>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sort" label="排名" width="55" />
      <el-table-column prop="keyWord" label="搜索关键词" />
      <el-table-column prop="userNum" label="用户数" width="90" sortable />
      <el-table-column prop="gain" label="周涨幅" width="90" sortable />
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="5" :total="9" layout="prev, pager, next" style="float:right;" @current-change="handleCurrentChange" />
    </el-col>
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  data() {
    return {
      // total: 9,
      page: 1,
      tableData: [{
        sort: 1,
        keyWord: '搜索关键词-1',
        userNum: 2626,
        gain: '25%'
      }, {
        sort: '2',
        keyWord: '搜索关键词-2',
        userNum: 1321,
        gain: '15%'
      }, {
        sort: '3',
        keyWord: '搜索关键词-3',
        userNum: 1265,
        gain: '28%'
      }, {
        sort: '4',
        keyWord: '搜索关键词-4',
        userNum: 1212,
        gain: '93%'
      }, {
        sort: '5',
        keyWord: '搜索关键词-5',
        userNum: 1200,
        gain: '87%'
      }, {
        sort: '6',
        keyWord: '搜索关键词-6',
        userNum: 1321,
        gain: '15%'
      }, {
        sort: '7',
        keyWord: '搜索关键词-7',
        userNum: 1265,
        gain: '28%'
      }, {
        sort: '8',
        keyWord: '搜索关键词-8',
        userNum: 1212,
        gain: '93%'
      }, {
        sort: '9',
        keyWord: '搜索关键词-9',
        userNum: 1200,
        gain: '87%'
      }]
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      // this.search()
    },
    // search: function() {
    //   var that = this
    //   var params = {
    //     page: that.page,
    //     limit: that.limit,
    //     condition: that.filters.condition
    //   }
    //   that.loading = true
    //   API.userList(params).then(function(result) {
    //     that.loading = false
    //     if (result.success) {
    //       that.total = result.recordsTotal
    //       that.users = result.data
    //     }
    //   }, function(err) {
    //     that.loading = false
    //     that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
    //   }).catch(function(error) {
    //     that.loading = false
    //     console.log(error)
    //     that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
    //   })
    // },
    initChart() {
      echarts.init(document.getElementById('userSum')).setOption({
        title: {
          text: '搜索用户数',
          subtext: '123132'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [{
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa'
              },
              areaStyle: {
                color: '#1890ff'
              }
            }
          },
          data: [100, 132, 801, 534, 900, 230, 510]
        }]
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
