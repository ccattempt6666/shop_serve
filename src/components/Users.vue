<template>
<div class="users">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button @click="searchUsers" slot="append" icon="el-icon-search"></el-button>
  </el-input>
  <el-button type="success" plain class="addUser">添加用户</el-button>
  <!-- 用户信息表格 -->
  <el-table
    :data="userlist">
    <el-table-column
      prop="username"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话">
    </el-table-column>
    <el-table-column
      label="用户状态">
      <template v-slot:default="scope">
        <!-- {{ scope.row.mg_state }} -->
        <el-switch
          @change="changeState(scope.row.id, scope.row.mg_state)"
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template v-slot:default="scope">
        <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
        <el-button @click="delUser(scope.row.id)" size="small" plain type="danger" icon="el-icon-delete"></el-button>
        <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      userlist: []
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    getUsersList () {
      this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        // console.log(res.data)
        const { meta, data } = res
        if (meta.status === 200) {
          // console.log(data)
          this.userlist = data.users
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUsersList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUsersList()
    },
    async delUser (id) {
      // console.log(id)
      // this.$confirm('您确认要删除吗？', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   this.$axios.delete(`users/${id}`).then(res => {
      //     // console.log(res)
      //     const { meta } = res
      //     if (meta.status === 200) {
      //       if (this.userlist.length === 1 && this.pagenum > 1) {
      //         this.pagenum--
      //       }
      //       this.getUsersList()
      //       this.$message.success(meta.msg)
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   }).catch(e => {
      //     console.log(e)
      //     // this.$message.error(meta)
      //   })
      // }).catch(e => {
      //   console.log(e)
      // })
      try {
        await this.$confirm('您确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          if (this.userlist.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUsersList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 搜索功能
    searchUsers () {
      this.pagenum = 1
      this.getUsersList()
    },
    // 更改用户状态
    async changeState (id, flag) {
      // console.log(id, flag)
      // this.$axios.put(`users/${id}/state/${flag}`).then(res => {
      //   const { meta } = res
      //   if (meta.status === 200) {
      //     this.$message.success(meta.msg)
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // }).catch(e => {
      //   console.log(e)
      // })
      try {
        const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    query () {
      this.searchUsers()
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addUser {
    margin-left: 10px;
  }
}
</style>
