<template>
  <div class="app">
    <div class="top-header">
      <img alt class="filter" src="./assets/filter.png" />
      <div class="slogan">门店列表</div>
    </div>
    <div class="store-list__wrap">
      <div :key="index" class="store" v-for="(item, index) in storeList">
        <div @click="gotoDetail(item)" class="store-header">
          <div class="store-header__title">
            <div class="store-name">{{item.name}}</div>
            <div class="store-distance">
              <img alt class="store-distance__img" src="./assets/place.png" />
              <div class="store-distance__title">{{item.address}}.{{item.show_distance}}km</div>
            </div>
          </div>
          <div class="store-state">
            <div :class="item.status === 'UP' ? 'green' : 'red'" class="store-state__img"></div>
            <div class="store-state__title" v-if="item.status=='UP'">营业中</div>
            <div class="store-state__title" v-if="item.status=='DOWN'">未营业</div>
          </div>
        </div>
        <img :src="item.img" @click="gotoDetail(item)" alt class="store-content" />
        <div class="store-foot">
          <div class="store-footer">{{'配套设施：' + item.services}}</div>
          <div @click="goStore(item)" class="store_footer-button">进入该店>></div>
        </div>
      </div>
    </div>
    <div class="tab-bar">
      <Tabs :tabindex="tabindex" @tabindexs="goTab"></Tabs>
    </div>
  </div>
</template>

<script>
import './style.stylus'
import param from '@utils/url-param'
import toast from '../../components/toast'
import go from '@utils/goto'
import Tabs from '../../components/tab'

export default {
  components: {
    toast: toast,
    Tabs
  },
  data: () => ({
    storeList: [],
    tabindex: 0,
    greeting: {}
  }),
  methods: {
    goTab(data) {
      if (data === 2) {
        go(`./qrcode.html`)
      } else if (data === 4) {
        go(`./myCenter.html`)
      } else if (data === 1) {
        go(`./allCards.html`)
      } else if (data === 0) {
        go('./homePage.html')
      } else if (data === 3) {
        go('./groupClass.html')
      }
    },
    getList() {
      const listData = {
        lat: param('lat'),
        lon: param('lon')
      }
      this.$http.get(`/stores/list`, { params: listData }).then(res => {
        this.storeList = res.data
      })
    },
    gotoDetail(item) {
      go(`./storeDetail.html?id=${item.id}`)
    },
    goStore(item) {
      go(`./homePage.html?storeid=${item.id}`)
    }
  },
  created() {
    this.getList()
  }
}
</script>
