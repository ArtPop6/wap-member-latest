<template>
  <div class="course">
    <div class="cardheader">
      <div class="cardheader_foot">
        <div class="cardheader_foot-left">
          <img :src="accounts.avatar" class="cardheader_foot-photo" />
        </div>
        <div class="cardheader_foot-right">
          <span class="cardheader_foot-rtname">{{accounts.name}}</span>
          <span class="cardheader_foot-rtphone">{{accounts.phone}}</span>
        </div>
        <img class="cardheader_foot-rtimg" src="../../assets/stores/topright.png" />
      </div>
    </div>
    <div class="container">
      <div :key="index" class="container__comtent" v-for="(coupon,index) in coupons.course_package">
        <div class="comtent__left">
          <img :src="coupon.img_url" class="left__img" />
          <div class="left__text">
            <span class="left__text--name">{{coupon.course_package_name}}</span>
            <span class="left__text--deadline">剩余{{coupon.res_count}}个</span>
            <div class="left__text--price">
              <span class="left__text--original">过期时间：{{coupon.expired_time}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import param from '@utils/url-param'

export default {
  components: {},
  data() {
    return {
      accounts: {},
      coupons: []
    }
  },
  watch: {},
  methods: {
    list() {
      this.$http.get('/personal/info').then(res => {
        this.accounts = res.data
      })
    },
    couponsList() {
      this.$http.get('/personal/coursePackage').then(res => {
        this.coupons = res.data
      })
    }
  },
  created() {
    this.list()
    this.couponsList()
  }
}
</script>
