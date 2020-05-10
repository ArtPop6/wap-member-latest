<template>
  <div class="order-wrap">
    <div class="user-info">
      <div class="user-info__container">
        <div class="user-info__avatar">
          <img :src="accounts.avatar" class="user-info__img"/>
        </div>
        <div class="user-info__message">
          <span class="user-info__message--name">{{accounts.name}}</span>
          <span class="user-info__message--tele">{{accounts.phone}}</span>
        </div>
        <img class="user-info__container--img" src="./assets/img/topright.png"/>
      </div>
    </div>
    <div class="filter-bar">
      <div
        :class="currentType === index ? 'act-type' : ''"
        :key="index"
        @click="changeOrder(index)"
        class="button-style"
        v-for="(item, index) in orderCategory"
      >{{item.name}}
      </div>
    </div>
    <van-list :finished="finished" :offset="offset" @load="onLoad" finished-text="没有更多了" v-model="loading">
      <van-cell :key="index" v-for="(order, index) in orders">
        <div class="order-group">
          <div class="order-group__item">
            <div @click="gotoOrder(order.order_number)" class="order-group__number">
              <div class="order-group__number--desc">
                <span class="order-group__number--title">订单编号:&nbsp;</span>
                <span class="order-group__number--num">{{order.order_number}}</span>
              </div>
              <span
                :class="[order.state === 'SUCCESS' ? 'success' : order.state === 'CLOSED' ? 'close' : order.state === 'WAITING' ? 'wait' : '']"
                class="order-group__state"
              >{{order.state === 'SUCCESS' ? '交易成功' : order.state === 'CLOSED' ? '交易关闭' : order.state === 'WAITING' ? '待付款' : ''}}</span>
            </div>
            <div :key="index" class="card" v-for="(order_item, index) in order.order_items">
              <div class="card-pic">
                <van-image
                  class="card-pic__url"
                  fit="fill"
                  radius="7"
                  :src="order_item.product.cover_img_url"
                >
                  <template v-slot:loading>
                    <van-loading size="20" type="spinner"/>
                  </template>
                </van-image>
              </div>
              <div @click="gotoOrder(order.order_number)" class="card__desc">
                <div class="card-name">
                  <span class="type-name">{{order_item.product.name}}</span>
                  <span :class="[typeColor(order_item)]" class="type-time">{{order_item.product.category.name}}</span>
                </div>
                <div class="card-site">{{order_item.product.sub_title}}</div>
                <div class="card__price">
                  <div class="pay-price">￥{{(order_item.total_price).toFixed(2)}}</div>
                  <span class="pay-num">X{{order_item.count}}</span>
                </div>
              </div>
            </div>
            <div class="order__detail">
              <span class="order__detail--price">￥{{(order.total_price_final).toFixed(2)}}</span>
              <span class="order__detail--desc">共{{order.order_items_count}}件商品&nbsp;合计:&nbsp;</span>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
  import './style.stylus'
  import go from '@utils/goto'

  export default {
    components: {},
    data () {
      return {
        orders: [],
        finished: false,
        loading: false,
        offset: 100,
        page: 1,
        size: 10,
        allItems: 0,
        accounts: {},
        count: null,
        orderCategory: [{ name: '团 课', type: 'GROUP_EXERCISE' }, { name: '卡 片', type: 'CARD' }, {
          name: '课 包',
          type: 'PACk'
        }],
        currentType: 0
      }
    },
    computed: {
      typeColor () {
        return function (card) {
          if (card.product.category.name === '月卡') {
            return 'yellow'
          }
          if (card.product.category.name === '季卡') {
            return 'orange'
          }
          if (card.product.category.name === '次卡') {
            return 'blue'
          }
          if (card.product.category.name === '年卡') {
            return 'pink'
          }
          return 'default'
        }
      }
    },
    watch: {},
    methods: {
      onLoad () {
        setTimeout(() => {
          this.getOrderInfo()
        }, 500)
      },
      getUserInfo () {
        this.$http.get('./personal/info').then(res => {
          this.accounts = res.data
        })
      },
      gotoOrder (orderNum) {
        go(`./orderDetail.html?order_num=${orderNum}`)
      },
      getOrderInfo () {
        const data = {
          type: this.orderCategory[this.currentType].type,
          page: this.page,
          size: this.size
        }
        this.page++
        this.$http
          .get('./personal/orders', { params: data })
          .then(res => {
            this.orders = this.orders.concat(res.data.items)
            this.allItems = this.allItems + res.data.items.length
            this.total = res.data.total
            this.loading = false
            if (this.allItems >= this.total) {
              this.finished = true
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      changeOrder (index) {
        this.currentType = index
        this.orders = []
        this.page = 1
        this.allItems = 0
        this.finished = false
        this.getOrderInfo()
      }
    },
    created () {
      this.getUserInfo()
    }
  }
</script>
