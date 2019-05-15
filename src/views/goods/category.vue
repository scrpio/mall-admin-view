<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="margin-bottom: 22px;">
          <el-button type="danger" icon="el-icon-delete" @click="remove(id)">删除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
        </el-col>

        <el-col v-loading="loading" :span="6" element-loading-text="拼命加载中">
          <el-tree :data="goodTree" node-key="id" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
            </span>
          </el-tree>
        </el-col>

        <el-col :span="18">
          <el-form ref="form" :model="editForm" label-width="120px">
            <el-form-item label="ID" style="display: none">
              <el-input v-model="editForm.id" />
            </el-form-item>
            <el-form-item label="分类名称">
              <el-input v-model="editForm.title" />
            </el-form-item>
            <el-form-item label="是否为父节点">
              <el-switch v-model="editForm.isParent" />
            </el-form-item>
            <el-form-item label="排序优先值">
              <el-input v-model="editForm.limitNum" />
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="editForm.status" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native="handleSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
            <el-form-item label="分类名称">
              <el-input v-model="editForm.title" />
            </el-form-item>
            <el-form-item label="是否为父节点">
              <el-switch v-model="editForm.isParent" />
            </el-form-item>
            <el-form-item label="排序优先值">
              <el-input v-model="editForm.limitNum" />
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="editForm.status" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" />
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
import API from '@/api/api_goods'

export default{
  data() {
    return {
      loading: false,
      editForm: {},
      goodTree: [],
      id: '',
      addFormVisible: false,
      addFormRules: {
        title: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      addForm: {
        title: '',
        type: '',
        isParent: '',
        limitNum: '',
        status: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.handleGoodsTree()
  },
  methods: {
    showAddDialog: function() {
      this.addFormVisible = true
    },
    handleGoodsTree() {
      var that = this
      API.goodsTree().then(function(result) {
        that.goodTree = result
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    handleNodeClick(goodTree) {
      this.editForm = goodTree
      this.id = goodTree.id
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.add(params).then(function(result) {
            if (result.success) {
              that.loading = false
              that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.handleGoodsTree()
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
    handleSubmit: function() {
      var that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          var params = Object.assign({}, this.editForm)
          API.editCategory(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.$refs['editForm'].resetFields()
              that.handleGoodsTree()
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
        API.removeCategory(id).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 2000 })
            that.handleGoodsTree()
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
