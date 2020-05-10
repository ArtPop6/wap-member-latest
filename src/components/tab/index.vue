<template>
  <div>
    <div class="tabs">
      <div
        :class="index==select?'cardbottom':''"
        :key="index"
        @click="slectTab(index)"
        class="cardfoot_bottom"
        v-for="(tab,index) in tabname"
      >
        <img :src="tab.img" class="cardfoot_bottom-img" />
        <span class="cardfoot_bottom-text">{{tab.name}}</span>
      </div>
    </div>
    <div @click="gotoQrcode" class="tobcenter">
      <div class="tobcenter__qrcode">
        <img class="tobcenter__qrcodeimg" src="../../assets/stores/tab_img/qrcodes.png" />
        <span class="tobcenter__qrcodetext">二维码</span>
      </div>
    </div>
  </div>
</template>
<script>
import go from '@utils/goto'

export default {
  props: ['tabindex'],
  data() {
    return {
      select: this.tabindex,
      tabname: [
        { name: '首页', img: require('../../assets/stores/tab_img/index.png') },
        { name: '购卡', img: require('../../assets/stores/tab_img/kecheng.png') },
        { name: '二维码', img: '' },
        { name: '课程', img: require('../../assets/stores/tab_img/courseimg.png') },
        { name: '我的', img: require('../../assets/stores/tab_img/my.png') }
      ]
    }
  },
  methods: {
    slectTab(tabindex) {
      this.select = tabindex
      this.$emit('tabindexs', this.select)
      if (tabindex == 1) {
      }
    },
    gotoQrcode() {
      this.select = 2
      go(`./qrcode.html`)
    }
  }
}
</script>
<style lang="stylus" scoped>
.tobcenter
  position absolute
  bottom 12px
  left 301px
  width 148px
  height 148px
  border 1px solid #FAFAFC
  background #FFFFFFFF
  border-radius 100% 100% 0 0
  border-bottom none !important
  border-left none !important
  border-right none !important
  line-height 148px
  box-shadow 0 -2px 0 0 rgba(0, 0, 0, 0.1)
  padding-top 12px

  .tobcenter__qrcode
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 124px
    height 124px
    border-radius 100%
    line-height 64px
    margin 0 auto
    background $primary-color
    text-align center

    .tobcenter__qrcodeimg
      width 44px
      height 44px
      margin-bottom 10px

    .tobcenter__qrcodetext
      width 60px
      height 28px
      font-size 20px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      color rgba(0, 0, 0, 1)
      line-height 28px

.tabs
  display flex
  width 750px
  justify-content space-around
  // background rgba(250, 250, 252, 1) rgba(255, 255, 255, 1)
  background #fff
  box-shadow 0px -2px 4px 0px rgba(0, 0, 0, 0.1)

.cardbottom
  border-bottom 6px solid rgba(0, 0, 0, 1)

.cardfoot_bottom
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 64px
  height 98px

  .cardfoot_bottom-img
    width 32px
    height 32px

  .cardfoot_bottom-text
    width auto
    height 28px
    font-size 20px
    font-family PingFangSC-Regular, PingFang SC
    font-weight 400
    color rgba(0, 0, 0, 1)
    line-height 28px
</style>