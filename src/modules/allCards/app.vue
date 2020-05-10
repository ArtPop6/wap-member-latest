<template>
  <div class="personal">
    <div class="personal_top">
      <div class="personal_top-head">
        <img class="personal_top-headimg" src="../../assets/stores/place.png" />
        <span class="personal_top-headspan">厦门</span>
        <span class="personal_top-allcard">所有卡片</span>
      </div>
      <div class="personal_top-show">
        <div class="personal_top-region">
          <div class="personal_top-bottom">
            <van-dropdown-menu :overlay="false" active-color="#fcdb00">
              <van-dropdown-item :options="option" @change="seleregion(value)" v-model="value" />
            </van-dropdown-menu>
          </div>
        </div>
        <div class="personal_top-region">
          <div class="personal_top-bottom decorate">
            <div
              :class="index == selectname ? 'posnal-top_selectname' : ''"
              :key="index"
              @click="selectCard(index)"
              class="posnal-top_name"
              v-for="(types,index) in type"
            >{{types.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <van-pull-refresh @refresh="onRefresh" class="personal_center" v-model="isLoading">
      <div :key="index" class="personal_center-shop" v-for="(coach,index) in coachs">
        <div class="personal_center-shopname">
          <img class="personal_center-shopimg" src="../../assets/stores/shop_place.png" />
          {{coach.store_name}}
        </div>
        <div :key="index" class="personal_center-img" v-for="(cards, index) in coach.cards">
          <img :src="cards.img" @click="details(cards,coach)" class="personal_center-nvshen" />
          <div @click="details(cards,coach)" class="personal_center-cover"></div>
          <span @click="details(cards,coach)" class="personal_center-cardname">{{cards.name}}</span>
          <span @click="details(cards,coach)" class="personal_center-price">&yen;{{cards.price}}</span>
          <span @click="details(cards,coach)" class="personal_center-apply">{{cards.apply}}</span>
          <span @click="details(cards,coach)" class="personal_center-pci">{{cards.type}}</span>
          <span @click="details(cards,coach)" class="personal_center-residue">余{{cards.stock}}张</span>
          <button @click="gotoShopping(cards,coach)" class="personal_center-submit">立即购买</button>
        </div>
      </div>
    </van-pull-refresh>
    <div class="cardfoot">
      <Tabs :tabindex="tabindex" @tabindexs="goTab"></Tabs>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import toast from '../../components/toast'
import Tabs from '../../components/tab'
import param from '@utils/url-param'

export default {
  components: {
    Tabs
  },
  data() {
    return {
      tabindex: 1,
      isLoading: false,
      value: '',
      option: [],
      type: [],
      selectname: 0,
      category_id: '',
      store_id: '',
      coachs: [],
      channel: param('channel')
    }
  },
  watch: {},
  methods: {
    goTab(data) {
      if (data == 0) {
        go(`./homePage.html`)
      } else if (data == 2) {
        go(`./qrcode.html`)
      } else if (data == 4) {
        go(`./myCenter.html`)
      } else if (data == 3) {
        go(`./groupClass.html`)
      } else {
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.listConditions()
        toast('刷新成功')
        this.isLoading = false
      }, 1000)
    },
    seleregion(value) {
      this.store_id = value
      this.listConditions()
    },
    list() {
      this.$http.get('/cards/conditions').then(res => {
        this.allcard = res.data
        this.option = res.data.stores
        this.type = res.data.types
      })
    },
    listConditions() {
      const coach = {
        store_id: this.store_id,
        category_id: this.category_id
      }
      this.$http.get('/cards', { params: coach }).then(res => {
        this.coachs = res.data
      })
    },
    selectCard(index) {
      this.selectname = index
      this.category_id = this.type[index].value
      this.listConditions()
    },
    details(items, coachitem) {
      go(
        `./cardDetails.html?product_id=${items.product_id}&store_id=${coachitem.store_id}&sku_id=${items.product_sku_id}&channel=${this.channel}`
      )
    },
    gotoShopping(items, coachitem) {
      go(
        `./confirmOrder.html?product_id=${items.product_id}&store_id=${coachitem.store_id}&sku_id=${items.product_sku_id}&channel=${this.channel}`
      )
    }
  },
  created() {
    this.list()
    this.listConditions()
  }
}
</script>
