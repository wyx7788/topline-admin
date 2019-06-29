<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发布文章</span>
      <div>
        <el-button @click="handlePublish(false)" type="primary">发布</el-button>
        <el-button @click="handlePublish(true)">保存草稿</el-button>
      </div>
    </div>
    <el-form
    :model="articleForm"
    :rules="rules"
    v-loading='editLoading'
    label-width="100px"
    class="demo-ruleForm">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="活动内容" prop="content">
        <quill-editor v-model="articleForm.content"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </el-form-item>
      <el-form-item label="活动封面" prop="cover">
        <!-- v-model="articleForm.cover.type -->
        <el-radio-group>
          <el-radio label="单张"></el-radio>
          <el-radio label="三张"></el-radio>
          <el-radio label="无图"></el-radio>
          <el-radio label="自动"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动频道" prop="value">
        <article-channel v-model="articleForm.channel_id"></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '',
        // cover: {
        //   type: '',
        //   images: []
        // },
        channel_id: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写活动内容', trigger: 'blur' }
        ],
        channels: [
          { required: true, message: '请选择活动频道', trigger: 'change' }
        ]
      },
      editorOption: {
        // some quill options
      },
      editLoading: true
    }
  },
  created () {
    if (this.$route.name === 'publish-edit' && this.editLoading) {
      this.handleEdit()
    }
  },
  methods: {
    handleEdit () {
      this.editLoading = true
      console.log(this.$route)
      this.$http({
        method: 'GET',
        url: `/articles/${this.$route.params.id}`
      }).then(data => {
        console.log(data)
        this.editLoading = false
        this.articleForm = data
      })
    },
    handlePublish (draft) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
        console.log(data)
      }).catch(err => {
        console.log(err)
        this.$message.error('发布失败')
      })
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  }
}
</script>

<style lang='less' scoped>
.box-card{
  .clearfix{
    display: flex;
    justify-content: space-between; // 俩端对齐
    align-items: center;
  }
}
</style>
