<template>
  <div class="mycard">
    <div class="cardheader">
      <div class="cardheader_foot">
        <span class="cardheader_foot-rtname">{{greeting.greeting}}</span>
        <div class="foot_position">
          <van-icon class="foot_position-position" name="location-o" />
          <span class="cardheader_foot-rtphone">{{nears.name}} · {{nears.show_distant}}km</span>
          <span class="cardheader_foot-br">|</span>
          <span @click="goShop()" class="cardheader_foot-more">更多门店</span>
        </div>
      </div>
      <img class="cardheader_foot-rtimg" src="./assets/img/topright.png" />
    </div>
    <div class="cardcenter">
      <div class="cardcenter-swipe">
        <van-swipe :autoplay="3000">
          <van-swipe-item :key="index" v-for="(image, index) in swipe">
            <img class="cardcenter-swipe-img" v-lazy="image.media_url" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="cardcenter-card">
        <div class="card-top">
          <span class="card_top-text">热门卡片</span>
          <span @click="goCard()" class="card_top-more">
            更多
            <van-icon name="arrow" />
          </span>
        </div>
        <div class="card_bootom">
          <div
            :key="index"
            @click="gotoCard(card)"
            class="card_bootom-hot"
            v-for="(card,index) in cardss"
            v-show="cardss"
          >
            <img :src="cardss.img" class="card_bootom-img" />
            <div class="card_bootom-price">
              <span class="card_bootom-claname">{{card.name}}</span>
              <span class="card_bootom-clapri">&yen;{{card.price}}</span>
            </div>
          </div>
          <div class="card_bootom-text" v-show="cardss==''">
            <img class="card_bottom-empty" src="./assets/img/Empty.png" />
            <span class="card_bottom-card">门店暂无售卡</span>
          </div>
        </div>
      </div>
      <div class="cardcenter-card">
        <div class="card-top">
          <span class="card_top-text">热门课程</span>
          <span @click="goClass()" class="card_top-more">
            更多
            <van-icon name="arrow" />
          </span>
        </div>
        <div class="card_bootom">
          <div
            :key="index"
            @click="goClassdetai(hot)"
            class="card_bootom-hot"
            v-for="(hot,index) in hots"
            v-show="hots"
          >
            <img :src="hot.course_img" class="card_bootom-img" />
            <div class="card_bootom-price">
              <span class="card_bootom-claname">{{hot.course_name}}</span>
              <span class="card_bootom-clapri">&yen;{{hot.price}}</span>
            </div>
          </div>
          <div class="card_bootom-text" v-show="hots==''">
            <img class="card_bottom-empty" src="./assets/img/Empty.png" />
            <span>今日暂无排课</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cardfoot">
      <Tabs :tabindex="tabindex" @tabindexs="goTab"></Tabs>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import Tabs from '../../components/tab'
import moment from 'moment'
import param from '@utils/url-param'

export default {
  components: {
    Tabs
  },
  data() {
    return {
      nears: {},
      card: [],
      greeting: {},
      tabindex: 0,
      swipe: [],
      cardss: [],
      latitude: '',
      longitude: '',
      storeid: '',
      hots: [],
      today: ''
    }
  },
  watch: {},
  methods: {
    list() {
      this.$http.get('/advert/greeting').then(res => {
        this.greeting = res.data
      })
    },
    swipeList() {
      this.$http.get('/advert/index').then(res => {
        this.swipe = res.data
      })
    },
    storesList() {
      const storeData = {
        lat: this.latitude,
        lon: this.longitude,
        store_id: param('storeid')
      }
      this.$http.get(`/stores/near`, { params: storeData }).then(res => {
        this.nears = res.data
        this.storeid = res.data.id
        this.carsList()
        this.hotList()
      })
    },
    carsList() {
      const cardData = {
        store_id: this.storeid,
        category_id: ''
      }
      this.$http.get(`/cards`, { params: cardData }).then(res => {
        this.cardss = res.data[0].cards
      })
    },
    hotList() {
      this.today = moment().format('YYYY-MM-DD')
      const hotData = {
        store_id: this.storeid,
        date: this.today
      }
      this.$http.get(`/group_exercise/hot`, { params: hotData }).then(res => {
        this.hots = res.data
      })
    },
    // 跳转到附近门店
    goShop() {
      go(`./nearStore.html?lat=${this.latitude}&lon=${this.longitude}`)
    },
    // 跳转到所有卡片列表
    goCard() {
      go(`./allCards.html`)
    },
    // 跳转到课程列表
    goClass() {
      go(`./groupClass.html`)
    },
    // 跳转到卡片详情
    gotoCard(card) {
      go(`./cardDetails.html?product_id=${card.product_id}&sku_id=${card.product_sku_id}&store_id=${this.storeid}`)
    },
    // 跳转到课程详情
    goClassdetai(hot) {
      go(`./courseDetails.html?timetable=${hot.timetable_id}&date=${this.today}`)
    },
    // 获取位置
    wxJsApiinit() {
      const that = this
      const urls = './auth/config/jsapi' // 获取后台数据接口url
      const datas = { page_url: location.href.split('#')[0] }
      return this.$http
        .get(urls, { params: datas })
        .then(res => {
          wx.config({
            debug: false,
            appId: res.data.app_id,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonce_str,
            signature: res.data.signature,
            jsApiList: ['getLocation']
          })
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获取结果之后，config是一个客户端的异步操作，所以如果要在页面加载时就调用相关接口，
          // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
          wx.ready(function() {
            wx.getLocation({
              type: 'wgs84',
              success: function(res) {
                that.latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                that.longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
                that.storesList()
              }
            })
          })
          // 通过error接口处理失败验证，config信息验证失败会执行error函数，如签名过期导致验证失败
          wx.error(res => {
            console.log('接口调用失败')
          })
        })
        .catch(err => {
          console.log('接口调用失败', err)
        })
    },
    goTab(data) {
      if (data == 2) {
        go(`./qrcode.html`)
      } else if (data == 1) {
        go(`./allCards.html`)
      } else if (data == 3) {
        go(`./groupClass.html`)
      } else if (data == 4) {
        go(`./myCenter.html`)
      } else {
      }
    }
  },
  created() {
    this.list()
    // if (param('lat') && param('lon')) {
    //   this.latitude = param('lat')
    //   this.longitude = param('lon')
    //   this.storesList()
    // } else {
    this.wxJsApiinit()
    // }
    this.swipeList()
  }
}
</script>
