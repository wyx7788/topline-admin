<template>
<div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#ffffff"
    text-color="#333"
    active-text-color="#ffd04b">
    <h1 class="logo_pic">
      <i class="el-icon-s-unfold"></i>
      <router-link to="/">
        传智播客教育科技股份有限公司
      </router-link>
    </h1>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <img :src="$store.state.user.photo">
        {{$store.state.user.name}}<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
        icon="el-icon-setting"
        @click.native="$router.push({name: 'account'})">账户设置</el-dropdown-item>
        <el-dropdown-item
        icon="el-icon-switch-button"
        @click.native="handleLogOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-menu-item class="fr" index="4"><a href="#" target="_blank">消息</a></el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  name: 'appHeader',
  data () {
    return {
      userInfo: ''
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleLogOut () {
      this.$confirm('确定退出登录吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user_info')
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
*{
  outline: none;
}
a{
  text-decoration: none;
}
.logo_pic{
  float: left;
  height: 60px;
  line-height: 60px;
  i{
    margin: 0 10px;
  }
  a{
    color: #333333;
    font-weight: normal;
  }
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
.el-dropdown{
  float: right;
  margin-right: 15px;
}
.el-dropdown-link{
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  position: relative;
  padding-left: 35px;
  img{
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: -5px;
    left: 0;
  }
}
.fr{
  float: right;
}
</style>
