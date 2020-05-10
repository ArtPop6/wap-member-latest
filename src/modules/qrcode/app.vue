<template>
  <div class="qrcode_main">
    <div class="qrcode_top" id="qrCode">
      <canvas class="qrcode" id="canvas"></canvas>
      <div class="message">欢迎光临</div>
      <div class="messages">请将二维码对准读码器</div>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import QRCode from 'qrcode'

export default {
  components: {
    QRCode: QRCode
  },
  data() {
    return {
      codes: '',
      codedate: ''
    }
  },
  methods: {
    useqrcode() {
      this.$http.get(`/personal/qrcode`).then(res => {
        this.codedate = res.data
        var canvas = document.getElementById('canvas')
        QRCode.toCanvas(canvas, this.codedate, function(error) {
          if (error) console.error(error)
          console.log('QRCode success!')
        })
      })
    }
  },
  mounted() {
    this.useqrcode()
  }
}
</script>
<style lang="stylus"></style>
