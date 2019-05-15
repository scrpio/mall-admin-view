<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item prop="oldPwd" label="原密码">
            <el-input v-model="form.oldPwd" type="password" style="width: 300px" />
          </el-form-item>
          <el-form-item prop="password" label="新密码">
            <el-input v-model="form.password" type="password" style="width: 300px" />
          </el-form-item>
          <el-form-item prop="confirmPwd" label="确认新密码">
            <el-input v-model="form.confirmPwd" type="password" style="width: 300px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangepwd">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_user'

export default{
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else {
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        oldPwd: '',
        password: '',
        confirmPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChangepwd() {
      var that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = {
            oldPwd: that.form.oldPwd,
            password: that.form.password
          }
          API.changePwd(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
            } else {
              that.$message.error({ showClose: true, message: result.message, duration: 2000 })
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
      })
    }
  }
}
</script>
