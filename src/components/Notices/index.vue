<template>
  <el-dropdown trigger="click" class="international">
    <el-badge :value="total" :max="10" class="international-icon">
      <i class="el-icon-bell" />
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <ul v-for="(item, index) in items" :key="index" class="item-list">
        <li>
          <h4 class="item-title">{{ item.title }}</h4>
          <div class="item-description">{{ item.description }}</div>
        </li>
      </ul>
      <el-dropdown-item>
        <div class="notice-clear">清空通知</div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      items: [{
        title: '你收到了 14 份新周报',
        description: '1 年前'
      }, {
        title: '你推荐的 曲妮妮 已通过第三轮面试',
        description: '1 年前'
      }, {
        title: '这种模板可以区分多种通知类型',
        description: '1 年前'
      }, {
        title: '左侧图标用于区分不同的类型',
        description: '1 年前'
      }, {
        title: '内容不要超过两行字，超出时自动截断',
        description: '1 年前'
      }],
      total: 5
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
.international-icon {
  display: inline;
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
.item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.item-list li {
  position: relative;
  font-size: 14px;
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 1px solid #e8e8e8;
}
.item-title {
  color: rgba(0,0,0,.65);
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.item-description {
  color: rgba(0,0,0,.45);
  font-size: 14px;
  line-height: 22px;
}
.notice-clear{
  height: 46px;
  line-height: 46px;
  text-align: center;
  color: rgba(0,0,0,.65);
  transition: all .3s;
  cursor: pointer;
}
</style>
