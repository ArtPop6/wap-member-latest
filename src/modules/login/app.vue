<template>
  <div class="new-login">
    <div class="logo">
      <!-- <img alt class="top-logo" src="./img/top.png" />
      <img alt class="bottom-logo" src="./img/bottom.png" />-->
      <img :src="companyLogo" class="logo-img"/>
    </div>
    <div class="title">登陆/注册</div>
    <div class="content">
      <van-cell-group>
        <van-field clearable label="+86" maxlength="11" placeholder="请输入手机号" v-model="phone"/>
        <van-field maxlength="10" placeholder="请输入手机验证码" type="password" v-model="code">
          <mycom-yzm :enable="enableCode" @sendPhoneCode="handlerGetPhoneCode" slot="button"/>
        </van-field>
      </van-cell-group>
    </div>
    <div class="van-button__wrap">
      <van-button :disabled="!enableSubmit" @click="gotoSubmit" type="default">登录</van-button>
    </div>
  </div>
</template>

<script>
  import './style.stylus'
  import param from '@utils/url-param'

  import comYzm from './components/yzm'
  import toast from '../../components/toast'

  export default {
    components: {
      'mycom-yzm': comYzm
    },
    data () {
      return {
        enableCode: false,
        stageIndex: 1,
        userName: null,
        phone: '',
        code: '',
        btnDisable: false,
        enableSubmit: false,
        companyLogo: '',
        // openid: param('openid') || localStorage.getItem('openid'),
        macCode: param('mac_code') || localStorage.getItem('macCode'),
        appId: param('appid') || localStorage.getItem('appid')
      }
    },
    watch: {
      phone () {
        this.handerChangePhone()
      },
      enableCode () {
        this.checkSubmit()
      },
      code () {
        this.checkSubmit()
      }
    },
    computed: {
      redirect () {
        const _tmp =
          window.location.hash && window.location.hash.match(/#url=(.*)/)[1]
            ? window.location.hash.match(/#url=(.*)/)[1]
            : ''
        if (_tmp) {
          return _tmp
        } else {
          return './homePage.html'
        }
      }
    },
    methods: {
      handerChangePhone () {
        this.enableCode = /^1\d{10}$/.test(this.phone)
      },
      checkSubmit () {
        if (this.enableCode && this.code) {
          this.enableSubmit = true
        } else {
          this.enableSubmit = false
        }
      },
      gotoSubmit () {
        const self = this
        if (this.enableSubmit) {
          const postData = {
            mac_code: this.macCode,
            phone: this.phone,
            sms_code: this.code,
            name: this.userName
          }
          this.$http.post('/auth/access_token', postData).then(
            res => {
              const data = res.data
              if (data.access_token) {
                toast('欢迎回来')
                localStorage.setItem('access_token', data.access_token)
                localStorage.setItem('appid', self.appId)
                localStorage.setItem('macCode', self.macCode)
                setTimeout(() => {
                  window.location.href = self.redirect
                }, 900)
              } else {
                toast(data.msg)
              }
            },
            err => {
              toast(err.response.data.err_msg)
            }
          )
        }
      },
      getLogo () {
        this.$http
          .get(`./corporations/logo?mac_code=${this.macCode}`)
          .then(res => {
            this.companyLogo = res.data.corp_logo_img_url
          })
          .catch(err => {
            console.log(err)
          })
      },
      handlerGetPhoneCode () {
        if (this.enableCode) {
          this.$http.get(`/check/code?phone=${this.phone}`, { noToast: true }).then(res => {
            const data = res.data
            if (data.code === 200) {
              toast('短信发送成功')
            } else {
              toast(data.msg)
            }
          })
        }
      },
      inWeixin () {
        var ua = navigator.userAgent.toLowerCase()
        var isWeixin = ua.indexOf('micromessenger') !== -1
        if (isWeixin) {
          return
        }
        toast('请在微信客户端打开链接')
        window.location.href = 'judgeBrowser.html'
      }
    },

    mounted () {
      // this.saveOpenid()
      // 如果没有openid前往获取openid
      this.getLogo()

      function _isVaild (value) {
        return !value || value === 'undefined' || value === 'null'
      }

      if (_isVaild(this.macCode)) {
        // alert('前往获取openid')
        toast('当前页面不存在macCode')
        // 在没有openid的前提下，判断用户是否是在微信端打开此网页
        this.inWeixin()
        // 微信公众号菜单点入的参数一般都自动带有appid
        if (_isVaild(this.appId)) {
          toast('当前页面不存在appid')
        }
        // ?url=${encodeURIComponent(http%3A%2F%2Fdev.m.ampmfit.net%2Fcourse.html)}
        const target = `${window.location.origin}/exchange.html`
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${target}&response_type=code&scope=snsapi_userinfo&state=${this.appId}`
      }
    }
  }
</script>
