<template>
  <div class="details">
    <div class="details_body">
      <div class="details_body-img">
        <img :src="details.img" class="details_body-imgs" />
        <div class="details_bode-shadow"></div>
        <span class="details_body-name">{{details.name}}</span>
        <span class="details_body-card">{{details.type}}</span>
      </div>
      <span class="details_body-title">{{details.subtitle}}</span>
      <div class="details_body-shop">
        <div class="details_shop-top">
          <span class="details_shop-apply">适用门店</span>
          <div>
            <img class="details_shop-imgs" src="./assets/img/wz.png" />
            <span class="details_shop-location">福建厦门</span>
          </div>
        </div>
        <div class="details_shop-bottom">
          <span :key="index" class="details_shop-outlet" v-for="(detail,index) in details.stores">{{detail.name}}</span>
        </div>
      </div>
      <div class="details_body-explain">
        <span class="details_explain-card">卡片说明</span>
      </div>
    </div>
    <span class="details_explain-text">{{details.description_html}}</span>
    <div class="details_foot">
      <div class="details_foot-cards">&yen;{{details.price}}</div>
      <div @click="gotoShop" class="details_foot-shoping">立即购买</div>
    </div>
  </div>
</template>

<script>
import './style.stylus'
import param from '@utils/url-param'
import toast from '../../components/toast'
import go from '@utils/goto'

export default {
  components: {
    toast: toast
  },
  data() {
    return {
      details: {}
    }
  },
  methods: {
    list() {
      const detailDate = {
        store_id: param('store_id'),
        product_id: param('product_id'),
        product_sku_id: param('sku_id')
      }
      this.$http.get('cards/detail', { params: detailDate }).then(res => {
        this.details = res.data
      })
    },
    gotoShop() {
      const storeId = param('store_id')
      const productId = param('product_id')
      const skuId = param('sku_id')
      go(`./confirmOrder.html?store_id=${storeId}&product_id=${productId}&sku_id=${skuId}`)
    }
  },
  created() {
    this.list()
  }
}
</script>
