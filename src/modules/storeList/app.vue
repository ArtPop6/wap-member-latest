<template>
  <div class="app">
    <div class="list" tag="div">
      <div :key="item.id" @click="gotoDetail(item)" class="cell" v-for="item in list">
        <div class="img">
          <img :src="item.img" alt />
        </div>

        <div class="fs">
          <h2>{{item.name}}</h2>
          <p>{{item.card_count}}种卡在售</p>
        </div>

        <div class="position" v-if="false">
          <img alt src="@/assets/stores/dingwei_yellow.png" />
          <span class="position_num">5.6</span>
          <span class="position_km">KM</span>
        </div>
      </div>
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
  data: () => ({
    list: []
  }),
  methods: {
    getList() {
      return this.$http.get(`/stores?q=nearest`).then(res => {
        this.list = res.data
      })
    },

    gotoDetail(item) {
      go(`./storeDetail.html?id=${item.id}`)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
