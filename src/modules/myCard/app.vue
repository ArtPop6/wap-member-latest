<template>
  <div class="mycard">
    <div class="cardheader">
      <div class="cardheader_foot">
        <div class="cardheader_foot-left">
          <img :src="accounts.avatar" class="cardheader_foot-photo" />
        </div>
        <div class="cardheader_foot-right">
          <span class="cardheader_foot-rtname">{{accounts.name}}</span>
          <span class="cardheader_foot-rtphone">{{accounts.phone}}</span>
        </div>
        <img class="cardheader_foot-rtimg" src="./assets/img/topright.png" />
      </div>
    </div>
    <van-pull-refresh @refresh="onRefresh" class="cardcenter" v-model="isLoading">
      <div :key="index" class="cardcenter_card" v-for="(cards,index) in card">
        <div class="cardcenter_card-right">
          <img :src="cards.card_img" class="cardcenter_card-rtimg" />
          <!-- <span class="cardcenter_card-nvshen">女神卡</span> -->
        </div>
        <div class="cardcenter_card-left">
          <span class="cardcenter_card-name">{{cards.card_name}}</span>
          <span class="cardcenter_card-dated" v-if="cards.card_status=='已激活'">{{cards.card_expired_time}}</span>
          <span class="cardcenter_card-time" v-if="cards.card_status=='已激活'">{{cards.card_active_time}}</span>
          <span class="cardcenter_card-notime" v-if="cards.card_status=='未激活'">{{cards.card_status}}</span>
          <span class="cardcenter_card-yestime" v-if="cards.card_status=='已过期'">{{cards.card_status}}</span>
          <span :class="[typeColor(cards.card_term_name)]" class="cardcenter_card-cardname">{{cards.card_term_name}}</span>
          <!-- <span class="cardcenter_card-cardname orange" v-if="cards.card_term_name=='季卡'">{{cards.card_term_name}}</span>
          <span class="cardcenter_card-cardname yellow" v-if="cards.card_term_name=='月卡'">{{cards.card_term_name}}</span>
          <span class="cardcenter_card-cardname blue" v-if="cards.card_term_name=='次卡'">{{cards.card_term_name}}</span>-->
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import toast from '../../components/toast'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      card: [],
      accounts: {}
    }
  },
  watch: {},
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.$http.get('/personal/cards').then(res => {
          this.card = res.data
        })
        toast('刷新成功')
        this.isLoading = false
      }, 1000)
    },
    list() {
      this.$http.get('/personal/cards').then(res => {
        this.card = res.data
      })
      this.$http.get('/personal/info').then(res => {
        this.accounts = res.data
      })
    }
  },
  created() {
    this.list()
  },
  computed: {
    typeColor() {
      return function(cardType) {
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
    }
  }
}
</script>   