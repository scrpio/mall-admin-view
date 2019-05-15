<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="20" class="warp-main">
        <el-form ref="form" :model="editForm" label-width="120px">
          <el-form-item label="网站名称" prop="webName">
            <el-input v-model="editForm.webName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="关键词" prop="keyWord">
            <el-input v-model="editForm.keyWord" auto-complete="off" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editForm.description" auto-complete="off" />
          </el-form-item>
          <el-form-item label="资源路径" prop="sourcePath">
            <el-input v-model="editForm.sourcePath" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上传路径" prop="uploadPath">
            <el-input v-model="editForm.uploadPath" auto-complete="off" />
          </el-form-item>
          <el-form-item label="底部版权信息" prop="copyright">
            <el-input v-model="editForm.copyright" auto-complete="off" />
          </el-form-item>
          <el-form-item label="前台URL" prop="frontUrl">
            <el-input v-model="editForm.frontUrl" auto-complete="off" />
          </el-form-item>
          <el-form-item label="统计代码" prop="countCode">
            <el-input v-model="editForm.countCode" auto-complete="off" />
          </el-form-item>
          <el-form-item label="登录通知开关" prop="hasLogNotice">
            <el-switch v-model="editForm.hasLogNotice" auto-complete="off" />
          </el-form-item>
          <el-form-item label="登录通知" prop="logNotice">
            <el-input v-model="editForm.logNotice" auto-complete="off" />
          </el-form-item>
          <el-form-item label="欢迎通知开关" prop="hasAllNotice">
            <el-switch v-model="editForm.hasAllNotice" auto-complete="off" />
          </el-form-item>
          <el-form-item label="欢迎页通知" prop="allNotice">
            <el-input v-model="editForm.allNotice" auto-complete="off" />
          </el-form-item>
          <el-form-item label="公告" prop="notice">
            <el-input v-model="editForm.notice" auto-complete="off" />
          </el-form-item>
          <el-form-item label="更新日志" prop="updateLog">
            <el-input v-model="editForm.updateLog" auto-complete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_system'

export default {
  data() {
    return {
      editForm: {}
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search: function() {
      var that = this
      API.baseList('').then(function(result) {
        if (result.success) {
          that.editForm = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    editSubmit: function() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          var params = Object.assign({}, that.editForm)
          API.editBase(params).then(function(result) {
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
            }
          }).catch(function(error) {
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    }
  }
}
</script>
