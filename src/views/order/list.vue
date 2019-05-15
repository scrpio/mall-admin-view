<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="margin-bottom: 22px;">
          <el-input :placeholder="$t('excel.placeholder')" v-model="filename" style="width: 240px;" prefix-icon="el-icon-document"/>
          <el-button type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('excel.selectedExport') }}</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
          <el-button type="primary" icon="el-icon-printer">订单打印</el-button>
        </el-col>

        <!--列表-->
        <el-table v-loading="loading" :data="orders" border stripe highlight-current-row style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="orderId" label="订单号" sortable />
          <el-table-column prop="payment" label="支付金额(¥)" align="center" sortable />
          <el-table-column prop="buyerNick" label="用户账号" sortable />
          <el-table-column prop="shippingCode" label="物流号" sortable />
          <el-table-column prop="buyerMessage" label="备注" sortable />
          <el-table-column prop="updateTime" label="创建时间" min-width="105" align="center" sortable />
          <el-table-column prop="paymentTime" label="支付时间" min-width="105" align="center" sortable />
          <el-table-column prop="consignTime" label="关闭时间" min-width="105" align="center" sortable />
          <el-table-column prop="endTime" label="完成时间" min-width="105" align="center" sortable />
          <el-table-column prop="status" label="订单状态" min-width="105" align="center" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==1||scope.row.status==3||scope.row.status==4?'success':scope.row.status==5?'info':'danger'">
                {{ scope.row.status == 0 ? "未付款" : scope.row.status == 1 ? "已付款" : scope.row.status == 2 ? "未发货" : scope.row.status == 3 ? "已发货" : scope.row.status == 4 ? "交易成功" : scope.row.status == 5 ? "交易关闭" : "交易失败" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
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
        <!-- 编辑界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" label-width="80px">
            <el-form-item label="备注" prop="buyerMessage">
              <el-input v-model="editForm.buyerMessage" :row="2" type="textarea" auto-complete="off" />
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
import API from '@/api/api_order'

export default {
  data() {
    return {
      loading: false,
      orders: [],
      total: 0,
      page: 1,
      limit: 10,
      filename: '',
      ids: [],
      multipleSelection: [],
      editFormVisible: false,
      editForm: {
        buyerMessage: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    handleSearch() {
      this.total = 0
      this.page = 1
      this.search()
    },
    selsChange: function(sels) {
      this.multipleSelection = sels
      for (var i = 0; i < sels.length; i++) {
        this.ids[i] = sels[i].id
      }
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit
      }
      that.loading = true
      API.findList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.recordsTotal
          that.orders = result.data
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
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit: function() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, that.editForm)
          API.edit(params).then(function(result) {
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
        API.remove(ids).then(function(result) {
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
    },
    handleDownload() {
      var that = this
      if (that.multipleSelection.length) {
        that.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = ['订单号', '支付金额(¥)', '用户账号', '物流号', '备注', '创建时间', '支付时间', '关闭时间', '完成时间', '订单状态']
          var filterVal = ['orderId', 'payment', 'buyerNick', 'shippingCode', 'buyerMessage', 'updateTime', 'paymentTime', 'consignTime', 'endTime', 'status']
          var list = that.multipleSelection
          var data = that.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: that.filename
          })
          that.$refs.multipleTable.clearSelection()
          that.downloadLoading = false
        })
      } else {
        that.$message({
          message: '请至少选择一个项目',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
