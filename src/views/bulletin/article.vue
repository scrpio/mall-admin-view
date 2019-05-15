<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" class="warp-main content">
        <h2>{{ title }}</h2>
        <div class="article-info">
          <span>{{ author }}</span>
          <span><i class="fa fa-clock-o" />{{ publishTime }}</span>
          <span><i class="fa fa-eye" />浏览98</span>
        </div>
        <div class="content-summary"><em>摘要：</em>{{ essential }}</div>
        <div class="ql-editor" v-html="content" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_bulletin'
export default {
  name: 'Article',
  data() {
    return {
      id: '',
      title: '',
      author: '',
      essential: '',
      content: '',
      publishTime: ''
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    '$route': 'getParams'
  },
  created() {
    this.getParams()
  },
  mounted() {
    var that = this
    API.getArticle(this.id).then(function(result) {
      that.title = result.title
      that.author = result.author
      that.essential = result.essential
      that.content = result.content
      that.publishTime = result.publishTime
    }).catch(() => {})
  },
  methods: {
    getParams() {
      var routerParams = this.$route.params.id
      this.id = routerParams
    }
  }
}
</script>

<style>
.content {
  text-align: center;
}
.content-summary {
  background: #f9f9f9;
  font-size: 12px;
  color: #73777a;
  line-height: 24px;
  letter-spacing: 0;
  text-align: left;
  padding: 20px 32px;
  margin-bottom: 32px;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
.content-summary em {
  color: #373d41;
  font-weight: 700;
}
.article-info {
  color: #73777a;
  font-size: 12px;
  line-height: 40px;
}
.article-info span {
  margin-right: 10px;
}
</style>
