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
  <el-button type="success" plain class="addUser" @click="showUserDialog">添加用户</el-button>
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
      label="手机">
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
        <el-button @click="showEditDialog(scope.row)" size="small" plain type="primary" icon="el-icon-edit"></el-button>
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
  <!-- 添加用户 -->
  <el-dialog
    @close="closeDialog"
    title="添加用户"
    :visible.sync="dialogVisible"
    width="40%">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 修改用户 -->
  <el-dialog
    @close="closeDialog"
    title="修改用户"
    :visible.sync="editVisible"
    width="40%">
    <el-form ref="edit_form" :rules="rules" :model="editForm" label-width="80px">
      <el-form-item label="用户名">
        <el-tag type="info">{{ editForm.username }}</el-tag>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser(editForm)">确 定</el-button>
    </span>
  </el-dialog>
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
      userlist: [],
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        mobile: { pattern: /^1[1-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
      }
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
    },
    showUserDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      // this.$refs.form.resetFields()
    },
    async addUser () {
      this.dialogVisible = false
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        this.$refs.form.resetFields()
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getUsersList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (item) {
      this.editVisible = true
      this.editForm = item
    },
    async editUser (editForm) {
      this.editVisible = false
      try {
        await this.$refs.edit_form.validate()
        const { meta } = await this.$axios.put(`users/${editForm.id}`, editForm)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUsersList()
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
      this.pagenum = 1
      this.searchUsers()
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addUser {
    margin-left: 10px;
  }
}
</style>
