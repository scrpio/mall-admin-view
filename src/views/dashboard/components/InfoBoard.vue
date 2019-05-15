<template>
  <el-tabs type="border-card" stretch style="margin-bottom: 20px;height: 405px;">
    <el-tab-pane label="公告">
      <ul class="item-list">
        <li v-for="(item, index) in newsData" :key="item.id">
          <el-button type="text" @click="jumpTo(item.id)">
            <span>{{ index+1 }}.</span>
            {{ item.title }}
          </el-button>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="最新活动" />
  </el-tabs>
</template>

<script>
import API from '@/api/api_bulletin'

export default {
  data() {
    return {
      page: 1,
      limit: 10,
      newsData: []
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    getArticle: function() {
      var that = this
      var params = {
        page: that.page,
        limit: that.limit
      }

      API.findList(params).then(function(result) {
        if (result.success) {
          that.newsData = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    jumpTo(id) {
      this.$router.push({
        path: '/bulletin/article',
        name: 'Article',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-list {
  margin: 25px 0 0;
  padding: 0;
  list-style: none;
}
.item-list li {
  zoom: 1;
  margin-top: 8px;
  display: flex;
  align-items: center;
}
.item-list li span {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  margin-right: 5px;
  height: 8px;
  line-height: 8px;
  width: 20px;
  text-align: center;
}
</style>
