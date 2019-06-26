<template>
<div class="warping">
  <el-container>
    <el-aside width="200px">
      <appAside></appAside>
    </el-aside>
    <el-container>
      <el-header>
        <appHeader></appHeader>
      </el-header>
      <el-main>
        <!-- 嵌套路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>

</template>

<script>
import appAside from './components/appAside'
import appHeader from './components/appHeader'

export default {
  name: 'layout',
  components: {
    appHeader,
    appAside
  },
  data () {
    return {}
  }
}
</script>

<style lang='less' scoped>
.warping {
  height: 100%;
}
.el-container {
  height: 100%;
  .el-aside{
    background:#2d2f32
  }
  .el-header{
    padding: 0;
  }
  .el-main{
    background: #f5f5f5;
    padding: 10px;
  }
}
</style>
