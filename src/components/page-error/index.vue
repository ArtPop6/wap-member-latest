<template>
  <section class="page-error">
    <i class="page-error-icon"></i>
    <p>{{text}}</p>
  </section>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '页面出错啦',
      },
    },
  };
</script>

<style scoped lang="stylus">
  .page-error
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    width 100%
    height 100%
    background #fff
    text-align center
    color #999
    font-size 28px
    z-index 2
    .page-error-icon
      display inline-block
      margin-top 300px
      width 216px
      height 224px
      background-size contain
      background-position center center
      background-image url('./img/error.jpg')

</style>
