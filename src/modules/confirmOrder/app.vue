<template>
  <div class="card-wrap">
    <div class="order">
      <div class="personal-info">
        <van-skeleton
          :loading="skeLoading"
          :row="1"
          avatar
          avatar-shape="square"
          avatar-size="height: 100%"
          row-width="42%"
          title
          title-width="36%"
        >
          <img :src="userInfo.avatar" alt class="avatar" />
          <div class="right-part">
            <div class="nick-name">{{userInfo.memberName}}</div>
            <div class="tele">{{userInfo.phone}}</div>
          </div>
        </van-skeleton>
      </div>

      <div class="pay-info">
        <div class="order-number">
          <span class="order-number-title">请选择商品规格:</span>
          <!-- <span>{{orderNum}}</span> -->
          <!-- <div class="stores">
            <div :key="index" class="store-tag" v-for="(item, index) in cardInfo.cardStores">
              <div class="tag">{{item.name}}</div>
            </div>
          </div>-->
        </div>
        <div class="card">
          <div class="card-pic">
            <van-image :src="cardInfo.cardUrl" @click="clickPic" class="card-pic__url" fit="fill" radius="7">
              <template v-slot:loading>
                <van-loading size="20" type="spinner" />
              </template>
            </van-image>
            <!-- <div class="card-pic-type">自由馆</div>
            <div class="card-pic-desc">爱Ta/就送Ta/</div>-->
          </div>
          <!-- <template v-slot:error>加载失败</template> -->
          <!-- </van-image> -->
          <div class="card-desc">
            <div @click="clickPic" class="card-name">
              <span class="type-name">{{cardInfo.cardName}}</span>
              <span :class="[typeColor]" class="type-time">{{cardInfo.cardType}}</span>
            </div>
            <div class="card-site">{{cardInfo.cardApply}}</div>
            <div class="sum">
              <span class="purchase-num">购买数量</span>
              <div class="select">
                <van-stepper integer min="1" v-model="value" />
                <!-- button-size="28px" input-width="50px" -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="protocol">
        <van-checkbox class="checkbox" icon-size="16px" name="plus" v-model="checked">
          我已阅读
          <span @click="toProDetail" class="protocol-url">《卡片协议》</span>
        </van-checkbox>
        <van-dialog @cancel="reject" @confirm="accept" confirmButtonText="我同意" show-cancel-button v-model="show">
          <span class="message">
            我已阅读并同意
            <a @click="dialogToPro" class="protocol-page">《卡片协议》</a>
          </span>
        </van-dialog>
      </div>
    </div>
    <div class="price">
      <div class="sum-price">
        <span class="price-desc">
          合计:
          <span class="price-title">￥{{totalPrice}}</span>
        </span>
      </div>
      <van-button
        :loading="loading"
        @click="payOrder"
        class="pay-btn"
        loading-text="购买中..."
        loading-type="spinner"
        size="normal"
        type="primary"
      >立即购买</van-button>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import param from '@utils/url-param'
import toast from '../../components/toast'
import './confirmOrder.styl'

export default {
  components: {},
  data() {
    return {
      // color: $primary - color,
      value: 1,
      checked: false,
      totalPrice: null,
      loading: false,
      postData: {
        coachId: '',
        beginData: '',
        beginTime: ''
      },
      orderItemId: 10,
      cardUrl: '',
      show: false,
      userInfo: {
        avatar: null,
        memberName: '',
        phone: null
      },
      cardInfo: {
        cardName: '',
        cardApply: '',
        cardType: '',
        cardPrice: null,
        cardStores: [{ name: '智享新景店' }, { name: '八八八店' }, { name: 'vfsgfuyasgfysda店' }],
        cardUrl: '',
        cardId: 0,
        storeId: param('store_id'),
        productSkuId: param('sku_id'),
        productId: param('product_id')
      },
      skeLoading: true,
      channel: param('channel')
    }
  },
  computed: {
    typeColor() {
      if (this.cardInfo.cardType === '月卡') {
        return 'yellow'
      }
      if (this.cardInfo.cardType === '季卡') {
        return 'orange'
      }
      if (this.cardInfo.cardType === '次卡') {
        return 'blue'
      }
      if (this.cardInfo.cardType === '年卡') {
        return 'pink'
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.totalPrice = (newVal * this.cardInfo.cardPrice).toFixed(2)
    }
  },
  methods: {
    // 微信JSSDK授权
    wxJsApiinit() {
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
          wx.ready(function() {
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
    payOrder() {
      this.loading = true
      if (this.checked === false) {
        this.show = true
      }
      if (this.checked === true) {
        // 调用微信支付接口
        this.loading = false
        this.gotoPay()
      }
    },
    toProDetail() {
      go(`./cardProtocol.html?from=page`)
    },
    dialogToPro() {
      go(`./cardProtocol.html?from=dialog`)
    },
    reject() {
      this.loading = false
    },
    accept() {
      // this.loading = false
      this.checked = true
      this.gotoPay()
    },
    getUserInfo() {
      this.$http
        .get('./personal/info')
        .then(res => {
          this.userInfo.avatar = res.data.avatar
          this.userInfo.memberName = res.data.name
          this.userInfo.phone = res.data.phone
          this.skeLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCardInfo() {
      const data = {
        store_id: this.cardInfo.storeId,
        product_id: this.cardInfo.productId,
        product_sku_id: this.cardInfo.productSkuId
      }
      this.$http
        .get('./cards/detail', { params: data })
        .then(res => {
          this.cardInfo.cardName = res.data.name
          this.cardInfo.cardApply = res.data.apply
          this.cardInfo.cardType = res.data.type
          this.cardInfo.cardPrice = res.data.price
          this.cardInfo.cardUrl = res.data.img
          this.totalPrice = res.data.price.toFixed(2)
          this.cardInfo.cardStores = res.data.stores
        })
        .catch(err => {
          console.log(err)
        })
    },
    gotoPay() {
      const postData = {
        // order_number: this.orderNum,
        product_sku_id: this.cardInfo.productSkuId,
        store_id: this.cardInfo.storeId,
        count: this.value,
        total_price_final: this.totalPrice - 0
      }
      // 发给后端支付信息
      this.$http
        .post(`/orders/cards/payment?channel=${this.channel}`, postData)
        .then(res => {
          // 根据支付信息发起微信支付请求
          const paymentInfo = res.data.payment_info
          const orderNumber = res.data.order_number
          this.loading = false
          function next() {
            go(`./orderDetail.html?order_num=${orderNumber}`)
          }
          wx.chooseWXPay({
            timestamp: paymentInfo.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: paymentInfo.nonce_str, // 支付签名随机串，不长于 32 位
            package: paymentInfo.package_value, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: paymentInfo.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paymentInfo.pay_sign, // 支付签名
            success: function(res) {
              // 支付成功后的回调函数
              next()
              this.loading = false
              toast('支付成功')
            },
            cancel: function(res) {
              // 取消支付时的回调函数
              this.loading = false
              next()
              toast('已取消支付')
            },
            fail: function(res) {
              this.loading = false
              next()
              toast('支付失败,请重新购买')
            }
          })
        })
        .catch(err => {
          this.loading = false
          toast('支付接口错误')
          console.log(err)
        })
    },
    clickPic() {
      go(
        `./cardDetails.html?store_id=${this.cardInfo.storeId}&product_id=${this.cardInfo.productId}&sku_id=${this.cardInfo.productSkuId}`
      )
    }
  },
  created() {
    this.getUserInfo()
    this.getCardInfo()
    this.wxJsApiinit()
  }
}
</script>