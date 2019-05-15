<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!-- 树形目录 -->
        <el-col :span="6">
          <el-tree :data="panelTree" node-key="id" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
            </span>
          </el-tree>
        </el-col>
        <!--列表-->
        <el-col :span="18">
          <el-col :span="24" style="margin-bottom: 5px">
            <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
          </el-col>

          <el-table v-loading="loading" :data="dataList" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" align="center" />
            <el-table-column prop="type" label="类型" width="100" align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.type == 0 ? "关联商品" : "其他链接" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="picUrl" label="缩略图" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column prop="fullUrl" label="跳转链接" />
            <el-table-column prop="productId" label="商品编号" sortable />
            <el-table-column prop="productName" label="商品名称" sortable />
            <el-table-column prop="salePrice" label="商品价格(¥)" align="center" sortable />
            <el-table-column prop="sortOrder" label="排序" align="center" sortable />
            <el-table-column prop="created" label="创建日期" min-width="160" align="center" sortable />
            <el-table-column prop="updated" label="更新日期" min-width="160" align="center" sortable />
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button circle size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)" />
                <el-button circle size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>
        <!-- 商品列表对话框 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="productVisible" title="商品列表">
          <el-table :data="productList" border stripe highlight-current-row style="width: 100%;">
            <el-table-column prop="id" label="ID" align="center" />
            <el-table-column prop="title" label="商品名称" sortable />
            <el-table-column prop="sellPoint" label="详细描述" sortable />
            <el-table-column prop="price" label="价格" />
            <el-table-column prop="num" label="数量" sortable />
            <el-table-column prop="limitNum" label="数量上线" sortable />
            <el-table-column prop="image" label="图片" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button circle size="mini" type="primary" icon="el-icon-check" @click="selectProduct(scope.row)" />
              </template>
            </el-table-column>
          </el-table>

          <el-col :span="24" class="toolbar">
            <el-pagination :page-size="10" :total="productTotal" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleProductChange" />
          </el-col>
        </el-dialog>
        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" label-width="120px">
            <el-form-item label="所属板块" prop="panelId">
              <el-input v-model="panelName" value="selectId" disabled auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type">
                <el-option :value="0" label="关联商品" />
                <el-option :value="1" label="其他链接" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序优先级" prop="sortOrder">
              <el-input-number v-model="addForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item label="跳转链接" prop="fullUrl">
              <el-input v-model="addForm.fullUrl" />
            </el-form-item>
            <el-form-item label="选择展示商品" prop="productName">
              <el-input v-model="addForm.productName" auto-complete="off" @focus="showProductDialog" />
            </el-form-item>
            <el-form-item label="所选商品编号" prop="productId">
              <el-input v-model="addForm.productId" :disabled="true" auto-complete="off" />
            </el-form-item>
            <el-form-item label="商品缩略图" prop="picUrl">
              <el-upload
                :with-credentials="true"
                :action="doUpload"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                name="pic"
                class="avatar-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
          </div>
        </el-dialog>
        <!-- 编辑界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" label-width="120px">
            <el-form-item label="所属板块" prop="panelId">
              <el-input v-model="panelName" value="selectId" disabled auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="editForm.type">
                <el-option :value="0" label="关联商品" />
                <el-option :value="1" label="其他链接" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序优先级" prop="sortOrder">
              <el-input-number v-model="editForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item label="选择展示商品" prop="productName">
              <el-input v-model="editForm.productName" auto-complete="off" @focus="showProductDialog" />
            </el-form-item>
            <el-form-item label="所选商品编号" prop="productId">
              <el-input v-model="editForm.productId" :disabled="true" auto-complete="off" />
            </el-form-item>
            <el-form-item label="商品缩略图" prop="picUrl">
              <el-upload
                :with-credentials="true"
                :action="doUpload"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                name="pic"
                class="avatar-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
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
import API from '@/api/api_shop'
import API_GOODS from '@/api/api_goods'

export default{
  data() {
    return {
      ids: [],
      dataList: [],
      panelTree: [],
      productList: [],
      imageUrl: '',
      doUpload: process.env.API_ROOT + '/upload/file',
      selectId: 6,
      panelName: '活动版块',
      productTotal: 0,
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      productVisible: false,
      addFormVisible: false,
      editFormVisible: false,
      editForm: {
        panelId: '',
        type: '',
        picUrl: '',
        productId: '',
        productName: '',
        sortOrder: ''
      },
      addForm: {
        panelId: '',
        type: '',
        picUrl: '',
        productId: '',
        productName: '',
        sortOrder: ''
      }
    }
  },
  mounted() {
    this.getPanelTree()
    this.handleSearch()
  },
  methods: {
    handleBeforeUpload(file) {
      var that = this
      var isJPG = file.type === 'image/jpeg'
      var isGIF = file.type === 'image/gif'
      var isPNG = file.type === 'image/png'
      var isBMP = file.type === 'image/bmp'
      var isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        that.$message.error({ showClose: true, message: '上传图片必须是JPG/GIF/PNG/BMP 格式!', duration: 2000 })
      }
      if (!isLt2M) {
        that.$message.error({ showClose: true, message: '上传图片大小不能超过 2MB!', duration: 2000 })
      }
      return (isJPG || isGIF || isPNG || isBMP) && isLt2M
    },
    handleSuccess(res, file) {
      console.log(file)
      if (res.success) {
        this.imageUrl = file.response.data
      }
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
    handleProductChange(val) {
      this.page = val
      this.getProduct()
    },
    getPanelTree() {
      var that = this
      API.otherTree().then(function(result) {
        that.panelTree = result
        that.selectId = result[0].id
        that.panelName = result[0].title
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
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
        limit: that.limit
      }
      var panelId = that.selectId
      that.loading = true
      API.findList(panelId, params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.dataList = result.data
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
    getProduct: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit
      }
      API_GOODS.findList(params).then(function(result) {
        if (result.success) {
          that.productTotal = result.recordsTotal
          that.productList = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    handleNodeClick(panelTree) {
      this.selectId = panelTree.id
      this.panelName = panelTree.title
      this.handleSearch()
    },
    showProductDialog: function() {
      this.productVisible = true
      this.getProduct()
    },
    selectProduct: function(row) {
      this.productVisible = false
      this.addForm.productId = ''
      this.addForm.productName = ''

      if (this.editFormVisible) {
        this.editForm.productId = row.id
        this.editForm.productName = row.title
      } else if (this.addFormVisible) {
        this.addForm.productId = row.id
        this.addForm.productName = row.title
      }
    },
    showAddDialog: function() {
      this.addFormVisible = true
      this.imageUrl = ''
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.imageUrl = row.picUrl
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          params.picUrl = that.imageUrl
          API.addContent(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '新增失败', duration: 2000 })
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
          params.picUrl = that.imageUrl
          API.editContent(params).then(function(result) {
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
        API.removeContent(ids).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
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

<style>
.pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px !important;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
}
.pic {
  width: 120px;
  height: 120px;
  display: block;
}
.img {
  width: 50%;
  height: 50%;
}
</style>
