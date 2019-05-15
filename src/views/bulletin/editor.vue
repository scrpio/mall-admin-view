<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form ref="postForm" :model="postForm" :rules="rules">
          <sticky class-name="sub-navbar">
            <el-button type="success" @click="publishSubmit">发布</el-button>
            <el-button type="warning" @click="draftSubmit">草稿</el-button>
          </sticky>
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
              标题
            </MDinput>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                <el-input v-model="postForm.author" />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.publishTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                <el-rate
                  v-model="postForm.importance"
                  :max="5"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :low-threshold="1"
                  :high-threshold="5"
                  style="margin-top:8px;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
            <el-input :rows="1" v-model="postForm.essential" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
          </el-form-item>
          <!--使用编辑器-->
          <div class="editor-container">
            <Tinymce :height="400" v-model="postForm.content" />
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_bulletin'
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件

const defaultForm = {
  id: undefined,
  title: '',
  author: '',
  essential: '',
  content: '',
  importance: 0,
  status: 0,
  publishTime: undefined
}

export default {
  name: 'Editor',
  components: { Tinymce, MDinput, Sticky },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入详细内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.essential.length
    }
  },
  created() {
    var id = this.$route.params.id
    if (id !== null) {
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  mounted() {
    // 初始化
  },
  methods: {
    fetchData(id) {
      API.getArticle(id).then(response => {
        this.postForm = response
      }).catch(() => {})
    },
    addSubmit(params) {
      var that = this
      API.add(params).then(function(result) {
        if (result.success) {
          that.$message.success({ showClose: true, message: '保存成功', duration: 2000 })
        } else {
          that.$message.error({ showClose: true, message: '保存失败', duration: 2000 })
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    editSubmit(params) {
      var that = this
      API.edit(params).then(function(result) {
        if (result.success) {
          that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
        } else {
          that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    draftSubmit() {
      var that = this
      that.$refs.postForm.validate((valid) => {
        if (valid) {
          var params = Object.assign({}, that.postForm)
          params.status = 0
          params.publishTime = parseInt(that.postForm.publishTime / 1000)
          if (params.id !== null && params.id !== undefined) {
            this.editSubmit(params)
          } else {
            this.addSubmit(params)
          }
        }
      })
    },
    publishSubmit() {
      var that = this
      that.$refs.postForm.validate((valid) => {
        if (valid) {
          var params = Object.assign({}, that.postForm)
          params.status = 1
          params.publishTime = parseInt(that.postForm.publishTime / 1000)
          if (params.id !== null && params.id !== undefined) {
            this.editSubmit(params)
          } else {
            this.addSubmit(params)
          }
        }
      })
    }
  }
}
</script>

<style>
.ql-snow .ql-editor img {
  font-size: 14px;
  color: #595959;
  width: 100px;
  height: 100px;
  line-height: 100px !important;
  text-align: center;
}
.article-textarea textarea {
  padding-right: 40px;
  resize: none;
  border: none;
  border-radius: 0px;
  border-bottom: 1px solid #bfcbd9;
}
.word-counter {
  width: 40px;
  position: absolute;
  right: -10px;
  top: 0px;
}
.postInfo-container-item {
  float: left;
}
.editor-container {
  min-height: 500px;
  margin: 0 0 30px;
  .editor-upload-btn-container {
    text-align: right;
    margin-right: 10px;
    .editor-upload-btn {
      display: inline-block;
    }
  }
}
.sub-navbar {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  transition: 600ms ease position;
  background: #d0d0d0;
  .subtitle {
    font-size: 20px;
    color: #fff;
  }
}
</style>
