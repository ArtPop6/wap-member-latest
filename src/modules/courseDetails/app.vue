<template>
  <!-- @touchstart="onScroll" -->
  <div @touchstart="onScroll" class="details">
    <div class="header">
      <van-swipe :autoplay="swipeAutoplay" indicator-color="#fcdb00">
        <van-swipe-item :key="index" v-for="(image, index) in images">
          <!-- video-player vjs-custom-skin  -->
          <video-player
            :options="playerOptions"
            :playsinline="true"
            @ended="onPlayerEnded($event)"
            @pause="onPlayerPause($event)"
            @play="onPlayerPlay($event)"
            @ready="playerReadied"
            @statechanged="playerStateChanged($event)"
            class="video-player vjs-custom-skin"
            customEventName="customstatechangedeventname"
            ref="videoPlayer"
            style="height: 100%; width: 100%; object-fit: fill"
            v-if="image.type === 'VIDEO' && image.url"
            webkit-playsinline
            x5-playsinline
          ></video-player>
          <img :src="image.url" class="header__img" v-if="image.type === 'IMG'"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="content">
      <div class="content__top">
        <span class="content__top--title">{{cousedetail.course_name}}</span>
        <span class="content__top--price">&yen;{{cousedetail.price}}/节</span>
      </div>
      <span class="content__text">团课容纳人数{{cousedetail.course_capacity}}人</span>
      <div class="content__solid"></div>
      <div class="content__type">
        <span class="content__type--time">时间</span>
        <span class="content__type--text">{{coursedate}}&nbsp;&nbsp;{{cousedetail.begin_time}}-{{cousedetail.end_time}}</span>
      </div>
      <div class="content__type">
        <span class="content__type--time">门店</span>
        <span class="content__type--text">{{cousedetail.store_name}}</span>
      </div>
      <div class="content__type">
        <span class="content__type--time">教练</span>
        <span class="content__type--text">{{cousedetail.coach_nick_name}}</span>
      </div>
      <div class="content__type">
        <span class="content__type--time">类型</span>
        <span class="content__type--text">{{cousedetail.course_type}}</span>
      </div>
      <div class="content__solid"></div>
      <span class="content__introduce">课程介绍</span>
      <div class="content__introtext" v-html="cousedetail.course_description"></div>
    </div>
    <div class="foot">
      <div @click="goTimepackage()" class="foot__course" v-if="cousedetail.coupon_price">
        <span class="foot__course--price">&yen;{{cousedetail.coupon_price}}/节</span>
        <span class="foot__course--number">限时课包{{cousedetail.coupon_times}}节</span>
      </div>
      <div class="foot__course" v-if="!cousedetail.coupon_price">
        <span class="foot__course--price">暂无可购课包</span>
      </div>
      <div @click="goCourseorder()" class="foot__simple">
        <span :class="condition === 'full' ? 'disable-button' : 'foot__simple--text'">{{condition === 'full' ? '已满员' : '立即约课'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import './style.stylus'
  import go from '@utils/goto'
  import param from '@utils/url-param'
  import { videoPlayer } from 'vue-video-player'

  export default {
    components: {
      videoPlayer
    },
    data () {
      return {
        condition: param('condition') || null,
        images: [],
        cousedetail: {},
        coursedate: '',
        timetable: param('timetable') || null,
        date: param('date') || null,
        swipeAutoplay: 3000,
        playerOptions: {
          // videojs options
          autoplay: true,
          controls: true,
          muted: true,
          loop: false,
          preload: true,
          language: 'zh-CN',
          playsinline: true,
          // fluid: true,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [
            {
              type: 'video/mp4',
              src: ''
            }
          ],
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          },
          poster: ''
        }
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    watch: {},
    methods: {
      onPlayerPlay (player) {
        this.swipeAutoplay = ''
      },
      onPlayerPause (player) {
        // console.log('player pause!', player)
      },
      playerReadied (player) {
        // you can use it to do something...
        // player.[methods]
      },
      playerStateChanged (playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      list () {
        this.$http.get(`./group_exercise/detail?timetable_id=${this.timetable}&date=${this.date}`).then(res => {
          this.cousedetail = res.data
          this.images = res.data.course_imgs
          this.playerOptions.sources[0].src = this.images[0].url
          // this.playerOptions.poster = this.images[1].url
          this.coursedate = res.data.date.slice(5, 7) + '月' + res.data.date.slice(8, 11) + '日'
          this.images = res.data.course_imgs
        })
      },
      onPlayerEnded (event) {
        this.swipeAutoplay = 3000
      },
      goTimepackage () {
        go(
          `./timePackage.html?course_product_sku_id=${this.cousedetail.product_id}&store_id=${this.cousedetail.store_id}&timetable=${this.cousedetail.timetable_id}&date=${this.date}`
        )
      },
      goCourseorder () {
        if (this.condition === 'full') {
          return
        }
        go(
          `./selectSeat.html?course_product_id=${this.cousedetail.product_id}&course_product_sku_id=${this.cousedetail.sku_id}&timetable_id=${this.cousedetail.timetable_id}&date=${this.date}`
        )
      },
      onScroll () {
        // this.player.muted(false)
      }
    },
    created () {
      this.list()
      // this.$refs.videoPlayer.play()
      // this.onPlayerPlay()
      // const myPlayer = this.$refs.videoPlayer
      // console.log('自动播放', myPlayer)
      // myPlayer.play()
    }
  }
</script>
