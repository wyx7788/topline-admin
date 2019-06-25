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
            <el-button
            @click="handleSendCode"
            :disabled="!!codeTimer || codeLoading"
            >
              {{codeTimer ? `${codeSeconds}秒` : '获取验证码'  }}
            </el-button>
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
          </el-col>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox v-model="ruleForm.checked">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_login" type="primary" @click="submitForm" :loading="ButtonLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt.js'
// import { clearInterval } from 'timers';

const initCodeSeconds = 10 // 定义倒计时的时间

export default {
  name: 'AppLogin',
  data () {
    return {
      ruleForm: {
        mobile: '17635158848',
        code: ''
      },
      captchaObj: null,
      ButtonLoading: false,
      checked: '',
      codeSeconds: initCodeSeconds, // 倒计时时间
      codeTimer: null, // 定时器标识——数字
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度在 6 个字符', trigger: 'blur' }
        ],
        checked: [
          { required: true, message: '未同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '未同意用户协议', trigger: 'change' }
          // 正则验证
        ]
      },
      sendMobile: '',
      // 禁止多次点击，禁用获取验证码按钮
      codeLoading: false
    }
  },
  methods: {
    handleSendCode () {
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // console.log('errorMessage=>' + errorMessage)
        if (errorMessage.trim().length > 0) {
          return
        }

        if (this.captchaObj) {
          // return this.captchaObj.verify()
          if (this.ruleForm.mobile !== this.sendMobile) {
            this.showGeetest()
            document.body.removeChild(document.querySelector('.geetest_panel'))
          } else {
            this.captchaObj.verify()
          }
        } else {
          this.showGeetest()
        }
      })
    },
    showGeetest () {
      this.codeLoading = true
      const mobile = this.ruleForm.mobile
      // console.log(this.ruleForm)
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
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
          // console.log(captchaObj)
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
            captchaObj.verify()
            this.sendMobile = this.ruleForm.mobile
            // 验证码ready之后才能调用verify方法显示验证码
            this.codeLoading = false
            // 极验显示后，验证码按钮 解除禁用
          }).onSuccess(() => {
            // your code
            // console.log(captchaObj.getValidate())
            const {
              geetest_challenge: challenge,
              geetest_validate: validate,
              geetest_seccode: seccode
            } = captchaObj.getValidate()
            // ajax 伪代码，进行二次验证
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              console.log(res.data)
              // 其他服务端需要的数据，比如登录时的用户名和密码
              // 根据服务端二次验证的结果进行跳转等操作
              this.codeCountDown()
            })
          })
        })
      })
    },
    codeCountDown () {
      console.log('codeCountDown')
      this.codeTimer = window.setInterval(() => {
        console.log(initCodeSeconds)
        console.log(this.codeSeconds)
        this.codeSeconds--
        if (this.codeSeconds <= 0) {
          this.codeSeconds = initCodeSeconds
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
        }
      }, 1000)
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          // return
          this.submitLogin()
        } else {
          return false
        }
      })
    },
    // resetForm (ruleForm) {
    //   this.$refs[ruleForm].resetFields()
    // },
    submitLogin () {
      this.ButtonLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.ruleForm
      }).then(res => {
        this.$message({
          message: '恭喜你，登录成功！',
          type: 'success'
        })
        // console.log(res.data)
        // console.log(res.message)
        alert(res.data.message)
        this.ButtonLoading = false
        this.$router.push({
          name: 'Home'
        })
      }).catch(err => {
        // console.dir(err)
        if (err.response.status === 400) {
          this.$message.error('错了哦，登录失败，用户名或验证码错误！')
        }
        this.ButtonLoading = false
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
