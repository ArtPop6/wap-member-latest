<template>
  <div class="order-wrap">
    <div class="order-type">
      <div class="order-desc">
        <div class="icon-tip" v-if="transacState.success || transacState.close">
          <img
            :src="transacState.success === true ? require('./img/success.png') : require('./img/fail.png')"
            alt
            class="order-icon"
          />
          <span
            class="order-tip"
          >{{transacState.close === true ? '交易关闭' : transacState.success === true ? '交易成功' : '' }}</span>
        </div>
        <div class="state_wait" v-if="transacState.wait">
          <span class="state_wait--title">待付款</span>
          <span class="remain-time">
            剩&nbsp;
            <van-count-down :time="time" @finish="countFinish" class="formate-time" format="HH时mm分ss秒"/>&nbsp;自动关闭
          </span>
        </div>
      </div>
      <img class="decorate-pic" src="./img/barbell.png"/>
    </div>
    <div class="order-detail">
      <div class="personal-info">
        <img :src="userInfo.avatar" alt class="avatar"/>
        <div class="right-part">
          <div class="nick-name">{{userInfo.memberName}}</div>
          <div class="tele">{{userInfo.phone}}</div>
        </div>
      </div>

      <div class="order-items">
        <div class="order-items__title">商品详情</div>

        <div :key="index" class="card-info" v-for="(card, index) in cards">
          <div class="card-pic">
            <!-- :style="{backgroundUrl: 'url(' + this.imgUrl + ')' + ' ' + 'no-repeat', backgroundSize: '100%' + '100%'}" -->
            <!-- <img alt class="card-pic" src="../../assets/confirm_order/godness.png" /> -->
            <van-image
              :src="card.product.cover_img_url"
              class="card-pic__url"
              fit="fill"
              radius="7"
            >
              <template v-slot:loading>
                <van-loading size="20" type="spinner"/>
              </template>
            </van-image>
            <!-- <div class="card-pic-type">自由馆</div>
            <div class="card-pic-desc">爱Ta/就送Ta/</div>-->
          </div>
          <div class="card-desc">
            <div class="card-name">
              <span class="type-name">{{card.product.name}}</span>
              <span :class="[typeColor(card.product.category.name)]" class="type-time">{{card.product.category.name}}</span>
            </div>
            <div class="card-site">{{card.product.sub_title}}</div>
            <!-- <div class="apply">
            <div class="apply__desc">适用:&nbsp;</div>
            <div class="apply__stores">
              <span :key="index" class="store-tag" v-for="(item, index) in cardInfo.cardStores">{{item.name}}</span>
            </div>
            </div>-->

            <div class="card-num">
              <!-- card.unit_price ? (card.unit_price).toFixed(2) : ''-->
              <span class="pay-price">￥{{(!!card.unit_price || card.unit_price === 0) ? (card.unit_price).toFixed(2) : ''}}</span>
              <span class="pay-num">X{{card.count}}</span>
            </div>
          </div>
        </div>

        <div class="items-price__desc">
          <div class="coupon" v-if="coupon">
            <div class="coupon-title">优惠券、课包</div>
            <div class="coupon-price">-￥{{coupon}}</div>
          </div>
          <div class="items-price">
            <div class="items-price__title">商品总价</div>
            <div class="items-price__num">￥{{totalPricetoFix}}</div>
          </div>
        </div>
      </div>

      <div class="order-info">
        <span class="order-title">订单信息</span>
        <span class="order-number">
          <span class="order-number__title">订单编号:&nbsp;&nbsp;&nbsp;</span>
          <span class="order-number__num">{{orderNumber}}</span>
        </span>
        <span class="create-time">
          <span class="create-time__title">创建时间:&nbsp;&nbsp;&nbsp;</span>
          <span class="time">{{createTime}}</span>
        </span>
        <span class="pay-time" v-if="transacState.success">
          <span class="pay-time__title">付款时间:&nbsp;&nbsp;&nbsp;</span>
          <span class="time">{{paymentTime}}</span>
        </span>
      </div>
    </div>

    <div class="go-home" @click="goHome">
      <!--      <img src="./img/home.png" alt="" class="home-pic">-->
      <van-icon name="home-o" color="#fff" size="22px"/>
    </div>

    <!-- 待付款时底部内容 -->
    <div class="pay-info" v-if="transacState.wait">
      <div class="sum-price">
        合计:
        <!-- <span class="price-title">￥{{(totalPrice).toFixed(2)}}</span> -->
        <span class="price-title">￥{{totalPricetoFix}}</span>
      </div>
      <van-button
        :loading="loading"
        @click="payOrderAgain"
        class="pay-btn"
        loading-text="购买中..."
        loading-type="spinner"
        type="primary"
      >立即购买
      </van-button>
    </div>
    <!-- 交易成功时底部内容 -->
    <div class="pay-info" v-if="transacState.success">
      <div class="sum-price">
        合计:
        <!-- <span class="price-title">￥{{(totalPrice).toFixed(2)}}</span> -->
        <span class="price-title">￥{{totalPricetoFix}}</span>
      </div>
      <van-button
        :loading="loading"
        @click="goAppoint()"
        class="pay-btn"
        loading-text="购买中..."
        loading-type="spinner"
        type="primary"
        v-if="packOrder"
      >去约课
      </van-button>
    </div>
    <!-- 交易关闭底部内容显示 -->
    <div class="pay-info" v-if="transacState.close">
      <div class="sum-price">
        合计:
        <!-- <span class="price-title">￥{{(totalPrice).toFixed(2)}}</span> -->
        <span class="price-title">￥{{totalPricetoFix}}</span>
      </div>
    </div>

    <!-- <div class="pay-again" v-if="transacState.success && orderType === 'group'">再次购买</div>
    <div class="goAppoint" v-if="transacState.success && orderType === 'pack'">
      <div @click="goAppoint" class="getClass">去约课</div>
    </div>-->
  </div>
