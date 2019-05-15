<template>
  <div class="app-container">
    <el-row class="wrap">
      <el-col :span="24" class="wrap-main" style="margin-bottom: 22px">
        <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
      </el-col>
      <el-table v-loading="loading" :data="logs" border stripe highlight-current-row style="width: 100%" @selection-change="selsChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" />
        <el-table-column label="日志名称" prop="name" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="请求路径" prop="url" />
        <el-table-column label="请求类型" prop="requestType" />
        <el-table-column label="请求参数" prop="requestParam" />
        <el-table-column label="登录用户" prop="user" />
        <el-table-column label="IP位置" prop="ipInfo" />
        <el-table-column label="耗时(毫秒)" prop="time" />
        <el-table-column label="创建时间" prop="createDate" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="remove(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right" @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_system'

export default {
  data() {
    return {
      logs: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    selsChange: function(sels) {
      for (var i = 0; i < sels.length; i++) {
        this.ids[i] = sels[i].id
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit
      }
      that.loading = true
      API.logList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.logs = result.data
          that.total = result.recordsTotal
        }
      }, function(err) {
        that.loading = false
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    remove: function(params) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.deleteLog(params).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 2000 })
            that.search()
          }
        }, function(err) {
          that.loading = false
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }).catch(function(error) {
          that.loading = false
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      }).catch(() => {})
    }
  }
}
</script>
