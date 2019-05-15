<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="margin-bottom: 22px;">
          <el-button type="primary">删除</el-button>
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </el-col>

        <el-col v-loading="loading" :span="6" element-loading-text="拼命加载中">
          <el-tree :data="panelTree" node-key="id" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
            </span>
          </el-tree>
        </el-col>

        <el-col :span="12">
          <el-form ref="form" :model="editForm" label-width="120px">
            <el-form-item label="ID" style="display: none">
              <el-input v-model="editForm.id" />
            </el-form-item>
            <el-form-item label="板块名称">
              <el-input v-model="editForm.title" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="editForm.value" placeholder="请选择类型">
                <el-option label="轮播图" value="0" />
                <el-option label="板块种类一" value="1" />
                <el-option label="板块种类二" value="2" />
                <el-option label="板块种类三" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序优先值">
              <el-input-number v-model="editForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item label="最大容纳内容数">
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
        <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false" title="新增">
          <el-form ref="addForm" :model="addForm" label-width="120px">
            <el-form-item label="板块名称" prop="title">
              <el-input v-model="addForm.title" auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择类型">
                <el-option label="轮播图" value="0" />
                <el-option label="板块种类一" value="1" />
                <el-option label="板块种类二" value="2" />
                <el-option label="板块种类三" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序优先值" prop="sortOrder">
              <el-input-number v-model="addForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item label="最大容纳内容数" prop="limitNum">
              <el-input v-model="addForm.limitNum" auto-complete="off" />
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
              <el-switch v-model="addForm.status" auto-complete="off" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" type="textarea" auto-complete="off" />
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
import API from '@/api/api_shop'

export default{
  data() {
    return {
      panelTree: [],
      loading: false,
      addFormVisible: false,
      editForm: {
        title: '',
        type: '',
        sortOrder: '',
        limitNum: '',
        status: '',
        remark: ''
      },
      addForm: {
        title: '',
        type: '0',
        sortOrder: '',
        limitNum: '',
        status: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.handlePanelTree()
  },
  methods: {
    showAddDialog: function() {
      this.addFormVisible = true
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.addPanel(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '添加成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '添加失败', duration: 2000 })
            }
          }).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    handlePanelTree() {
      var that = this
      this.loading = true
      API.panelTree().then(function(result) {
        that.loading = false
        that.panelTree = result
      }).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    handleNodeClick(panelTree) {
      this.editForm = panelTree
    },
    handleSubmit: function() {
      var that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          var params = Object.assign({}, this.editForm)
          API.editPanel(params).then(function(result) {
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
    }
  }
}
</script>
