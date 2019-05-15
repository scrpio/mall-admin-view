<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.condition" placeholder="关键词" style="min-width: 240px;" @keyup.enter.native="handleSearch" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="loading" :data="members" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" align="center" sortable />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column :formatter="formatSex" prop="sex" label="性别" align="center" sortable />
          <el-table-column prop="phone" label="手机" sortable />
          <el-table-column prop="email" label="邮箱" sortable />
          <el-table-column prop="address" label="地址" sortable />
          <el-table-column prop="points" label="积分" align="center" sortable />
          <el-table-column prop="balance" label="余额" align="center" sortable />
          <el-table-column prop="state" label="状态" align="center" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.state?'success':'warning'">
                {{ scope.row.state ? "正常" : "停用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" sortable />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button :type="scope.row.state?'success':'warning'" :icon="scope.row.state?'el-icon-check':'el-icon-minus'" size="mini" circle title="修改状态" @click="updateState(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle title="移除" @click="remove(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_member'

export default {
  data() {
    return {
      members: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      filters: {
        condition: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    // 性别显示转换
    formatSex: function(row, column) {
      return row.sex === '1' ? '男' : row.sex === '0' ? '女' : '未知'
    },
    handleCurrentChange: function(val) {
      this.page = val
      this.search()
    },
    handleSearch: function() {
      this.total = 0
      this.page = 1
      this.search()
    },
    selsChange: function(sels) {
      for (var i = 0, len = sels.length; i < len; i++) {
        this.ids[i] = sels[i].id
      }
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit,
        condition: that.filters.condition
      }
      that.loading = true
      API.findList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.members = result.data
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
    updateState: function(row) {
      var that = this
      that.loading = true
      var params = Object.assign({}, row)
      params.state = (row.state === 0 ? 1 : 0)
      API.changeState(params).then(function(result) {
        if (result.success) {
          that.loading = false
          that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
          that.search()
        } else {
          that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
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
    remove: function(ids) {
      var that = this
      this.$confirm('确认移除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.remove(ids).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '移除成功', duration: 2000 })
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
