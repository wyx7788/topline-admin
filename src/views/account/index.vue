<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form>
          <el-form-item label="用户名称">
            <el-input v-model="userInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="userInfoForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="ID号">
            <el-input :value="userInfoForm.id && userInfoForm.id.toString()" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input :value="userInfoForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfoForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            @click="handleUpdate"
            :loading="ButtonLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :offset="2">
        <!--
        el - uPload  自己的请求地址
        完整路径
        请求头  token
        -->
        <!-- <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :headers="{ Authorization: token }"
          :show-file-list="false"
          name="photo"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="userInfoForm.photo" :src="userInfoForm.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :http-request="handleUpload"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="userInfoForm.photo" :src="userInfoForm.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'accout_info',
  data () {
    return {
      userInfoForm: {},
      ButtonLoading: false
      // token: `Bearer ${JSON.parse(window.localStorage.getItem('user_info')).token}`
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    async handleUpload (unLoadConfig) {
      const formData = new FormData()
      formData.append('photo', unLoadConfig.file)
      console.log(formData)
      try {
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })
        console.log(data)
        // console.log(this.userInfo)
        this.userInfoForm.photo = data.photo
        this.$message({
          type: 'success',
          message: '上传头像成功'
        })
      } catch (err) {
        console.log(err)
        this.$message.error('上传头像失败')
      }
    },
    async loadUserInfo () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        this.userInfoForm = data
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async handleUpdate () {
      this.ButtonLoading = true
      const { name, intro, email } = this.userInfoForm
      try {
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          },
          imageUrl: ''
        })
        console.log(data)
        this.ButtonLoading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } catch (err) {
        console.log(err)
        this.ButtonLoading = false
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang='less'>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
