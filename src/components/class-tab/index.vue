<template>
  <div class="class-tab">
    <div :key="index" class="class-item" v-for="(item, index) in tabBar">
      <div :class="index === currentIndex ? 'changeStyle' : 'class-type'" @click="selectTab(index)">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
import go from '@utils/goto'

const tabsConfig = [
  {
    name: '团课'
  },
  {
    name: '私教'
  }
]

export default {
  props: ['tabIndex'],
  data() {
    return {
      tabBar: tabsConfig,
      currentIndex: this.tabIndex
    }
  },
  methods: {
    selectTab(index) {
      this.$emit('indexChange', index)
    }
  }
}
</script>
<style lang="stylus">
.class-tab
  width 100%
  display flex
  height 132px
  background #FDE001
  color #0F0F0F

  .class-item
    width 50%
    height 100%
    font-size 30px

    .changeStyle:after
      content ''
      margin 0 auto
      position absolute
      left 0
      right 0
      bottom 0
      width 40px
      height 8px
      background-color #000

    .changeStyle
      height 100%
      position relative
      font-family PingFangSC-Medium
      display flex
      align-items center
      justify-content space-around
      font-weight 550

    .class-type
      height 100%
      display flex
      align-items center
      justify-content space-around
      font-family PingFangSC-Regular
      letter-spacing -0.25px
      font-weight normal
</style>