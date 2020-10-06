<template>
<div class="addgoods">
  <el-steps :active="+activeStep" finish-status="success">
    <el-step title="步骤 1" description="基本信息"></el-step>
    <el-step title="步骤 2" description="商品参数"></el-step>
    <el-step title="步骤 3" description="商品图片"></el-step>
    <el-step title="步骤 4" description="商品内容"></el-step>
  </el-steps>
  <el-tabs v-model="activeStep" :before-leave="beforeLeave" :tab-position="tabPosition" @tab-click="handleClick">
    <el-tab-pane name="0" label="基本信息">
      <el-form ref="form" status-icon :rules="rules" :model="goodsMsg" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsMsg.goods_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="goodsMsg.goods_price" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="goodsMsg.goods_weight" placeholder="请输入商品重量"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="goodsMsg.goods_number" placeholder="请输入商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
          clearable
          :props="props"
          v-model="goodsMsg.goods_cat"
          :options="options"
          @change="handleChange"></el-cascader>
        </el-form-item>
        <el-button @click="nextStep" type="primary">下一步</el-button>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="1" label="商品参数">
      <p>数据缺失</p>
      <el-button type="primary"  @click="nextStep">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane name="2" label="商品图片">
      <el-upload
        class="avatar-uploader"
        :action="picURL"
        :headers="headers"
        list-type="picture-card"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <!-- 预览大图 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="大图">
      </el-dialog>
      <el-button  @click="nextStep" type="primary">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane name="3" label="商品内容">
      <quill-editor v-model="goodsMsg.goods_introduce"></quill-editor>
      <el-button @click="addGood" class="addBtn" type="primary">添加</el-button>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  data () {
    return {
      activeStep: '0',
      tabPosition: 'left',
      goodsMsg: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      manyTableData: [],
      rules: {
        goods_name: { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] },
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: ['blur', 'change'] },
          { type: 'number', message: '请输入一个数字', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: ['blur', 'change'] },
          { type: 'number', message: '请输入一个数字', trigger: ['blur', 'change'] }
        ],
        goods_number: [
          { required: true, message: '请输入商品重量', trigger: ['blur', 'change'] },
          { type: 'number', message: '请输入一个数字', trigger: ['blur', 'change'] }
        ],
        goods_cat: { required: true, message: '请选择商品分类', trigger: ['blur', 'change'] }
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 上传图片的url地址
      picURL: 'http://localhost:8888/api/private/v1/upload',
      // header请求头
      headers: { Authorization: localStorage.getItem('token') },
      // 是否显示大图
      dialogVisible: false,
      // 大图的url地址
      dialogImageUrl: '',
      disabled: false,
      fileList: ''
    }
  },
  async created () {
    // 渲染商品分类
    try {
      const { meta, data } = await this.$axios.get('categories?type=3')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    cateId () {
      if (this.goodsMsg.goods_cat.length === 3) {
        return this.goodsMsg.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // tab 切换
    async handleClick (tab, event) {
      // this.activeStep = parseInt(tab.name)
      // console.log(tab, event)
      // 如果为1则表明进入商品参数面板
      if (this.activeStep === '1') {
        // 获取商品参数的数据
        const res = await this.$axios.get(`categories/${this.cateId}`, {
          params: {
            sel: 'many'
          }
        })
        console.log(res)
        // if (meta.status === 200) {
        //   this.manyTableData = data
        //   console.log(data)
        // } else {
        //   this.$message.error(meta.msg)
        // }
      }
    },
    // 限制商品分类选择
    handleChange (val) {
      // console.log(val.join(','))
      if (val.length !== 3) {
        this.goodsMsg.goods_cat = []
        this.$message.error('只能选择第三级商品！')
      }
    },
    // 跳转到下一步
    nextStep () {
      if (this.goodsMsg.goods_cat.length === 3) {
        this.activeStep = +this.activeStep + 1 + ''
      } else {
        this.$message.error('请先选择商品分类')
      }
    },
    // 限制只有在选择了商品分类后才能跳转到下一步
    beforeLeave (activeName, oldActiveName) {
      if (this.goodsMsg.goods_cat.length !== 3 && activeName !== '0') {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 图片上传
    handleAvatarSuccess (res, file, fileList) {
      const { meta, data } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.goodsMsg.pics.push({
          pic: data.tmp_path
        })
        this.fileList = fileList
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 限制图片上传的格式和大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 删除上传的图片
    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      const index = this.goodsMsg.pics.findIndex(i => i === path)
      this.goodsMsg.pics.splice(index, 1)
      this.fileList.splice(index, 1)
      this.$message.success('删除图片成功')
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 下载图片
    handleDownload (file) {
      console.log(file)
    },
    // 添加商品
    async addGood () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('goods', {
          ...this.goodsMsg,
          goods_cat: this.goodsMsg.goods_cat.join(',')
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.$router.push('/goods')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        if (!e) {
          this.$message.error('请填写完必要信息！')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addgoods {
  .quill-editor {
    background-color: #fff;
    ::v-deep .ql-editor {
      min-height: 300px;
    }
  }
  .addBtn {
    margin-top: 10px;
  }
}
</style>
