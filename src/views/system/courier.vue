<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="关键词" style="min-width: 240px;" @keyup.enter.native="handleSearch" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table v-loading="loading" :data="couriers" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" align="center" />
          <el-table-column prop="expressName" label="快递名称" sortable />
          <el-table-column prop="sortOrder" label="排序值" sortable />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button circle size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)" />
              <el-button circle size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>
        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
            <el-form-item label="快递名称" prop="expressName">
              <el-input v-model="addForm.expressName" auto-complete="off" />
            </el-form-item>
            <el-form-item label="排序值" prop="sortOrder">
              <el-input-number v-model="addForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
          </div>
        </el-dialog>
        <!-- 编辑界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
            <el-form-item label="快递名称" prop="expressName">
              <el-input v-model="editForm.expressName" auto-complete="off" />
            </el-form-item>
            <el-form-item label="排序值" prop="sortOrder">
              <el-input-number v-model="editForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit">提交</el-button>
          </div>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_system'

export default {
  data() {
    return {
      couriers: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      editFormVisible: false,
      addFormVisible: false,
      filters: {
        name: ''
      },
      formRules: {
        expressName: [
          { required: true, message: '请输入快递名称', trigger: 'blur' }
        ]
      },
      editForm: {
        expressName: '',
        sortOrder: ''
      },
      addForm: {
        expressName: '',
        sortOrder: ''
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
        name: that.filters.name
      }
      that.loading = true
      API.expressList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.couriers = result.data
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
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.addExpress(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
            }
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
          API.editExpress(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
            }
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
        API.deleteExpress(ids).then(function(result) {
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
