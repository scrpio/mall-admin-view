<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!-- 树形目录 -->
        <!-- <el-col :span="6">
          <el-tree :data="panelTree" node-key="id" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
            </span>
          </el-tree>
        </el-col> -->
        <!--列表-->
        <el-col :span="24">
          <el-col :span="24" style="margin-bottom: 5px">
            <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
          </el-col>

          <el-table v-loading="loading" :data="dataList" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="80" align="center" sortable />
            <el-table-column prop="type" label="类型" width="100" align="center">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.type == 0 ? "关联商品" : "其他链接" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="picUrl" label="图片1" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column prop="picUrl2" label="图片2" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl2" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column prop="picUrl3" label="图片3" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl3" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column prop="fullUrl" label="跳转链接" />
            <el-table-column prop="productId" label="商品编号" sortable />
            <el-table-column prop="productName" label="商品名称" sortable />
            <el-table-column prop="sortOrder" label="排序" width="75" align="center" sortable />
            <el-table-column prop="created" label="创建日期" width="105" align="center" sortable />
            <el-table-column prop="updated" label="更新日期" width="105" align="center" sortable />
            <el-table-column label="操作" width="100" align="center">
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
              <el-select v-model="addForm.type" placeholder="请选择类型">
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
            <el-form-item label="轮播图">
              <el-upload
                :limit="3"
                :action="doUpload"
                :with-credentials="true"
                :file-list="fileList"
                :on-exceed="handleExceed"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture-card"
                multiple
                name="pic">
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImageUrl" width="100%">
              </el-dialog>
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
              <el-select v-model="editForm.type" placeholder="请选择类型">
                <el-option :value="0" label="关联商品" />
                <el-option :value="1" label="其他链接" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序优先级" prop="sortOrder">
              <el-input-number v-model="editForm.sortOrder" :min="1" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item label="跳转链接" prop="fullUrl">
              <el-input v-model="editForm.fullUrl" />
            </el-form-item>
            <el-form-item label="选择展示商品" prop="productName">
              <el-input v-model="editForm.productName" auto-complete="off" @focus="showProductDialog" />
            </el-form-item>
            <el-form-item label="所选商品编号" prop="productId">
              <el-input v-model="editForm.productId" :disabled="true" auto-complete="off" />
            </el-form-item>
            <el-form-item label="轮播图">
              <el-upload
                :limit="3"
                :action="doUpload"
                :with-credentials="true"
                :file-list="fileList"
                :on-exceed="handleExceed"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture-card"
                multiple
                name="pic">
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImageUrl" width="100%">
              </el-dialog>
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
      fileList: [],
      dataList: [],
      panelTree: [],
      productList: [],
      picUrl: '',
      picUrl2: '',
      picUrl3: '',
      dialogImageUrl: '',
      doUpload: process.env.API_ROOT + '/upload/file',
      panelName: '活动版块',
      selectId: 7,
      productTotal: 0,
      total: 0,
      page: 1,
      limit: 10,
      loading: false,
      dialogVisible: false,
      productVisible: false,
      addFormVisible: false,
      editFormVisible: false,
      editForm: {
        panelId: '',
        type: '',
        fullUrl: '',
        picUrl: '',
        picUrl2: '',
        picUrl3: '',
        productId: '',
        productName: '',
        sortOrder: ''
      },
      addForm: {
        panelId: '',
        type: '',
        fullUrl: '',
        picUrl: '',
        picUrl2: '',
        picUrl3: '',
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove(file, fileList) {
      this.picUrl = ''
      this.picUrl2 = ''
      this.picUrl3 = ''
      if (fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
          switch (i) {
            case 0:
              this.picUrl = fileList[0].url
              break
            case 1:
              this.picUrl2 = fileList[1].url
              break
            case 2:
              this.picUrl3 = fileList[2].url
              break
            default:
              break
          }
        }
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file, fileList) {
      if (fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
          if (fileList[i].status === 'success') {
            switch (i) {
              case 0:
                this.picUrl = fileList[0].response.data
                break
              case 1:
                this.picUrl2 = fileList[1].response.data
                break
              case 2:
                this.picUrl3 = fileList[2].response.data
                break
              default:
                break
            }
          }
        }
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
      API.bannerTree().then(function(result) {
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
      this.fileList = []
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.fileList = [{ url: row.picUrl }, { url: row.picUrl2 }, { url: row.picUrl3 }]
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          params.panelId = that.selectId
          params.picUrl = that.picUrl
          params.picUrl2 = that.picUrl2
          params.picUrl3 = that.picUrl3
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
          params.panelId = that.selectId
          params.picUrl = that.picUrl
          params.picUrl2 = that.picUrl2
          params.picUrl3 = that.picUrl3
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
