<template>
  <div class="loading-spinner">
    <div class="bounce bounce1"></div>
    <div class="bounce bounce2"></div>
    <div class="bounce bounce3"></div>
  </div>
</template>

<style scoped lang="stylus">
.loading-spinner
  display inline-block
  .bounce
    display inline-block
    width 14px
    height 14px
    background-color #cecece
    border-radius 100%
    -webkit-animation bouncedelay 1.4s infinite ease-in-out
    animation bouncedelay 1.4s infinite ease-in-out
    -webkit-animation-fill-mode both
    animation-fill-mode both
  .bounce1
    -webkit-animation-delay -0.32s
    animation-delay -0.32s
  .bounce2
    -webkit-animation-delay -0.16s
    animation-delay -0.16s

@-webkit-keyframes bouncedelay
  0%, 80%, 100%
    -webkit-transform scale(0.0)
  40%
    -webkit-transform scale(.8)

@keyframes bouncedelay
  0%, 80%, 100%
    transform scale(0.0)
    -webkit-transform scale(0.0)
  40%
    transform scale(.8)
    -webkit-transform scale(.8)
</style>
