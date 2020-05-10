<template>
  <div class="app">
    <transition mode="out-in" name="fade">
      <div class="loading-wrap" v-show="stageIndex === 0">
        <img alt class="logo-pic" src="./assets/logo.png" />
        <div class="process-c">
          <div class="process-v" ref="process"></div>
        </div>
      </div>
    </transition>
    <transition mode="out-in" name="fade">
      <div class="signup-wrap" v-show="stageIndex === 1">

        <div class="success-tip">签到成功</div>
      </div>
    </transition>
    <transition mode="out-in" name="fade">
      <div class="stage-3" v-show="stageIndex === 2">
        <div class="fail-title__wrap">
          <div class="fail-title__top">
            <van-icon name="clear" size="27px" />
            <div class="fail-title">签到失败</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import param from '@utils/url-param'
import './signup.styl'
import toast from '../../components/toast'
import moment from 'moment'
import QRCode from 'qrcode'
import Cookies from 'js-cookie'

export default {
  components: {
    QRCode: QRCode
  },
  data() {
    return {
      store_id: param('store_id'),
      channel_id: param('channel_id'),
      mac_code: localStorage.getItem('macCode') || Cookies.get('mac_code'),
      codes: '',
      codedate: '',
      stageIndex: 0,
      timetableId: param('timetable_id')
    }
  },
  methods: {
    goSignUp() {
      const data = {
        timetable_id: this.timetableId
      }
      this.$http
        .get('./group_exercise/sign', { params: data })
        .then(res => {
          this.stageIndex = 1
          toast('签到成功')
        })
        .catch(err => {
          console.log(err.response.data.err_msg)
          this.stageIndex = 2
        })
    },
    processBar() {
      let width = -10
      let interval = setInterval(() => {
        width += 10
        this.$refs.process.style.width = width + '%'
        if (width >= 100) clearInterval(interval)
      }, 100)
    }
  },
  created() {
    this.goSignUp()
    this.processBar()
  }
}
</script>
