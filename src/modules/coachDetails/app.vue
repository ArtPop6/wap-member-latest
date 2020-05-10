 <template>
  <div class="coach">
    <header class="coach_top">
      <div class="coach_top-img">
        <img :src="coach.img" class="coach_top-imgs" />
      </div>
      <div class="coach_top-img">
        <span class="coach_right-name">{{coach.realname}}</span>
        <span class="coach_right-good">擅长：{{coach.good_at}}</span>
        <span class="coach_right-seniority">资历：{{coach.summary}}</span>
      </div>
    </header>
    <Tab :details="details" :time="time" @post="postList" @selecteds="showchild" class="coach_tab"></Tab>
    <Show
      :course="course"
      :postData="postData"
      :showMake="showMake"
      @courses="finish"
      @renewals="renewal"
      @show="show"
      @showvalue="showvalues"
    ></Show>
    <div @click="make" class="coach_bottom">立即预约</div>
  </div>
</template>
<script>
import './style.stylus'
import param from '@utils/url-param'
import Tab from './components/Tab'
import Show from './components/Show'

export default {
  components: {
    Tab,
    Show
  },
  data() {
    return {
      coach: {},
      time: {},
      details: '',
      selectvalue: '',
      course: [],
      showMake: false,
      renewalvalue: '',
      postData: {
        coachId: '',
        beginData: '',
        beginTime: ''
      }
    }
  },
  watch: {
    renewalvalue(v) {
      this.list()
    }
  },
  methods: {
    wxJsApiinit() {
      const urls = './auth/config/jsapi' // 获取后台数据接口url
      const datas = { page_url: location.href.split('#')[0] }
      this.$http.get(urls, { params: datas }).then(res => {
        wx.config({
          debug: false,
          appId: res.data.app_id,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonce_str,
          signature: res.data.signature,
          jsApiList: ['chooseWXPay']
        })
        wx.ready(function() {
          console.log('接口调用成功')
        })
      })
    },
    list() {
      const id = param('id')
      const storeid = param('storeId')
      this.$http.get(`/coaches/detail?id=${id}`).then(res => {
        this.coach = res.data
        this.details = this.coach.detail
      })
      const times = {
        coach_id: id,
        store_id: storeid
      }
      this.$http.get(`/coaches/times`, { params: times }).then(res => {
        this.time = res.data
      })
    },
    courseList() {
      const storeId = param('storeId')
      const courseData = {
        coach_id: this.postData.coachId,
        begin_date: this.postData.beginData,
        begin_time: this.postData.beginTime.slice(0, 5) + ':00',
        end_time: this.postData.beginTime.slice(8, 13) + ':00',
        store_id: storeId
      }
      return this.$http.get(`/course`, { params: courseData }).then(res => {
        this.showMake = true
        this.course = res.data
      })
    },
    showchild(data) {
      this.selectvalue = data
    },
    showMakes(data) {
      this.showMake = data
    },
    show(data) {
      this.showMake = data
    },
    postList(coach, bgData, bgTime) {
      this.postData.coachId = coach
      this.postData.beginData = bgData
      this.postData.beginTime = bgTime
    },
    finish(data) {
      this.list()
      this.showMake = false
    },
    // todo modal
    make() {
      if (!this.selectvalue) {
        alert('请您选择预约时间')
      } else {
        this.courseList().catch(error => {
          this.showMake = false
          console.log(error.response.status)
        })
      }
    },
    renewal(data) {
      this.renewalvalue = data
    },
    showvalues(data) {
      this.showMake = data
    }
  },
  mounted() {
    this.list()
    this.wxJsApiinit()
  }
}
</script>
<style lang="stylus" scoped>
html body
  height 100%

.coach
  position relative
  // display flex
  // flex-direction column
  max-width 750px
  width auto
  height 100%
  background-color #fafafa

  .coach_top
    display flex
    width 100%
    height 450px
    background #92959e

    .coach_top-img
      width 50%
      height 450px

      .coach_top-imgs
        position absolute
        top 20px
        left 20px
        width 340px
        height 410px

      .coach_right-name
        position absolute
        top 20px
        font-size 45px
        text-align center
        background rgba(247, 211, 7, 0.993)
        color white
        width 150px
        height 60px

      .coach_right-good
        position absolute
        top 100px
        width auto
        height 65px
        font-size 24px
        color white

      .coach_right-seniority
        position absolute
        max-width 50%
        top 185px
        overflow-wrap break-word
        // height auto
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 6
        font-size 24px
        color white

  .coach_tab
    margin-bottom 108px

  .coach_bottom
    position absolute
    bottom 0
    width 750px
    height 100px
    background-color #fcdb00
    outline none
    border none
    font-size 30px
    line-height 100px
    text-align center
</style>