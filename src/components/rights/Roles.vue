<template>
<div class="roles">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
  <el-button @click="showAddDialog" class="addrole" type="success" plain>添加角色</el-button>
  <el-table :data="rolesList">
    <el-table-column type="expand">
      <template v-slot:default="{ row }">
        <p v-if="row.children.length === 0">暂无权限</p>
        <el-row class="l-1" v-for="l_1 in row.children" :key="l_1.id">
          <el-col :span="4">
            <el-tag @close="removeRight(row, l_1.id)" closable>{{ l_1.authName }}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <el-row class="l-2" v-for="l_2 in l_1.children" :key="l_2.key">
              <el-col :span="4">
                <el-tag @close="removeRight(row, l_2.id)" closable type="success">{{ l_2.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-tag @close="removeRight(row, l_3.id)" closable class="l-3" type="danger" v-for="l_3 in l_2.children" :key="l_3.key">{{ l_3.authName }}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作">
      <template v-slot:default="{ row }">
        <el-button @click="showEditDialog(row)" size="small" icon="el-icon-edit" plain type="primary"></el-button>
        <el-button @click="delRole(row.id)" size="small" icon="el-icon-delete" plain type="danger"></el-button>
        <el-button @click="showDissgnDialog(row)" size="small" icon="el-icon-check" plain type="success">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分配角色 -->
  <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="40%">
    <el-tree
    node-key="id"
    ref="tree"
    default-expand-all
    show-checkbox
    :data="data"
    :props="defaultProps"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="assignRight" type="primary">分 配</el-button>
    </span>
  </el-dialog>
  <!-- 添加角色(修改角色) -->
  <el-dialog
    @close="save"
    :title="title"
    :visible.sync="addVisible"
    width="40%">
    <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="form.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button @click="addRole" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      addVisible: false,
      // 角色Id
      roleId: '',
      title: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: ['blur', 'change'] }],
        roleDesc: [{ required: true, message: '请填写角色描述', trigger: ['blur', 'change'] }]
      },
      form: {
        roleName: '',
        roleDesc: '',
        id: ''
      }
    }
  },
  async created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      try {
        const { meta, data } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.rolesList = data
        }
      } catch (e) {
        console.log(e)
      }
    },
    async removeRight (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showDissgnDialog (row) {
      this.dialogVisible = true
      this.roleId = row.id
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // this.$refs.tree.setCheckedKeys([103])
        // console.log(row)
        // let ids = []
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRight () {
      this.dialogVisible = false
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.getRoleList()
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('您确认要删除吗？', '提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示添加的对话框
    showAddDialog () {
      this.addVisible = true
      this.title = '添加角色'
    },
    // 显示修改的对话框
    showEditDialog (row) {
      this.addVisible = true
      this.title = '修改角色'
      // 因为 this.$refs.form.resetFields() 回到的是初始状态，也就是第一次点击时input框里面的内容被缓存作为初始值，所以如果先点击修改的对话框的话就会存储有值而不为空，
      // setTimeout(() => {
      //   this.form = { roleName: row.roleName, roleDesc: row.roleDesc, id: row.id }
      // }, 1000)
      this.$nextTick(() => {
        this.form = { roleName: row.roleName, roleDesc: row.roleDesc, id: row.id }
      })
    },
    // 关闭对话框后清空内容
    save () {
      this.$refs.form.resetFields()
    },
    async addRole () {
      this.addVisible = false
      const isAdd = (this.title === '添加角色')
      const method = isAdd ? 'post' : 'put'
      const url = 'roles' + (isAdd ? '' : ('/' + this.form.id))
      const roleName = this.form.roleName
      const roleDesc = this.form.roleDesc
      const { meta } = await this.$axios[method](url, { roleName, roleDesc })
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功！')
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .addrole {
    margin-bottom: 10px;
  }
  .l-1 {
    padding: 10px 0;
    border-bottom: 1px dotted #ccc;
    &:last-child {
      border-bottom: 0;
    }
  }
  .l-2 {
    padding-bottom: 5px;
  }
  .l-3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
