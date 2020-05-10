<template>
  <section class="share-wrapper" v-if="show" @click="hideShare">
    <p>点击右上角分享给好友哦<i class="fi fi-arrow-top"></i></p>
  </section>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      hideShare() {
        this.$emit('hideShare', true);
      },
    },
  };
</script>

<style scoped lang="stylus">
  .share-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    width 100%
    height 100%
    background rgba(0, 0, 0, .8)
    text-align right
    color #fff
    font-size 28px
    animation shareShow 1s
    z-index 2
    p
      padding-top 40px
    .fi
      font-size 80px

  @keyframes shareShow
    from
      opacity 0
    to
      opacity 1
</style>
