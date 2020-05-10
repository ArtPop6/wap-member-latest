
<template>
  <div class="plotlybars-wrapper">
    <div class="plotlybars">
      <div class="plotlybars-bar b1"></div>
      <div class="plotlybars-bar b2"></div>
      <div class="plotlybars-bar b3"></div>
      <div class="plotlybars-bar b4"></div>
      <div class="plotlybars-bar b5"></div>
      <div class="plotlybars-bar b6"></div>
      <div class="plotlybars-bar b7"></div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  .plotlybars-wrapper
    position relative
    width 60px
    height 27px
    padding-bottom 10px
  .plotlybars
    position relative
    overflow hidden
    width 100%
    height 100%
    vertical-align bottom
  .plotlybars-bar
    position absolute
    width 12%
    height 100%
    background-color #fff
    transform translateZ(0)
    animation-duration 1.5s
    animation-iteration-count infinite
    animation-direction normal
    animation-timing-function linear

  .b1 { left: 0%; top: 88%; animation-name: b1; }
  .b2 { left: 14.3%; top: 76%; animation-name: b2; }
  .b3 { left: 28.6%; top: 16%; animation-name: b3; }
  .b4 { left: 42.9%; top: 40%; animation-name: b4; }
  .b5 { left: 57.2%; top: 26%; animation-name: b5; }
  .b6 { left: 71.5%; top: 67%; animation-name: b6; }
  .b7 { left: 85.8%; top: 89%; animation-name: b7; }

  @keyframes b1 { 0% { top: 88%; } 44% { top: 0%; } 94% { top: 100%; } 100% { top: 88%; } }
  @keyframes b2 { 0% { top: 76%; } 38% { top: 0%; } 88% { top: 100%; } 100% { top: 76%; } }
  @keyframes b3 { 0% { top: 16%; } 8% { top: 0%; } 58% { top: 100%; } 100% { top: 16%; } }
  @keyframes b4 { 0% { top: 40%; } 20% { top: 0%; } 70% { top: 100%; } 100% { top: 40%; } }
  @keyframes b5 { 0% { top: 26%; } 13% { top: 0%; } 63% { top: 100%; } 100% { top: 26%; } }
  @keyframes b6 { 0% { top: 67%; } 33.5% { top: 0%; } 83% { top: 100%; } 100% { top: 67%; } }
  @keyframes b7 { 0% { top: 89%; } 44.5% { top: 0%; } 94.5% { top: 100%; } 100% { top: 89%; } }
</style>
