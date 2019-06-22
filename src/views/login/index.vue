<template>
<div class="LoginBox">
  <div class="Login_form">
    <div class="Login_form_head">
      <img src="./logo_index.png">
    </div>
    <div class="Login_form_content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="14">
            <el-input v-model="ruleForm.code"></el-input>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-button>获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_login" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'AppLogin',
  data () {
    return {
      ruleForm: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度在 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.LoginBox{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(login_bg.jpg) center /100%;
  .Login_form{
    width: 320px;
    padding: 50px;
    background: #fff;
    border-radius: 5px;
    .Login_form_head{
      text-align: center;
      margin-bottom: 30px;
      img{
        width: 60%;
      }
    }
    .btn_login{
      width: 100%;
    }
  }
}
</style>