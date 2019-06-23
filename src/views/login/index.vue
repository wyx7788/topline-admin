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
            <el-button @click="handleSendCode">获取验证码</el-button>
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
import axios from 'axios'
import '@/vendor/gt.js'

export default {
  name: 'AppLogin',
  data () {
    return {
      ruleForm: {
        mobile: '17635158848',
        code: ''
      },
      captchaObj: null,
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
    handleSendCode () {
      const mobile = this.ruleForm.mobile
      console.log(this.ruleForm)
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        console.log(res.data)
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind'
        },
        (captchaObj) => {
          this.captchaObj = captchaObj
          console.log(captchaObj)
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            captchaObj.verify()
            // 验证码ready之后才能调用verify方法显示验证码
          }).onSuccess(function () {
            // your code
            var result = captchaObj.getValidate()
            // ajax 伪代码，进行二次验证
            axios({
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode
            }).then(res => {
              close.log(res.data)
              // 其他服务端需要的数据，比如登录时的用户名和密码
              // 根据服务端二次验证的结果进行跳转等操作
            })
          }).onError(function () {
            // your code
          })
        })
      })
    },
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