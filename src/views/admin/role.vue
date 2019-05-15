<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col v-loading="loading" :span="24" class="warp-main" element-loading-text="拼命加载中">
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
        <el-table v-loading="loading" :data="roles" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" align="center" width="80" sortable />
          <el-table-column prop="name" label="角色名" width="120" sortable />
          <el-table-column prop="permissions" label="权限名称" />
          <el-table-column prop="description" label="备注" width="200" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" title="编辑" size="mini" circle @click="showEditDialog(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" title="删除" size="mini" circle @click="remove(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>

        <!--编辑界面-->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="editForm.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input v-model="editForm.description" :rows="2" type="textarea" />
            </el-form-item>
            <el-form-item label="权限" prop="roleIds">
              <el-tree ref="menuAddTree" :data="perms" :props="treeProps" node-key="menuId" show-checkbox>
                <span slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                </span>
              </el-tree>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit">提交</el-button>
          </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="addForm.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input v-model="addForm.description" :rows="2" type="textarea" />
            </el-form-item>
            <el-form-item label="权限" prop="roleIds">
              <el-tree ref="menuAddTree" :data="perms" :props="treeProps" node-key="menuId" show-checkbox>
                <span slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                </span>
              </el-tree>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
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
    return {
      total: 0,
      page: 1,
      limit: 10,
      ids: [],
      perms: [],
      roles: [],
      loading: false,
      editFormVisible: false,
      addFormVisible: false,
      filters: {
        condition: ''
      },
      treeProps: {
        children: 'children',
        label: 'name'
      },
      formRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      editForm: {
        name: '',
        roleIds: [],
        description: ''
      },
      addForm: {
        name: '',
        roleIds: [],
        description: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
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
      API.roleList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.roles = result.data
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
      this.addFormVisible = true
      this.addForm = {}
      var that = this
      API.permList('').then(function(result) {
        that.perms = result.data
      })
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      var that = this
      var arr = []
      API.getPermsIds(row.id).then(function(res) {
        if (res.data) {
          that.setMenuIds(res.data)
        } else {
          that.setMenuIds(arr)
        }
        that.$nextTick(function() {
          API.permList('').then(function(result) {
            that.perms = result.data
          })
        })
      })
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          params.roleIds = that.getMenuIds()
          API.addRole(params).then(function(result) {
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
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          var params = Object.assign({}, this.editForm)
          params.roleIds = that.getMenuIds()
          API.editRole(params).then(function(result) {
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
        API.removeRole(ids).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 1500 })
            that.search()
          } else {
            that.$message.error({ showClose: true, message: '删除失败', duration: 1500 })
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
    getMenuIds: function() {
      return this.$refs.menuAddTree.getCheckedKeys().concat(this.$refs.menuAddTree.getHalfCheckedKeys())
    },
    setMenuIds: function(keys) {
      this.$refs.menuAddTree.setCheckedKeys(keys, true)
    }
  }
}
</script>
