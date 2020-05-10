<template>
  <div>
    <yd-popup :close-on-masker="false" position="center" v-model="showMake" width="90%">
      <div style="background-color:#fff;">
        <div class="top">
          <span class="top_one">预约教练</span>
          <div @click="close" class="top_two"></div>
        </div>
        <div class="center">
          <div class="center_top">
            <div class="center_top-types">请选择课程类型:</div>
            <div :key="index" v-for="(item,index) in course">
              <div
                :class="{'center_top-select': currentSelected === `${index}`}"
                :data-id="`${index}`"
                @click="select"
                class="center_top-noselect"
              >{{item.course_cate_name}}</div>
            </div>
          </div>
          <p>
            <span class="center_top-type">您课程剩余：</span>
            <span>{{pitch.count}}节</span>
          </p>
          <p>
            <span class="center_top-type">当前选择课程：</span>
            <span class="bg">{{pitch.course_name}}</span>
          </p>
          <p>
            <span class="center_top-type">
              当前选择门店：
              <span class="bg">{{pitch.store_name}}</span>
            </span>
          </p>
          <div v-if="pitch.count === 0">
            <div class="payment">
              <span class="center_top-type shopping">购买：</span>
              <div @click="min" class="min"></div>
              <input @blur="blurText($event)" class="knob" type="number" v-model="buy" />
              <div @click="add" class="add"></div>
              <span class="center_top-type joint">节</span>
              <span class="attention">最少({{pitch.min_sale}})节</span>
            </div>
            <p>
              <span class="center_top-type">单价：</span>
              <span class="price">&yen;{{pitch.price}}</span>
              <span class="member_price">会员价：&yen;{{pitch.mem_price}}</span>
            </p>
            <p>
              <span class="center_top-type">总价：</span>
              <span class="yen">&yen;</span>
              <input class="price" disabled="disabled" v-model="sum" />
            </p>
          </div>
          <div class="confirm_bottom">
            <div class="confirm_bottm_left">
              <div class="consent">
                <input
                  @click="checkedAll(items)"
                  class="agreement"
                  name="vehicle"
                  type="checkbox"
                  v-model="items.state"
                />我已经详细阅读并同意
                <span @click="protocol" class="consent_protocol">无竞悦动</span>相关协议
              </div>
              <div @click="refer" class="confirm">确定</div>
            </div>
          </div>
        </div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
import go from '@utils/goto'
import toast from '../../../components/toast'

const DEFAULT_OPS = {
  selected: '0'
}

export default {
  props: ['course', 'isShow', 'showMake', 'postData'],
  watch: {
    course(newVal, oldVal) {
      this.pitch = newVal[this.currentSelected]
      this.buy = this.pitch.min_sale
    }
  },
  computed: {
    sum() {
      if (!this.buy) {
        return 0
      } else {
        return (this.buy * this.pitch.price).toFixed(2)
      }
    }
  },

  data() {
    return {
      currentSelected: DEFAULT_OPS.selected,
      pitch: [],
      noshow: false,
      buy: '',
      items: [],
      renewal: 1
    }
  },

  methods: {
    select(e) {
      this.currentSelected = e.currentTarget.dataset.id
      this.pitch = this.course[this.currentSelected]
      this.buy = this.pitch.min_sale
    },
    close() {
      this.$emit('showvalue', false)
      this.$emit('close')
      this.reset()
    },
    changeStatus() {
      if (this.pitch.count === 0) {
        this.showPrise = true
      } else {
        this.showPrise = false
      }
    },
    add() {
      this.buy = parseInt(this.buy) + 1
    },
    min() {
      if (this.buy > 0) {
        this.buy = parseInt(this.buy) - 1
      }
    },
    blurText(e) {
      const boolean = new RegExp('^[1-9][0-9]*$').test(e.target.value)
      if (!boolean) {
        alert('请输入大于0的整数')
        e.target.value = ''
      }
    },
    checkedAll(items) {
      items.state = !items.state
    },
    refer() {
      if (this.items.state === true) {
        if (this.pitch.count <= 0) {
          if (this.buy < this.pitch.min_sale) {
            alert('该课程最少购买' + this.pitch.min_sale + '节起')
          } else {
            const postData = {
              begin_date: this.postData.beginData,
              end_date: this.postData.beginData,
              begin_time: this.postData.beginTime.slice(0, 5) + ':00',
              end_time: this.postData.beginTime.slice(8, 13) + ':00',
              coach_id: this.postData.coachId,
              count: this.buy,
              course_cate_id: this.pitch.course_cate_id,
              course_id: this.pitch.course_id,
              store_id: this.pitch.store_id
            }
            const that = this
            this.$http
              .post(`/orders/courses`, postData)
              .then(res => {
                wx.chooseWXPay({
                  timestamp: res.data.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: res.data.nonce_str, // 支付签名随机串，不长于 32 位
                  package: res.data.package_value, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                  signType: res.data.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: res.data.pay_sign, // 支付签名
                  success: function(res) {
                    // 支付成功后的回调函数
                    alert(JSON.stringify(res))
                    that.$emit('courses')
                    toast('恭喜您！支付完成，已成功预约。')
                  },
                  cancel: function(res) {
                    // 取消支付时的回调函数
                    that.$emit('courses')
                    toast('已取消支付')
                  },
                  fail: function(res) {
                    toast('支付失败，请重试')
                  }
                })
              })
              .catch(err => {
                this.$emit('showvalue', false)
                console.log(err)
              })
          }
        } else {
          this.submit()
        }
      } else {
        alert('请勾选同意左边的协议，既可预约')
      }
    },
    submit() {
      const postDatas = {
        begin_time: this.postData.beginTime.slice(0, 5) + ':00',
        end_time: this.postData.beginTime.slice(8, 13) + ':00',
        begin_date: this.postData.beginData,
        end_date: this.postData.beginData,
        coach_id: this.postData.coachId,
        count: this.pitch.count,
        course_cate_id: this.pitch.course_cate_id,
        course_cate_name: this.pitch.course_cate_name,
        course_id: this.pitch.course_id,
        store_id: this.pitch.store_id,
        store_name: this.pitch.store_name,
        type: this.pitch.type
      }
      this.$http
        .post('/course', postDatas)
        .then(res => {
          toast('恭喜您，预约成功')
          this.renewal++
          this.$emit('renewals', this.renewal)
          this.$emit('showvalue', false)
          this.reset()
        })
        .catch(err => {
          this.$emit('showvalue', false)
          console.log(err)
        })
    },
    reset() {
      this.pitch = this.course[DEFAULT_OPS.selected]
      this.currentSelected = DEFAULT_OPS.selected
      this.buy = this.pitch.min_sale
    },
    protocol() {
      go(`./agreement.html`)
    }
  },
  created() {}
}
</script>
<style lang="stylus" scoped>
.top
  display flex
  height 130px
  background-color black
  width 100%

