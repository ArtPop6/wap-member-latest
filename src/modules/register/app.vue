<template>
  <div class="app">
    <transition mode="out-in" name="fade">
      <div class="stage-2" v-show="stageIndex === 1">
        <div class="content">
          <van-cell-group class="btn-group">
            <van-field class="btn-group__item" clearable label="用户名:" placeholder="请输入用户名" v-model="username" />
          </van-cell-group>

          <van-cell-group class="btn-group">
            <van-field
              class="btn-group__item"
              clearable
              label="手机号:"
              maxlength="11"
              placeholder="请输入手机号"
              v-model="phone"
            />
          </van-cell-group>

          <van-cell-group class="btn-group btn-group__sms">
            <div class="label">验证码:</div>
            <div class="yzm">
              <input maxlength="10" placeholder="请输入验证码" type="text" v-model="code" />
              <div class="yzm-content">
                <mycom-yzm :enable="enableCode" @sendPhoneCode="handlerGetPhoneCode" />
              </div>
            </div>
          </van-cell-group>

          <div class="btn-container">
            <div :class="{'disabled': !enableSubmit}" @click="gotoSubmit" class="btn-submit">提交</div>
          </div>
        </div>
      </div>
    </transition>

    <transition mode="out-in" name="fade">
      <div class="stage-3" v-show="stageIndex === 2">
        <p class="p text-center">
          <span class="user-add"></span>用户注册成功
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import { Field } from 'vant'
import 'vant/lib/index.css'

import './style.stylus'
import param from '@utils/url-param'

import comYzm from './components/yzm'
import toast from '../../components/toast'

export default {
  components: {
    'mycom-yzm': comYzm,
    Field
  },
  data: () => ({
    counter: 0,
    username: null,
    phone: null,
    code: null,
    enableCode: false,
    enableSubmit: false,
    stageIndex: 1,

    macCode: param('mac_code') || localStorage.getItem('macCode'),
    appId: param('appid') || localStorage.getItem('appid')
  }),
  computed: {
    redict() {
      const _tmp =
        window.location.hash && window.location.hash.match(/#url=(.*)/)[1]
          ? window.location.hash.match(/#url=(.*)/)[1]
          : ''

      if (_tmp) {
        return _tmp
      } else {
        return './course.html'
      }
    }
  },
  methods: {
    handerChangePhone() {
      this.enableCode = /^1\d{10}$/.test(this.phone)
    },

    goto(value) {
      this.stageIndex = value
    },

    checkSubmit() {
      if (this.enableCode && this.code) {
        this.enableSubmit = true
      } else {
        this.enableSubmit = false
      }
    },

    handlerGetPhoneCode() {
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

    inWeixin() {
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) {
        return
      }
      toast('请在微信客户端打开链接')
      window.location.href = 'judgeBrowser.html'
    },

    gotoSubmit() {
      const self = this
      if (this.enableSubmit) {
        const postData = {
          mac_code: this.macCode,
          name: this.username,
          phone: this.phone,
          sms_code: this.code
        }
        this.$http.post('/auth/access_token', postData).then(
          res => {
            const data = res.data
            if (data.access_token) {
              toast('提交成功')
              self.goto(2)
              // 注册成功后 本地缓存access_token与appid
              localStorage.setItem('access_token', data.access_token)
              localStorage.setItem('appid', self.appId)
              localStorage.setItem('macCode', self.macCode)
              setTimeout(() => {
                window.location.href = self.redict
              }, 2000)
            } else {
              toast(data.msg)
            }
          },
          err => {
            toast(err)
          }
        )
      }
    }
  },
  watch: {
    phone() {
      this.handerChangePhone()
    },
    enableCode() {
      this.checkSubmit()
    },
    code() {
      this.checkSubmit()
    }
  },

  mounted() {
    if (!this.macCode || this.macCode === 'undefined' || this.macCode === 'null') {
      toast('当前页面不存在macCode')
      this.inWeixin()
      if (!this.appId || this.appId === 'undefined' || this.appId === 'null') {
        toast('当前页面不存在appid')
        return
      }
      const target = `${window.location.origin}/exchange.html&response_type=code&scope=snsapi_userinfo&state=${this.appId}`
      const weixinAuth = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${target}`
      window.location.href = weixinAuth
    }
  }
}
</script>
