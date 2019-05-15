<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog(0,-1)">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
      <!--菜单表格-->
      <el-col :span="24" class="warp-main">
        <tree-table v-loading="loading" :data="menudata" :columns="columns" border highlight-current-row style="width: 100%;">
          <el-table-column v-if="false" label="ID" prop="menuId" />
          <el-table-column v-if="false" label="父节点" prop="parentId" />
          <el-table-column label="路径" prop="url" />
          <el-table-column label="权限" prop="perms" />
          <el-table-column label="图标" prop="icon" />
          <el-table-column label="排序" prop="orderNum" align="center" width="80" />
          <el-table-column label="类型" prop="type" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0">目录</el-tag>
              <el-tag v-if="scope.row.type == 1">菜单</el-tag>
              <el-tag v-if="scope.row.type == 2">操作</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="叶节点" prop="leaf" align="center" width="80">
            <template slot-scope="scope">
              <el-tag :type="scope.row.leaf?'success':'danger'">{{ scope.row.leaf ? "是" : "否" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="component" prop="component" align="center" width="80" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button circle size="mini" type="primary" title="添加" icon="el-icon-plus" @click="showAddDialog(scope.row.menuId,scope.row.type)" />
              <el-button circle size="mini" type="primary" title="编辑" icon="el-icon-edit" @click="showEditDialog(scope.row)" />
              <el-button circle size="mini" type="danger" title="删除" icon="el-icon-delete" @click="remove(scope.row.menuId)" />
            </template>
          </el-table-column>
        </tree-table>
        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="编辑">
          <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="addForm.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">操作</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="路径" prop="url">
              <el-input v-model="addForm.url" auto-complete="off" />
            </el-form-item>
            <el-form-item label="权限" prop="perms">
              <el-input v-model="addForm.perms" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="addForm.icon" auto-complete="off" />
            </el-form-item>
            <el-form-item label="叶节点" prop="leaf">
              <el-switch v-model="addForm.leaf" auto-complete="off" />
            </el-form-item>
            <el-form-item label="component" prop="component">
              <el-input v-model="addForm.component" auto-complete="off" />
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="addForm.orderNum" :min="1" :max="100" controls-position="right" />
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
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="editForm.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">操作</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="路径" prop="url">
              <el-input v-model="editForm.url" auto-complete="off" />
            </el-form-item>
            <el-form-item label="路径" prop="perms">
              <el-input v-model="editForm.perms" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="editForm.icon" auto-complete="off" />
            </el-form-item>
            <el-form-item label="叶节点" prop="leaf">
              <el-switch v-model="editForm.leaf" auto-complete="off" />
            </el-form-item>
            <el-form-item label="component" prop="component">
              <el-input v-model="editForm.component" auto-complete="off" />
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="editForm.orderNum" :min="1" :max="100" controls-position="right" />
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
import treeTable from '@/components/TreeTable'
import API from '@/api/api_user'

export default {
  components: { treeTable },
  data() {
    return {
      loading: false,
      menudata: [],
      permsItems: [
        { key: 'get', value: 'get' },
        { key: 'post', value: 'post' },
        { key: 'put', value: 'put' },
        { key: 'delete', value: 'delete' }
      ],
      columns: [
        {
          text: '名称',
          value: 'name',
          width: 200
        }
      ],
      editFormVisible: false,
      addFormVisible: false,
      formRules: {},
      editForm: {
        menuId: '',
        parentId: '',
        name: '',
        url: '',
        perms: '',
        icon: '',
        orderNum: '',
        type: '',
        leaf: '',
        component: '',
        created: ''
      },
      addForm: {
        parentId: '',
        name: '',
        url: '',
        perms: '',
        icon: '',
        orderNum: '',
        type: '',
        leaf: '',
        component: ''
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search: function() {
      var that = this
      API.permList().then(function(result) {
        if (result.success) {
          that.menudata = result.data
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
    showAddDialog: function(parentId, parentType) {
      if (parentType !== 2) {
        this.addForm.type = parentType + 1
      } else {
        this.addForm.type = parentType
      }
      this.addForm.parentId = parentId
      this.addFormVisible = true
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 新增
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.addPerm(params).then(function(result) {
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
          var params = {
            menuId: that.editForm.menuId,
            parentId: that.editForm.parentId,
            name: that.editForm.name,
            url: that.editForm.url,
            perms: that.editForm.perms,
            icon: that.editForm.icon,
            orderNum: that.editForm.orderNum,
            type: that.editForm.type,
            leaf: that.editForm.leaf,
            component: that.editForm.component,
            created: that.editForm.created
          }
          API.editPerm(params).then(function(result) {
            if (result.success) {
              that.loading = false
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
    remove: function(id) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.removePerm(id).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 1500 })
            that.search()
          } else {
            that.$message.error({ showClose: true, message: '删除失败', duration: 2000 })
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
