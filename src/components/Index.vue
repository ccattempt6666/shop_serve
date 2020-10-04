<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="图片加载失败">
      </div>
      <div class="title">
        <h2>电商后台管理系统</h2>
      </div>
      <div class="logout">
        欢迎光临~ <a href="javascript:;" @click="exit">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          :default-active="defaultActive"
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="menu.path" v-for="menu in navList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item :index="menuitem.path" v-for="menuitem in menu.children" :key="menuitem.id">
              <i class="el-icon-menu"></i>
              <span>{{ menuitem.authName }}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      navList: []
    }
  },
  async created () {
    try {
      // 获取左侧列表清单
      const { meta, data } = await this.$axios.get('menus')
      if (meta.status === 200) {
        this.navList = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  },
  methods: {
    exit () {
      this.$confirm('您确认要退出吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('login')
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    display: flex;
    background-color: #d8d8d8;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px 0;
      }
    }
    .title {
      flex: 1;
      h2 {
        height: 60px;
        line-height: 60px;
        font-weight: 700;
        text-align: center;
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border: 0;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
