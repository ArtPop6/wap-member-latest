<template>
  <div class="mycard">
    <div class="cardheader">
      <div class="cardheader_foot">
        <div class="cardheader_foot-left">
          <img :src="accounts.avatar" class="cardheader_foot-photo" />
        </div>
        <div class="cardheader_foot-right">
          <span class="cardheader_foot-rtname">{{accounts.name}}</span>
          <span class="cardheader_foot-rtphone">{{accounts.phone}}</span>
        </div>
        <img class="cardheader_foot-rtimg" src="./assets/img/topright.png" />
      </div>
    </div>
    <div class="cardcenter">
      <div @click="gotoMycard" class="cardcenter_top">
        <div class="cardcenter_top-left">
          <img class="cardcenter_top-img" src="./assets/img/icon_card.png" />
          <span class="ardcenter_top-mycard">我的卡片</span>
        </div>
        <div class="cardcenter_top-right">
          <img class="cardcenter_top-arrow" src="./assets/img/arrow_down.png" />
        </div>
      </div>
      <div @click="gotoMyCourse()" class="cardcenter_top">
        <div class="cardcenter_top-left">
          <img class="cardcenter_top-img" src="./assets/img/myclass.png" />
          <span class="ardcenter_top-mycard">我的课程</span>
        </div>
        <div class="cardcenter_top-right">
          <img class="cardcenter_top-arrow" src="./assets/img/arrow_down.png" />
        </div>
      </div>
      <div @click="gotoMyOrder" class="cardcenter_top">
        <div class="cardcenter_top-left">
          <img class="cardcenter_top-img" src="./assets/img/order.png" />
          <span class="ardcenter_top-mycard">我的订单</span>
        </div>
        <div class="cardcenter_top-right">
          <img class="cardcenter_top-arrow" src="./assets/img/arrow_down.png" />
        </div>
      </div>
      <div @click="goMypackage()" class="cardcenter_top">
        <div class="cardcenter_top-left">
          <img class="cardcenter_top-img" src="./assets/img/Package.png" />
          <span class="ardcenter_top-mycard">我的课包</span>
        </div>
        <div class="cardcenter_top-right">
          <img class="cardcenter_top-arrow" src="./assets/img/arrow_down.png" />
        </div>
      </div>
      <!-- <div @click="gotoMyOrder" class="cardcenter_top">
        <div class="cardcenter_top-left">
          <img class="cardcenter_top-img" src="./assets/img/order.png" />
          <span class="ardcenter_top-mycard">我的订单</span>
        </div>
        <div class="cardcenter_top-right">
          <img class="cardcenter_top-arrow" src="./assets/img/arrow_down.png" />
        </div>
      </div>-->
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

export default {
  components: {
    Tabs
  },
  data() {
    return {
      card: [],
      accounts: {},
      tabindex: 4
    }
  },
  watch: {},
  methods: {
    list() {
      this.$http.get('/personal/info').then(res => {
        this.accounts = res.data
      })
    },
    gotoMycard() {
      go(`./myCard.html`)
    },
    gotoMyOrder() {
      go('./myOrder.html')
    },
    goMypackage() {
      go('./myPackage.html')
    },
    gotoMyCourse() {
      go('./myCourse.html')
    },
    goTab(data) {
      if (data == 0) {
        go(`./homePage.html`)
      } else if (data == 2) {
        go(`./qrcode.html`)
      } else if (data == 1) {
        go(`./allCards.html`)
      } else if (data == 3) {
        go(`./groupClass.html`)
      } else {
      }
    }
  },
  created() {
    this.list()
  }
}
</script>   