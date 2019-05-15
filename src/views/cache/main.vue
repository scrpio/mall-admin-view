<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col v-loading="loading" :span="24" class="warp-main" element-loading-text="拼命加载中">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-button type="primary" icon="el-icon-refresh" @click="refreshIndex">刷新首页缓存</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="refreshRecommend">刷新推荐板块缓存</el-button>
        </el-col>
        <span class="label-item">首页缓存内容:</span>
        <el-input v-model="caches" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" />
        <span class="label-item">推荐板块缓存内容:</span>
        <el-input v-model="recommend" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_cache'

export default {
  data() {
    return {
      loading: false,
      caches: '',
      recommend: ''
    }
  },
  mounted() {
    this.getIndex()
    this.getRecommend()
  },
  methods: {
    refreshIndex: function() {
      var that = this
      that.loading = true
      API.indexUpdate('').then(function(result) {
        that.loading = false
        if (result.success) {
          that.$message.success({ showClose: true, message: '刷新成功', duration: 2000 })
          that.getIndex()
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
    refreshRecommend: function() {
      var that = this
      that.loading = true
      API.recommendUpdate('').then(function(result) {
        that.loading = false
        if (result.success) {
          that.$message.success({ showClose: true, message: '刷新成功', duration: 2000 })
          that.getRecommend()
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
    getIndex: function() {
      var that = this
      API.indexList('').then(function(result) {
        if (result.success) {
          that.caches = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    getRecommend: function() {
      var that = this
      API.recommendList('').then(function(result) {
        if (result.success) {
          that.recommend = result.data
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

<style>
.label-item {
  display: inline-block;
  margin: 20px 0 5px;
}
</style>
