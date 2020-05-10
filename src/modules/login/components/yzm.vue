<template>
  <div @click="getAuthCode" class="com-yzm" v-bind:class="{'disabled': !sendAuthCode ||!enable }">
    <span class="auth-text" v-show="sendAuthCode">获取验证码</span>

    <div class="auth-text" v-show="!sendAuthCode">
      <span>{{authTime}}</span> s后重新发送
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enable: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    sendAuthCode: true, // 布尔值
    authTime: 0 // 倒计时 计数器
  }),

  methods: {
    getAuthCode() {
      if (!this.enable) return
      if (!this.sendAuthCode) return
      this.sendAuthCode = false
      this.authTime = 60
      const authTimetimer = setInterval(() => {
        this.authTime -= 1
        if (this.authTime <= 0) {
          this.sendAuthCode = true
          clearInterval(authTimetimer)
        }
      }, 1000)

      this.$emit('sendPhoneCode')
    }
  }
}
</script>

<style lang="stylus">
$font-color = #a60007
$bg-color = #ffdf00
$disabled-color = #eee

.com-yzm
  width 100%
  height 56px
  display flex
  justify-content center
  align-items center
  background #000
  color #fff
  cursor pointer
  border-radius 6px
  padding 11px 20px

  &.disabled
    background $disabled-color
    color rgba(119, 122, 136, 0.3)

  .auth-text
    font-size 24px
    line-height 33px
</style>