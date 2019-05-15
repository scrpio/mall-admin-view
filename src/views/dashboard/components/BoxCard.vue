<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="avatar" class="panThumb"/>
      <mallki class-name="mallki-text"/>
      <div style="padding-top:35px;" class="progress-item">
        <span>Vue</span>
        <el-progress v-if="proVue===100" :percentage="proVue" status="success"/>
        <el-progress v-else :percentage="proVue"/>
      </div>
      <div class="progress-item">
        <span>JavaScript</span>
        <el-progress v-if="proJs===100" :percentage="proJs" status="success"/>
        <el-progress v-else :percentage="proJs"/>
      </div>
      <div class="progress-item">
        <span>Css</span>
        <el-progress v-if="proCss===100" :percentage="proCss" status="success"/>
        <el-progress v-else :percentage="proCss"/>
      </div>
      <div class="progress-item">
        <span>Java</span>
        <el-progress v-if="proJava===100" :percentage="proJava" status="success"/>
        <el-progress v-else :percentage="proJava"/>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

const STORAGE_KEY = 'todos'

export default {
  components: { PanThumb, Mallki },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      proVue: 0,
      proCss: 0,
      proJs: 0,
      proJava: 0,
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'avatar'
    ])
  },
  mounted() {
    this.handleSearch(JSON.parse(localStorage.getItem(STORAGE_KEY)))
  },
  methods: {
    handleSearch(todos) {
      var that = this
      var sumVue = 0
      var doneVue = 0
      var sumCss = 0
      var doneCss = 0
      var sumJs = 0
      var doneJs = 0
      var sumJava = 0
      var doneJava = 0
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].category === 'Vue') {
          sumVue += 1
          if (todos[i].done) {
            doneVue += 1
          }
        } else if (todos[i].category === 'Css') {
          sumCss += 1
          if (todos[i].done) {
            doneCss += 1
          }
        } else if (todos[i].category === 'JavaScript') {
          sumJs += 1
          if (todos[i].done) {
            doneJs += 1
          }
        } else if (todos[i].category === 'Java') {
          sumJava += 1
          if (todos[i].done) {
            doneJava += 1
          }
        }
      }
      if (sumVue > 0) { that.proVue = Math.round(doneVue / sumVue * 100) }
      if (sumCss > 0) { that.proCss = Math.round(doneCss / sumCss * 100) }
      if (sumJs > 0) { that.proJs = Math.round(doneJs / sumJs * 100) }
      if (sumJava > 0) { that.proJava = Math.round(doneJava / sumJava * 100) }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    /deep/ .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
