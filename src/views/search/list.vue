<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col v-loading="loading" :span="24" class="warp-main" element-loading-text="拼命加载中">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
          <el-button type="primary" icon="el-icon-refresh" @click="handleSearch">一键手动同步索引</el-button>
        </el-col>
        <el-form ref="form" :model="elastic" label-width="100px">
          <el-form-item label="连接状态">
            <el-input v-model="elastic.status" type="text" />
          </el-form-item>
          <el-form-item label="健康状态">
            <el-input v-model="elastic.status" type="text" />
          </el-form-item>
          <el-form-item label="集群名">
            <el-input v-model="elastic.cluster_name" type="text" />
          </el-form-item>
          <el-form-item label="节点数">
            <el-input v-model="elastic.number_of_nodes" type="text" />
          </el-form-item>
          <el-form-item label="文档数">
            <el-input v-model="elastic.count" type="text" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_search'

export default {
  data() {
    return {
      loading: false,
      elastic: {}
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    handleSearch() {
      var that = this
      that.loading = true
      API.importIndex('').then(function(result) {
        that.loading = false
        if (result.success) {
          that.$message.success({ showClose: true, message: '同步索引成功', duration: 2000 })
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
    },
    search: function() {
      var that = this
      that.loading = true
      API.getESInfo('').then(function(result) {
        that.loading = false
        if (result.success) {
          that.elastic = result.data
        }
      }, function(err) {
        that.loading = false
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    }
  }
}
</script>
