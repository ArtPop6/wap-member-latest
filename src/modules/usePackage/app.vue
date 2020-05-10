<template>
  <div class="package">
    <van-radio-group v-model="radio">
      <!-- <div class="head">
        <span class="head__left">不使用课包</span>
        <van-radio :name="coupo.empty" @click="change()" checked-color="#FFDE00" class="way__select" icon-size="18px"></van-radio>
      </div>-->
      <div :class="coupon.enable=='false'?'show':''" :key="index" class="center" v-for="(coupon,index) in coupo">
        <div class="center__top">
          <div class="top__pack">
            <span class="center__top--package">{{coupon.res_count}}个课包</span>
            <div class="centre__top--right">
              <span class="center__top--name">{{coupon.course_package_name}}</span>
              <span class="center__top--time">当前有效期{{coupon.expired_time}}</span>
            </div>
          </div>
          <div class="center__top--radio">
            <van-radio
              :name="coupon.user_coupon_id"
              checked-color="#FFDE00"
              class="way__select"
              disabled
              icon-size="18px"
              v-if="!coupon.enable"
            ></van-radio>
            <van-radio
              :name="coupon.user_coupon_id"
              @click="change()"
              checked-color="#FFDE00"
              class="way__select"
              icon-size="18px"
              v-if="coupon.enable"
            ></van-radio>
          </div>
        </div>
        <div class="center__bootom">
          <div class="bootom__hint" v-if="!coupon.enable">
            <img class="bootom__hint--img" src="./img/hint.png" />
            <span class="bootom__hint--explain">不可用原因：{{coupon.mark}}</span>
          </div>
          <div :key="index" class="bootom__hint--text" v-if="coupon.enable">
            限
            <span :key="index" class="hint__text--type" v-for="(types,index) in coupon.course_package_type">{{types}}</span>可用
          </div>
        </div>
      </div>
    </van-radio-group>
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
      radio: '',
      coupo: [],
      product: param('product_id'),
      sku: param('sku_id'),
      timeid: param('timetable'),
      spaceid: param('space'),
      store_id: param('storeid'),
      date: param('date')
    }
  },
  watch: {},
  methods: {
    list() {
      this.$http.get(`./coursePackage/userCourse?id=${this.product}`).then(res => {
        this.coupo = res.data
        console.log(this.coupo)
      })
      this.select()
    },
    change() {
      console.log(this.radio)
      go(
        `./courseOrder.html?course_id=${this.radio}&product_id=${this.product}&sku_id=${this.sku}&timetable=${this.timeid}&seat=${this.spaceid}&store_id=${this.store_id}&date=${this.date}`
      )
    },
    select() {
      this.radio = param('select_id') - 0
    }
  },

  created() {
    this.list()
    this.select()
  }
}
</script>
