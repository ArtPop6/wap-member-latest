<template>
  <div>
    <button
      size="large"
      type="primary"
      class="btn-class"
      @click="handler_auth"
    >微信网页授权接口</button><br>
    <button
      size="large"
      type="primary"
      class="btn-class"
      @click="userinfo"
    >获得用户信息</button><br>
    <button
      size="large"
      type="primary"
      class="btn-class"
      @click="getJSSDK"
    >获取JSSDK</button><br>
  </div>
</template>

<script>
import ready from '@utils/ready'
import share from '@utils/3rd/wechat/share'
import http from '@utils/http'

export default {
  methods: {
    handler_auth() {
      window.location.href = `http://www.xxxxx.com/api/auth/login?from=${encodeURIComponent(window.location.href)}`
    },

    userinfo() {
      http.get(`/test`).then(
        data => {
          alert(JSON.stringify(data))
          console.log(data)
        },
        err => {
          alert(err)
          console.error(err)
        }
      )
    },

    getJSSDK() {
      http.get(`/auth/jssdk?url=${encodeURIComponent(window.location.href)}`).then(
        data => {
          alert(JSON.stringify(data))
          console.log(data)
        },
        err => {
          alert(err)
          console.error(err)
        }
      )
    }
  },

  mounted() {
    window.onerror = test
    function test(err) {
      alert(err)
    }
  }
}
</script>

<style lang="stylus">
.btn-class
  background $primary-color
  font-size 12px
  border none
  padding 10px
</style>
