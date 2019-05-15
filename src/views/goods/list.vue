<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!-- 树形目录 -->
        <el-col :span="6">
          <el-tree :data="goodTree" node-key="id" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <span>{{ data.title }}</span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="18">
          <el-col :span="24" style="margin-bottom: 5px">
            <el-form :inline="true" :model="filters">
              <el-form-item>
                <el-input v-model="filters.condition" placeholder="关键词" style="min-width: 240px;" @keyup.enter.native="handleSearch" />
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
          <el-table v-loading="loading" :data="goods" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" align="center" sortable />
            <el-table-column prop="image" label="缩略图" width="80" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image" class="img" size="medium">
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品名称" sortable />
            <el-table-column prop="sellPoint" label="描述" />
            <el-table-column prop="price" label="单价(¥)" align="center" sortable />
            <el-table-column prop="created" label="创建日期" min-width="160" align="center" sortable />
            <el-table-column prop="updated" label="更新日期" min-width="160" align="center" sortable />
            <el-table-column prop="status" label="发布状态" align="center" sortable>
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.status == 1 ? "正常" : "下架" }}</el-tag>
              </template>
            </el-table-column>
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
        <!-- 添加界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="addFormVisible" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="addForm.title" auto-complete="off" />
            </el-form-item>
            <el-form-item label="描述" prop="sellPoint">
              <el-input v-model="addForm.sellPoint" />
            </el-form-item>
            <el-form-item label="单价(¥)" prop="price">
              <el-input v-model="addForm.price" auto-complete="off" />
            </el-form-item>
            <el-form-item label="库存数量" prop="num">
              <el-input v-model="addForm.num" auto-complete="off" />
            </el-form-item>
            <el-form-item label="限购数量" prop="limitNum">
              <el-input v-model="addForm.limitNum" auto-complete="off" />
            </el-form-item>
            <el-form-item label="缩略图" prop="image">
              <el-upload
                :header="{contentType: 'multipart/form-data'}"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                action="http://127.0.0.1:8888/upload/file"
                class="pic-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="pic">
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
        <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" title="编辑">
          <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="editForm.title" auto-complete="off" />
            </el-form-item>
            <el-form-item label="描述" prop="sellPoint">
              <el-input v-model="editForm.sellPoint" />
            </el-form-item>
            <el-form-item label="单价(¥)" prop="price">
              <el-input v-model="editForm.price" auto-complete="off" />
            </el-form-item>
            <el-form-item label="库存数量" prop="num">
              <el-input v-model="editForm.num" auto-complete="off" />
            </el-form-item>
            <el-form-item label="限购数量" prop="limitNum">
              <el-input v-model="editForm.limitNum" auto-complete="off" />
            </el-form-item>
            <el-form-item label="缩略图" prop="image">
              <el-upload
                :header="{contentType: 'multipart/form-data'}"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                action="http://127.0.0.1:8888/upload/file"
                class="pic-uploader">
                <img v-if="imageUrl" :src="imageUrl" class="pic">
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
import API from '@/api/api_goods'

export default {
  data() {
    return {
      loading: false,
      ids: [],
      goods: [],
      goodTree: [],
      total: 0,
      page: 1,
      limit: 10,
      cid: 560,
      imageUrl: '',
      goodsId: 562379,
      editFormVisible: false,
      addFormVisible: false,
      filters: {
        condition: ''
      },
      formRules: {
        title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        sellPoint: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品单价', trigger: 'blur' }],
        num: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
        limitNum: [{ required: true, message: '请输入限购数量', trigger: 'blur' }],
        image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }]
      },
      editForm: {
        title: '',
        sellPoint: '',
        price: '',
        num: '',
        limitNum: '',
        image: ''
      },
      addForm: {
        title: '',
        sellPoint: '',
        price: '',
        num: '',
        limitNum: '',
        image: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleBeforeUpload(file) {
      var that = this
      var isLt2M = file.size / 1024 / 1024 < 2
      var isFlag = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isFlag) {
        that.$message.error({ showClose: true, message: '所选文件‘ ' + file.name + ' ’格式不正确, 请选择 .jpg 或 .png格式文件.', duration: 2000 })
      }
      if (!isLt2M) {
        that.$message.error({ showClose: true, message: '上传图片大小不能超过 5M.', duration: 2000 })
      }
      return isFlag && isLt2M
    },
    handleSuccess(res, file) {
      if (res.success === true) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.editForm.image = '/static/img/' + res.data
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
    handleSearch() {
      this.total = 0
      this.page = 1
      this.getGoodsTree()
      this.search()
    },
    getGoodsTree() {
      var that = this
      API.goodsTree().then(function(result) {
        that.goodTree = result
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit,
        cid: that.cid,
        search: that.filters.condition
      }
      that.loading = true
      API.itemList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.goods = result.data
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
    handleNodeClick(goodTree) {
      this.goodsId = goodTree.id
      this.cid = goodTree.id
      this.search()
    },
    showAddDialog: function() {
      this.addFormVisible = true
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.imageUrl = row.image
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.addGoods(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
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
    editSubmit: function() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, that.editForm)
          API.editGoods(params).then(function(result) {
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
        API.removeGoods(ids).then(function(result) {
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
