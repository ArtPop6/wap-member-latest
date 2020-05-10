<template>
  <div class="course">
    <div class="container">
      <van-pull-refresh @refresh="onRefresh" v-model="refreshing">
        <van-list :finished="finished" @load="onLoad" finished-text="没有更多了" v-model="loading">
          <van-cell
            :class="selectindex==groups.coupon_product_sku_id?'container__selct':''"
            :data-couponid="groups.course_package_id"
            :data-id="groups.coupon_product_sku_id"
            :data-price="groups.totail_price"
            :data-proid="groups.coupon_product_id"
            :data-save="groups.save"
            :key="index"
            @click="select"
            class="container__comtent"
            v-for="(groups,index) in enterAll"
          >
            <div class="comtent__left">
              <img :src="groups.img_url" class="left__img" />
              <div class="left__text">
                <span class="left__text--name">{{groups.course_package_name}}</span>
                <span class="left__text--deadline">使用期限：下单后{{groups.time_limited}}天内</span>
                <div class="left__text--price">
                  <span class="left__text--original">原价&yen;{{groups.original_price}}/{{groups.unit}}</span>
                  <span class="left__text--backprice">课包价&yen;{{groups.current_price}}/{{groups.unit}}</span>
                </div>
              </div>
              <span class="comtent__right">{{groups.count}}个</span>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="foot">
      <span class="foot__province">为你省了&yen;{{saveprice}}</span>
      <div class="foot__place">
        <span class="foot__place--price">
          <span class="place__priceplace--total">合计</span>
          <span class="place__priceplace--price">&yen;{{totalprice}}</span>
        </span>
        <van-button @click="confirm()" class="foot__place--confirm" color="#fcdb00" text="rgba(43,44,49,1)">确认下单</van-button>
      </div>
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
      selectindex: 0,
      group: [],
      preview: {},
      totalprice: 0,
      saveprice: 0,
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      page: 1,
      size: 10,
      enterAll: [],
      allItems: 0,
      productid: '',
      couponid: '',
      orderid: '',
      timetable: param('timetable'),
      date: param('date')
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
      const packData = {
        course_product_id: param('course_product_sku_id'),
        page: this.page,
        size: this.size
      }
      this.page++
      this.$http
        .get(`/coursePackage`, { params: packData })
        .then(res => {
          this.group = res.data
          // this.totalprice = this.group.items[0].totail_price
          // this.saveprice = this.group.items[0].save
          this.enterAll = this.enterAll.concat(res.data.items)
          this.total = this.group.total
          this.allItems = this.allItems + res.data.items.length
          this.loading = false
          if (this.allItems >= this.total) {
            this.finished = true
          }
          console.log('enterall', this.enterAll)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    select(e) {
      this.selectindex = e.currentTarget.dataset.id
      this.totalprice = e.currentTarget.dataset.price
      this.saveprice = e.currentTarget.dataset.save
      this.productid = e.currentTarget.dataset.proid
      this.couponid = e.currentTarget.dataset.couponid
      console.log(this.selectindex)
      console.log(this.totalprice)
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.enterAll = []
          this.page = 1
          this.allItems = 0
          this.refreshing = false
        }
        this.list()
      }, 500)
    },
    onRefresh() {
      // 清空列表数据
      // this.enterAll = []
      this.finished = false
      // Toast('刷新成功')
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    confirm() {
      if (!this.selectindex) {
        toast('请点击选择需要购买的课包')
      } else {
        const packData = {
          coupon_product_sku_id: this.selectindex,
          coupon_product_id: this.productid,
          store_id: param('store_id')
        }
        console.log(packData)
        const that = this
        this.$http.post(`/orders/coursePackages/payment`, packData).then(res => {
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
              go(`./orderDetail.html?order_num=${that.orderid}&timetable=${this.timetable}&date=${this.date}`)
              toast('恭喜您！支付完成，已成功预约。')
            },
            cancel: function(res) {
              // 取消支付时的回调函数
              go(`./orderDetail.html?order_num=${that.orderid}&timetable=${this.timetable}&date=${this.date}`)
              toast('已取消支付')
            },
            fail: function(res) {
              go(`./orderDetail.html?order_num=${that.orderid}&timetable=${this.timetable}&date=${this.date}`)
              toast('支付失败，请重试')
            }
          })
        })
      }
    }
  },
  created() {},
  mounted() {
    this.wxJsApiinit()
  }
}
</script>