.top_one
  color rgb(247, 247, 28)
  font-size 30px
  height 70px
  margin auto 20px
  line-height 70px

.top_two
  position absolute
  right 20px
  width 70px
  border-radius 50px
  height 70px
  top 30px
  background url('../../../assets/stores/no.png') no-repeat

.center
  display flex
  flex-direction column
  padding-left 20px

.center_top
  display flex
  flex-wrap wrap

.center_top-type
  font-size 30px

.center_top-types
  padding 0 !important
  font-size 30px
  top 10px
  height 50px
  line-height 50px
  margin 20px 10px 10px 0px

.bg
  font-size 28px
  text-align center
  margin auto 0
  padding 6px 10px
  background-color #fcdb00
  border-radius 10px

select
  width 260px
  background url('../../../assets/stores/down.png') center right no-repeat

.center_top-noselect
  height 60px
  line-height 42px
  text-align center
  font-size 22px
  margin 10px
  border-radius 15px
  width auto
  background #b3b3b3
  padding 10px

.center_top-select
  background #FCDB00

.shopping
  text-align center
  margin auto 0

.min
  width 36px
  background url('../../../assets/stores/minus.png') center right no-repeat

.add
  width 36px
  background url('../../../assets/stores/add.png') center right no-repeat

.joint
  text-align center
  margin auto 20px auto 10px

.payment
  display flex

.center p
  height auto
  line-height 50px
  font-size 30px

.knob
  width 80px
  height 40px
  line-height 48px
  font-size 30px
  text-align center
  border 1px solid #666666
  margin 10px

.attention
  text-align center
  margin auto 0
  font-size 24px
  color #f57576

.yen
  color #7a7a7a

.price
  border 0
  outline none
  color #7a7a7a
  margin-left 0

.price, input[disabled], input:disabled, input.disabled
  color #999
  -webkit-text-fill-color #999
  -webkit-opacity 1
  opacity 1

.member_price
  font-size 24px
  color #FC0000
  margin-left 40px

.confirm_bottom
  display flex
  align-items flex-end
  justify-content space-between

.confirm_bottm_left
  display flex
  justify-content space-between
  width 750px
  margin auto 0

.agreement
  margin auto 0
  padding 0
  height 36px
  width 36px
  margin-right 6px

.consent
  margin auto 0
  font-size 24px
  width 400px

.consent_protocol
  color blue

.confirm
  right 0
  width 150px
  height 80px
  line-height 80px
  text-align center
  background #fcdb00
  font-size 30px
  margin 30px 30px
  border-radius 15px
  color #000
</style>