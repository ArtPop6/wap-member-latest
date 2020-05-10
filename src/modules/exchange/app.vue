<template>
  <div>微信网页授权...</div>
</template>

<script>
import ready from '@utils/ready'
import axios from 'axios'
import param from '@utils/url-param'

export default {
  data() {
    return {
      code: param('code'),
      state: param('state'),
      url: '',
      result: null
    }
  },

  computed: {
    apiUrl() {
      const apiUrl = '/api/auth/exchange'
      return `${apiUrl}?code=${this.code}&state=${this.state}`
    }
  },

  methods: {
    handlerAuth() {
      axios.get(this.apiUrl).then(res => {
        this.result = res.data
        if (res != null) {
          const macCode = this.result
          const appid = this.state
          localStorage.setItem('appid', appid)
          localStorage.setItem('macCode', macCode)
          if (this.url) {
            window.location.href = this.url
            return
          }
          window.location.href = `login.html?mac_code=${macCode}&appid=${appid}`
        }
      })
    },
    // 截取两个#之间的字符
    getParamUrl(url) {
      const dict = url.split(/[#|]/gi)
      const urlParam = dict[1]
      return urlParam
    }
  },
  created() {
    this.url = window.decodeURIComponent(this.getParamUrl(window.location.href))
  },

  mounted() {
    const requrl = window.location.href
    console.log(requrl)
    // this.inWeixin()
    if (this.code && this.state) {
      this.handlerAuth()
    }
  }
}
</script>