</template>
<script>
  import './style.stylus'
  import go from '@utils/goto'
  import param from '@utils/url-param'
  import toast from '../../components/toast'
  import './orderDetail.styl'

  // const orderInfo = [
  //   {
  //     id: 11,
  //     count: 1,
  //     product_sku: {
  //       id: 10,
  //       price: 99.99
  //     },
  //     product: {
  //       id: 10,
  //       name: '商品名称',
  //       sub_title: '爱他,就送她',
  //       cover_img_url: 'http://www.baidu.com/logo.png',
  //       category: {
  //         id: 10,
  //         code: 'MONTH',
  //         name: '月卡',
  //         value: 30
  //       }
  //     },
  //     store_id: 10,
  //     total_price: 0.0
  //   }
  // ]

  export default {
    components: {},
    data () {
      return {
        userInfo: {
          avatar: null,
          memberName: null,
          phone: null
        },
        createTime: '',
        paymentTime: '',
        transacState: {
          wait: false,
          success: false,
          close: false
        },
        loading: false,
        time: 0,
        orderNumber: param('order_num'),
        cards: [],
        totalPrice: null,
        channel: param('channel'),
        orderType: 'pack',
        packOrder: false,
        coupon: 0,
        // 用于课包购买成功去约课
        timetable: param('timetbale'),
        date: param('date')
      }
    },
    computed: {
      typeColor () {
        return function (cardType) {
          if (cardType === '月卡') {
            return 'yellow'
          }
          if (cardType === '季卡') {
            return 'orange'
          }
          if (cardType === '次卡') {
            return 'blue'
          }
          if (cardType === '年卡') {
            return 'pink'
          }
          return 'default'
        }
      },
      totalPricetoFix () {
        if (this.totalPrice === null || this.totalPrice === undefined || this.totalPrice === '') {
          return ''
        }
        return this.totalPrice.toFixed(2)
      }
    },
    watch: {},
    methods: {
      wxJsApiinit () {
        const urls = './auth/config/jsapi' // 获取后台数据接口url
        const datas = { page_url: location.href.split('#')[0] }
        this.$http
          .get(urls, { params: datas })
          .then(res => {
            wx.config({
              debug: false,
              appId: res.data.app_id,
              timestamp: res.data.timestamp,
              nonceStr: res.data.nonce_str,
              signature: res.data.signature,
              jsApiList: ['chooseWXPay']
            })
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获取结果之后，config是一个客户端的异步操作，所以如果要在页面加载时就调用相关接口，
            // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
            wx.ready(function () {
              console.log('接口调用成功')
            })
            // 通过error接口处理失败验证，config信息验证失败会执行error函数，如签名过期导致验证失败
            wx.error(res => {
              console.log('接口调用失败')
            })
          })
          .catch(err => {
            console.log('支付接口调用失败', err)
          })
      },
      // 再次购买卡片
      payOrderAgain () {
        this.loading = true
        if (this.transacState.wait === true) {
          this.gotoPay()
          return
        }
        if (this.transacState.close === true) {
          go(
            `./confirmOrder.html?store_id=${this.cards[0].store_id}&product_id=${this.cards[0].product.id}&sku_id=${this.cards[0].product_sku.id}&channel=${this.channel}`
          )
        }
      },
      // 通过订单号来获取订单各种信息
      getOrderInfo () {
        // const data = {
        //   order_id: this.orderNumber
        // }
        this.$http
          .get(`./orders/groupCourses/${this.orderNumber}`)
          .then(res => {
            switch (res.data.state) {
              case 'WAITING':
                this.transacState.wait = true
                break
              case 'SUCCESS':
                this.transacState.success = true
                break
              case 'CLOSED':
                this.transacState.close = true
                break
              case 'FAIL':
                alert('支付失败')
                break
              case 'REFUND':
                alert('退款')
                break
              default:
                this.transacState.wait = false
                this.transacState.success = false
                this.transacState.close = false
            }
            // 循环数组查看是否有课包订单的一项，如果有则orderPack设为true
            // this.transacState.success = true
            console.log(this.transacState)
            // 订单信息
            this.time = res.data.rest_time
            this.orderNumber = res.data.order_number
            this.createTime = res.data.create_time
            this.paymentTime = res.data.payment_time
            this.totalPrice = res.data.total_price_final
            // 订单物品信息
            this.cards = res.data.order_items
            // 用户信息
            this.userInfo.avatar = res.data.buyer.img_url
            this.userInfo.memberName = res.data.buyer.nick_name
            this.userInfo.phone = res.data.buyer.phone
            // 课包减免
            this.coupon = res.data.course_package_price
            // 判断订单中是否有课包的字段, 如果有课包则显示去约课
            this.packOrder = res.data.course_package_check
          })
          .catch(err => {
            console.log(err)
          })
      },
      gotoPay () {
        // console.log(postData)
        // 发给后端支付信息
        this.$http
          .put(`/orders/cards/payment/${this.orderNumber}`)
          .then(res => {
            // 根据支付信息发起微信支付请求
            function next () {
              go(`./orderDetail.html?order_num=${res.data.order_number}`)
            }

            const paymentInfo = res.data.payment_info
            this.loading = false
            wx.chooseWXPay({
              timestamp: paymentInfo.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: paymentInfo.nonce_str, // 支付签名随机串，不长于 32 位
              package: paymentInfo.package_value, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: paymentInfo.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: paymentInfo.pay_sign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                this.loading = false
                toast('支付成功')
                next()
              },
              cancel: function (res) {
                // 取消支付时的回调函数
                this.loading = false
                toast('已取消支付')
                next()
              },
              fail: function (res) {
                this.loading = false
                toast('支付失败,请重新购买')
                next()
              }
            })
          })
          .catch(err => {
            this.loading = false
            console.log('支付接口错误', err)
          })
      },
      // 倒计时结束
      countFinish () {
        this.transacState.wait = false
        this.transacState.close = true
      },
      // gotoDetail(card) {
      //   go(
      //     `./cardDetails.html?store_id=${card.store_id}&product_id=${card.product.id}&sku_id=${card.product_sku.id}&channel=${this.channel}`
      //   )
      // },
      goAppoint () {
        go(`./courseDetails.html?timetable=${this.timetable}&date=${this.date}`)
      },
      goHome () {
        go('./homePage.html')
      }
    },
    created () {
      this.getOrderInfo()
      this.wxJsApiinit()
    }
  }
</script>
