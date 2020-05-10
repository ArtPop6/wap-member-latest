<template>
  <div class="course">
    <div class="header"></div>
    <div class="title">
      <div class="title__left">
        <img :src="info" class="title__left--img" />
      </div>
      <span class="title__name">{{coursePreview.nick_name}}</span>
      <span class="title__type">{{courseDetail.course_type}}</span>
      <span class="title__price">&yen;{{courseDetail.price}}</span>
    </div>
    <div class="container">
      <div class="container__center">
        <!-- <div class="center__time">
          <span class="center__time--icon"></span>
          <span class="center__time--title">约课时间段</span>
        </div>
        <div class="center__section">
          <div class="center__section--time">08:00-08:45</div>
          <div class="center__section--time">08:00-08:45</div>
          <div class="center__section--time">08:00-08:45</div>
          <div class="center__section--time">08:00-08:45</div>
          <div class="center__section--time">08:00-08:45</div>
          <div class="center__section--time">08:00-08:45</div>
        </div>
        <span class="center__line"></span>-->
        <div class="center__info">
          <span class="center__info--type">时间</span>
          <span class="center__info--time">{{coursedate}} {{courseDetail.begin_time}}-{{courseDetail.end_time}}</span>
        </div>
        <div class="center__info">
          <span class="center__info--type">门店</span>
          <span class="center__info--time">{{courseDetail.store_name}}</span>
        </div>
        <div class="center__info">
          <span class="center__info--type">教练</span>
          <span class="center__info--time">{{courseDetail.coach_nick_name}}</span>
        </div>
        <div class="center__info">
          <span class="center__info--type">类型</span>
          <span class="center__info--time">{{courseDetail.course_type}}</span>
        </div>
        <div class="center__info">
          <span class="center__info--type">位置</span>
          <span class="center__info--time">{{courseDetail.timetable_id}}</span>
        </div>
      </div>
      <div class="container__pay">
        <div class="pay__time">
          <span class="pay__time--icon"></span>
          <span class="pay__time--title">支付方式</span>
        </div>
        <div class="pay__way">
          <van-radio-group v-model="radio">
            <van-radio @click="change()" checked-color="#FFDE00" class="way__select" icon-size="18px" name="wechat_pay">
              <span class="way__wx">{{wetchatPay.pay_name}}</span>
              <span class="way__price">&yen;{{wetchatPay.price}}/人</span>
            </van-radio>
            <van-radio
              checked-color="#FFDE00"
              class="way__select"
              disabled
              icon-size="18px"
              name="coupon_pay"
              v-if="!couponPay.status"
            >
              <span class="way__wx">{{couponPay.pay_name}}</span>
              <span class="way__discounts">优惠</span>
              <span class="way__package">
                无可用课包
                <img class="way__img" src="./img/right.png" />
              </span>
            </van-radio>
            <van-radio
              @click="goBackage()"
              checked-color="#FFDE00"
              class="way__select"
              icon-size="18px"
              name="coupon_pay"
              v-if="couponPay.status"
            >
              <span class="way__wx">{{couponPay.pay_name}}</span>
              <span class="way__discounts">优惠</span>
              <span class="way__package" v-if="!courseId">
                可用课包
                <img class="way__img" src="./img/right.png" />
              </span>
              <span class="way__package" v-if="courseId">
                {{couponPay.coupon_name}}
                <img class="way__img" src="./img/right.png" />
              </span>
            </van-radio>
          </van-radio-group>
        </div>
      </div>
      <!-- <div class="container__foot">
        <div class="container__rule">取消规则</div>
        <div class="container__text">{{books.role}}</div>
      </div>-->
    </div>
    <div class="foot">
      <span class="foot__price">合计&nbsp;&nbsp;&yen;&nbsp;{{books.total_price}}</span>
      <!-- <div @click="submit" class="foot__affirm">确认下单</div> -->
      <van-button @click="submit" class="foot__affirm" color="#fcdb00">确认下单</van-button>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import param from '@utils/url-param'
