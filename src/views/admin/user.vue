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
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="loading" :data="users" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" align="center" sortable />
          <el-table-column prop="username" label="用户名" sortable />
          <el-table-column :formatter="formatSex" prop="sex" label="性别" align="center" sortable />
          <el-table-column prop="phone" label="手机" sortable />
          <el-table-column prop="email" label="邮箱" sortable />
          <el-table-column v-if="false" prop="roleId" label="角色ID" sortable />
          <el-table-column prop="roleNames" label="角色" sortable />
          <el-table-column prop="description" label="备注" sortable />
          <el-table-column prop="created" label="创建时间" min-width="160" align="center" sortable />
          <el-table-column prop="updated" label="更新时间" min-width="160" align="center" sortable />
          <el-table-column prop="state" label="状态" align="center" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.state?'success':'danger'">{{ scope.row.state ? "正常" : "停用" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle title="编辑" @click="showEditDialog(scope.row)" />
              <el-button :type="scope.row.state?'success':'danger'" :icon="scope.row.state?'el-icon-check':'el-icon-close'" size="mini" circle title="修改状态" @click="updateState(scope.row)" />
              <el-button type="warning" icon="fa fa-key" size="mini" circle title="修改密码" @click="showChangePassDialog(scope.row.id)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle title="删除" @click="remove(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>
        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" auto-complete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input v-model="addForm.confirmPwd" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="addForm.sex">
                <el-radio :label="0">女</el-radio>
                <el-radio :label="1">男</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="addForm.phone" auto-complete="off" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" type="email" />
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="addForm.roleId">
                <el-option v-for="role in roles" :label="role.name" :key="role.id" :value="role.id">
                  {{ role.name }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input v-model="addForm.description" :rows="2" type="textarea" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
          </div>
        </el-dialog>
        <!-- 编辑界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" auto-complete="off" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="editForm.sex">
                <el-radio :label="0">女</el-radio>
                <el-radio :label="1">男</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="editForm.phone" auto-complete="off" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email" type="email" />
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="editForm.roleId">
                <el-option v-for="role in roles" :label="role.name" :key="role.id" :value="role.id">
                  {{ role.name }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input v-model="editForm.description" :rows="2" type="textarea" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit">提交</el-button>
          </div>
        </el-dialog>
        <!-- 修改密码界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="updateFormVisible" title="修改密码">
          <el-form ref="updateForm" :model="updateForm" :rules="updateFormRules" label-width="100px">
            <el-form-item prop="oldPwd" label="原密码">
              <el-input v-model="updateForm.oldPwd" type="password" style="width: 300px;" />
            </el-form-item>
            <el-form-item prop="password" label="新密码">
              <el-input v-model="updateForm.password" type="password" style="width: 300px;" />
            </el-form-item>
            <el-form-item prop="confirmPwd" label="确认新密码">
              <el-input v-model="updateForm.confirmPwd" type="password" style="width: 300px;" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="updateFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="updateSubmit">提交</el-button>
          </div>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_user'

export default {
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
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validateConfirmUpdatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else if (value !== this.updateForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      users: [],
      roles: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 10,
      editFormVisible: false,
      addFormVisible: false,
      updateFormVisible: false,
      filters: {
        condition: ''
      },
      editFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      },
      updateFormRules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmUpdatePass, trigger: 'blur' }
        ]
      },
      editForm: {
        username: '',
        sex: '',
        phone: '',
        email: '',
        roleId: '',
        description: ''
      },
      addForm: {
        username: '',
        password: '',
        sex: '',
        phone: '',
        email: '',
        roleId: '',
        description: ''
      },
      updateForm: {
        id: '',
        oldPwd: '',
        password: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    formatSex: function(row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    selsChange: function(sels) {
      for (var i = 0; i < sels.length; i++) {
        this.ids[i] = sels[i].id
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    handleSearch() {
      this.total = 0
      this.page = 1
      this.search()
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit,
        condition: that.filters.condition
      }
      that.loading = true
      API.userList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.users = result.data
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
    showAddDialog: function() {
      var that = this
      this.addFormVisible = true
      API.getAllRoles().then(function(result) {
        that.roles = result.data
      })
    },
    showEditDialog: function(row) {
      var that = this
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      API.getAllRoles().then(function(result) {
        that.roles = result.data
      })
    },
    showChangePassDialog: function(userId) {
      this.updateFormVisible = true
      this.updateForm.id = userId
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.addUser(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '新增失败', duration: 2000 })
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
    },
    editSubmit: function() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, that.editForm)
          params.roleIds = that.roleIds
          API.editUser(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
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
        }
      })
    },
    remove: function(ids) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.removeUser(ids).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 1500 })
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
    },
    updateState: function(row) {
      var that = this
      var params = {
        id: row.id,
        state: !row.state
      }
      this.$confirm('确认修改ID为' + row.id + '的用户吗？', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.changeState(params).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '状态修改成功', duration: 1500 })
            that.search()
          } else {
            that.$message.error({ showClose: true, message: '状态修改失败', duration: 2000 })
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
    },
    updateSubmit: function() {
      var that = this
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          that.loading = true
          var data = Object.assign({}, that.updateForm)
          API.changePwd(data).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '密码修改成功', duration: 2000 })
              that.$refs['updateForm'].resetFields()
              that.updateFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '密码修改失败', duration: 2000 })
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
