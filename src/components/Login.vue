<template>
<div class="login">
  <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
    <img class="logo" src="../assets/avatar.jpg" alt="加载失败">
    <el-form-item prop="username" label="用户名：">
      <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码：">
      <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button class="resetBtn" @click="reset">重置</el-button>
    </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名必须在3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码必须在6-12位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate((res) => {
        if (!res) return
        console.log('发送ajax')
        // axios({
        // method: 'post',
        // url: 'http://localhost:8888/api/private/v1/login',
        // data: this.form
        // }).then(res => {
        // console.log(res)
        // const { meta } = res.data
        // if (meta.status === 200) {
        // console.log(meta.msg)
        // } else {
        // console.log(meta.msg)
        // }
        // })
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            // console.log(meta.msg)
            // this.$message(meta.msg)
            // this.$message.success(meta.msg)
            this.$message({
              type: 'success',
              message: meta.msg,
              duration: 1000
            })
            // this.$router.push('/index')
            this.$router.push({ name: 'index' })
          } else {
            // console.log(meta.msg)
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  overflow: hidden;
  height: 100%;
  background: #2d432d;
  .el-form {
    position: relative;
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: #fff;
    border-radius: 20px;
    .logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -100px;
      width: 150px;
      height: 150px;
      border: 5px solid #fff;
      border-radius: 50%;
    }
    .resetBtn {
      margin-left: 100px;
    }
  }
}
</style>