import toast from '../../components/toast'

export default {
  components: {},
  data() {
    return {
      radio: 'wechat_pay',
      books: {},
      info: '',
      sprice: 0,
      coursePreview: {},
      courseDetail: {},
      wetchatPay: {},
      couponPay: {},
      // vipCard: {},
      price: '',
      coursedate: '',
      courseId: param('course_id'),
      course_product_id: param('product_id'),
      skuid: param('sku_id'),
      timetable_id: param('timetable'),
      space_number: param('seat'),
      store_id: param('store_id'),
      date: param('date'),
      orderid: ''
    }
  },
  watch: {},
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
      const book = {
        course_product_id: param('product_id'),
        // course_product_sku_id: param('sku_id'),
        time_table_id: param('timetable'),
        space_number: param('seat'),
        date: this.date,
        // pay_way: 'wechat_pay',
        user_coupon_id: ''
        // orderid: ''
      }
      this.$http.get('./group_exercise/book', { params: book }).then(res => {
        this.books = res.data
        this.sprice = res.data.total_price
        this.coursePreview = res.data.coach_info
        this.info = res.data.coach_info.avatar_url
        this.courseDetail = res.data.book_detail
        this.coursedate = res.data.book_detail.date.slice(5, 7) + '月' + res.data.book_detail.date.slice(8, 11) + '日'
        this.wetchatPay = res.data.wechat_pay
        this.couponPay = res.data.coupon_pay
        this.price = res.data.wechat_pay.price
      })
    },
    goBackage() {
      console.log(this.radio)
      // this.pay_way = this.radio
      go(
        `./usePackage.html?select_id=${this.courseId}&product_id=${this.course_product_id}&timetable=${this.timetable_id}&space=${this.space_number}&storeid=${this.store_id}&date=${this.date}&sku_id=${this.skuid}`
      )
    },
    change() {
      console.log(this.radio)
      this.pay_way = this.radio
      const book = {
        course_product_id: param('product_id'),
        // course_product_sku_id: param('sku_id'),
        time_table_id: param('timetable'),
        space_number: param('seat'),
        date: this.date,
        // pay_way: this.radio,
        user_coupon_id: ''
      }
      this.$http.get('./group_exercise/book', { params: book }).then(res => {
        this.books = res.data
        this.sprice = res.data.total_price
        this.coursePreview = res.data.coach_info
        this.courseDetail = res.data.book_detail
        this.info = res.data.coach_info.avatar_url
        this.coursedate = res.data.book_detail.date.slice(5, 7) + '月' + res.data.book_detail.date.slice(8, 11) + '日'
        this.wetchatPay = res.data.wechat_pay
        this.couponPay = res.data.coupon_pay
        this.price = res.data.wechat_pay.price
      })
    },
    submit() {
      if (this.radio === 'coupon_pay' && param('course_id')) {
        if (this.sprice == 10001) {
          const postData = {
            timetable_id: this.timetable_id,
            space_number: param('seat'),
            course_sku_id: param('sku_id'),
            course_product_id: this.course_product_id,
            store_id: this.store_id,
            user_coupon_id: this.courseId,
            date: this.date
          }
          const that = this
          this.$http
            .post(`orders/groupCourses/payment`, postData)
            .then(res => {
              that.orderid = res.data.order_number
              go(`./orderDetail.html?order_num=${that.orderid}`)
            })
            .catch(err => {
              if (err.data == 10001) {
                toast('您已经预约该课程！')
              }
            })
        } else {
          const postData = {
            timetable_id: this.timetable_id,
            space_number: param('seat'),
            course_sku_id: param('sku_id'),
            course_product_id: this.course_product_id,
            store_id: this.store_id,
            user_coupon_id: this.courseId,
            date: this.date
          }
          console.log(postData)
          const that = this
          this.$http
            .post(`orders/groupCourses/payment`, postData)
            .then(res => {
              that.orderid = res.data.order_number
              wx.chooseWXPay({
                timestamp: res.data.payment_info.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.payment_info.nonce_str, // 支付签名随机串，不长于 32 位
                package: res.data.payment_info.package_value, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.data.payment_info.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.payment_info.pay_sign, // 支付签名
                success: function(res) {
                  // 支付成功后的回调函数
                  alert(JSON.stringify(res))
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('恭喜您！支付完成，已成功预约。')
                },
                cancel: function(res) {
                  // 取消支付时的回调函数
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('已取消支付')
                },
                fail: function(res) {
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('支付失败，请重试')
                }
              })
            })
            .catch(err => {
              if (err.data == 10001) {
                toast('您已经预约该课程！')
              }
            })
        }
      } else {
        if (this.sprice == 0) {
          const postData = {
            timetable_id: this.timetable_id,
            space_number: param('seat'),
            course_sku_id: param('sku_id'),
            course_product_id: this.course_product_id,
            store_id: this.store_id,
            user_coupon_id: '',
            date: this.date
          }
          console.log(postData)
          const that = this
          this.$http
            .post(`/orders/groupCourses/payment`, postData)
            .then(res => {
              that.orderid = res.data.order_number
              go(`./orderDetail.html?order_num=${that.orderid}`)
            })
            .catch(err => {
              if (err.data == 10001) {
                toast('您已经预约该课程！')
              }
            })
        } else {
          const postData = {
            timetable_id: this.timetable_id,
            space_number: param('seat'),
            course_sku_id: param('sku_id'),
            course_product_id: this.course_product_id,
            store_id: this.store_id,
            user_coupon_id: '',
            date: this.date
          }
          console.log(postData)
          const that = this
          this.$http
            .post(`/orders/groupCourses/payment`, postData)
            .then(res => {
              that.orderid = res.data.order_number
              wx.chooseWXPay({
                timestamp: res.data.payment_info.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.payment_info.nonce_str, // 支付签名随机串，不长于 32 位
                package: res.data.payment_info.package_value, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.data.payment_info.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.payment_info.pay_sign, // 支付签名
                success: function(res) {
                  // 支付成功后的回调函数
                  alert(JSON.stringify(res))
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('恭喜您！支付完成，已成功预约。')
                },
                cancel: function(res) {
                  // 取消支付时的回调函数
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('已取消支付')
                },
                fail: function(res) {
                  go(`./orderDetail.html?order_num=${that.orderid}`)
                  toast('支付失败，请重试')
                }
              })
            })
            .catch(err => {
              if (err.data == 10001) {
                toast('您已经预约该课程！')
              }
            })
        }
      }
    },
    radios() {
      if (param('course_id')) {
        this.radio = 'coupon_pay'
        const book = {
          course_product_id: param('product_id'),
          // course_product_sku_id: param('sku_id'),
          time_table_id: param('timetable'),
          space_number: param('seat'),
          // pay_way: this.radio,
          user_coupon_id: this.courseId,
          date: this.date
        }
        this.$http.get('./group_exercise/book', { params: book }).then(res => {
          this.books = res.data
          this.sprice = res.data.total_price
          this.coursePreview = res.data.coach_info
          this.courseDetail = res.data.book_detail
          this.info = res.data.coach_info.avatar_url
          this.coursedate = res.data.book_detail.date.slice(5, 7) + '月' + res.data.book_detail.date.slice(8, 11) + '日'
          this.wetchatPay = res.data.wechat_pay
          this.couponPay = res.data.coupon_pay
          this.price = res.data.wechat_pay.price
        })
      } else {
        this.radio = 'wechat_pay'
        this.list()
      }
    }
  },
  created() {
    // this.list()
    this.radios()
  },
  mounted() {
    this.wxJsApiinit()
  },
  beforeMount() {}
}
</script>
