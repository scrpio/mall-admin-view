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
        <el-table v-loading="loading" :data="bulletins" border highlight-current-row style="width: 100%;">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" width="80" align="center" sortable />
          <el-table-column prop="author" label="作者" sortable />
          <el-table-column prop="title" label="标题" min-width="120" sortable />
          <el-table-column prop="essential" label="摘要" min-width="300" sortable />
          <el-table-column width="100px" label="重要性">
            <template slot-scope="scope">
              <i v-for="n in +scope.row.importance" :key="n" class="fa fa-star" style="color: #f7ba2a;"/>
            </template>
          </el-table-column>
          <el-table-column width="100px" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status===1?'success':'warning'">{{ scope.row.status===1 ? "已发布" : "草稿" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" min-width="120" align="center" sortable />
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button circle size="mini" type="primary" icon="el-icon-edit" @click="jumpTo(scope.row.id)" />
              <el-button circle size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)" />
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
import API from '@/api/api_bulletin'

export default {
  data() {
    return {
      loading: false,
      bulletins: [],
      total: 0,
      page: 1,
      limit: 10,
      ids: [],
      filters: {
        condition: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    handleSearch() {
      this.total = 0
      this.page = 1
      this.search()
    },
    selsChange: function(sels) {
      for (var i = 0; i < sels.length; i++) {
        this.ids[i] = sels[i].id
      }
    },
    jumpTo(id) {
      this.$router.push({
        path: '/bulletin/editor',
        name: 'editor',
        params: {
          id: id
        }
      })
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit
      }
      that.loading = true
      API.findList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.bulletins = result.data
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
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.remove(ids).then(function(result) {
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
