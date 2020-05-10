<template>
  <div class="no-data">
    <p>{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="stylus">
  .no-data
    margin 0px
    padding 0px
    background-image url('../assets/img/nodata.png')
    background-size 318px 230px
    background-repeat no-repeat
    background-position center center
    color #999
    text-align center
    font-size 28px
    width 100%
    height 100%
</style>
