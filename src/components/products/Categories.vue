/* eslint-disable no-tabs */
<template>
  <div class="categories">
    <!-- 添加分类 -->
    <el-button class="addCategories" type="success" plain @click="showCategoriesDialog">添加分类</el-button>
    <!-- 分类列表 -->
    <el-table
    :data="assignList"
    row-key="cat_id"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    >
    <el-table-column label="分类名称" prop="cat_name"></el-table-column>
    <el-table-column label="是否有效">
      <template v-slot:default="{ row }">
        {{ row.cat_deleted ? '否' : '是' }}
      </template>
    </el-table-column>
    <el-table-column label="排序" prop="cat_level"></el-table-column>
    <el-table-column label="操作">
      <template v-slot:default="{ row }">
        <el-button @click="showEditDialog(row)" type="primary" plain size="small" icon="el-icon-edit"></el-button>
        <el-button @click="delCategories(row.cat_id)" type="danger" plain size="small" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 15, 20, 25]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类 -->
    <el-dialog
    @closed="closeDialog"
    title="添加分类"
    :visible.sync="addVisible"
    width="40%">
      <span>
        <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-cascader
            :props="{ checkStrictly: true }"
            clearable
            v-model="form.cat_pid"
            :options="options"></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
    title="编辑分类"
    :visible.sync="editVisible"
    width="40%">
      <span>
        <el-form
        :model="editForm"
        label-width="80px">
          <el-form-item label="分类id">
            <el-tag type="info">{{ editForm.cat_id }}</el-tag>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      assignList: [],
      options: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      loading: true,
      addVisible: false,
      editVisible: false,
      form: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      rules: {
        cat_name: { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
      }
    }
  },
  async created () {
    this.getCategoriesList()
  },
  methods: {
    // 获取分类列表
    async getCategoriesList () {
      try {
        const { meta, data } = await this.$axios.get('categories', {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            type: 3
          }
        })
        if (meta.status === 200) {
          this.assignList = data.result
          this.total = data.total
          this.assignList.forEach((item1, i) => {
            this.options.push({
              label: item1.cat_name,
              value: item1.cat_id,
              children: []
            })
            if (item1.children) {
              item1.children.forEach((item2, j) => {
                this.options[i].children.push({
                  label: item2.cat_name,
                  value: item2.cat_id
                  // children: []
                })
                // if (item2.children) {
                //   item2.children.forEach(item3 => {
                //     this.options[i].children[j].children.push({
                //       label: item3.cat_name,
                //       value: item3.cat_id
                //     })
                //   })
                // }
              })
            }
          })
        } else {
          this.$message.error(meta.msg)
        }
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    // 分页
    handleSizeChange (val) {
      this.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoriesList()
    },
    // 添加分类
    showCategoriesDialog () {
      // 显示分类对话框
      this.addVisible = true
    },
    // 关闭对话框时初始化
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 发送ajax添加分类
    async addCategories () {
      try {
        await this.$refs.form.validate()
        const catLevel = this.form.cat_pid.length
        const catPid = this.form.cat_pid[catLevel - 1] || 0
        const catName = this.form.cat_name
        // console.log(catLevel, catPid, catName, this.form)
        const { meta } = await this.$axios.post('categories', {
          cat_pid: catPid,
          cat_level: catLevel,
          cat_name: catName
        })
        if (meta.status === 201) {
          this.getCategoriesList()
          this.$message.success(meta.msg)
          this.addVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除指定id的分类
    async delCategories (id) {
      try {
        await this.$confirm('您确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`categories/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.assignList.length === 1) {
            this.pagenum--
          }
          this.getCategoriesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑分类
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.cat_id = row.cat_id
      this.editForm.cat_name = row.cat_name
      console.log(row)
    },
    async editCategories () {
      try {
        const { meta } = await this.$axios.put(`categories/${this.editForm.cat_id}`, { cat_name: this.editForm.cat_name })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getCategoriesList()
          this.editVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.categories {
  .addCategories {
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
