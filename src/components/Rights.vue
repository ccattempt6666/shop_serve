<template>
<div class="rights">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
  <el-table
  :data="rightsList">
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径" prop="path"></el-table-column>
    <el-table-column label="层级">
      <template v-slot:default="{ row }">
        <p v-if="row.level==='0'">一级</p>
        <p v-if="row.level==='1'">二级</p>
        <p v-if="row.level==='2'">三级</p>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    try {
      const { meta, data } = await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>
