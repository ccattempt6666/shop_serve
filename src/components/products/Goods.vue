<template>
<div class="goods">
  <!-- 添加商品 -->
  <el-button @click="showAddPage" type="success" plain>添加商品</el-button>
  <!-- 商品列表 -->
  <el-table
  :data="goodList">
    <el-table-column label="#" type="index" :index="indexSet"></el-table-column>
    <el-table-column prop="goods_name" label="商品名称"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
    <el-table-column label="创建时间">
      <template v-slot:default="{ row }">
        {{ row.add_time | dateFomate }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button icon="el-icon-edit" type="success" plain size="small"></el-button>
      <el-button icon="el-icon-delete" type="danger" plain size="small"></el-button>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="goodParams.pagenum"
    :page-sizes="[5, 10, 15, 20]"
    :page-size="goodParams.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      goodParams: {
        Pnp: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [],
      total: 0
    }
  },
  created () {
    // 渲染商品数据
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList () {
      try {
        const { meta, data } = await this.$axios.get('goods', {
          params: this.goodParams
        })
        if (meta.status === 200) {
          this.goodList = data.goods
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分页
    handleSizeChange (val) {
      this.goodParams.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.goodParams.pagenum = val
      this.getGoodsList()
    },
    // 添加商品
    showAddPage () {
      // 跳转到商品添加页
      this.$router.push({ name: 'goods_add' })
    },
    // 设置商品索引号
    indexSet (i) {
      return (this.goodParams.pagenum - 1) * this.goodParams.pagesize + i + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  .el-table {
    margin: 10px 0;
  }
}
</style>
