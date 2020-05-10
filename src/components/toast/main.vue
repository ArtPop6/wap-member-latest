<template lang="html">
  <transition name="toast">
    <div class="toast" v-show="show">
      <p class="message">{{message}}</p>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: null,
    duration: 2200,
    onClose: null,
  }),
  methods: {
    destroy() {
      const that = this;
      that.$el.removeEventListener('transitionend', that.destroy);
      that.$destroy();
      if (that.$el && that.$el.parentNode) {
        that.$el.parentNode.removeChild(that.$el);
      }
    },
    close() {
      const that = this;
      that.$el.addEventListener('transitionend', that.destroy);
      that.show = false;
    },
  },
  mounted() {
    const that = this;
    that.$nextTick(() => {
      setTimeout(that.close, that.duration);
    });
    that.show = true;
  },
};
</script>

<style scoped lang="stylus">
  .toast
    display block
    z-index 100
    position fixed
    bottom 10%
    left 50%
    margin 0 auto
    min-width 200px
    max-width 500px
    text-align center
    pointer-events none
    transform translateX(-50%) translateY(-50%)
    transition all .4s ease-in
    .message
      margin 0
      padding 24px 24px
      background-color rgba(0, 0, 0, .7)
      color #fff
      border-radius 20px
      font-size 28px
    &-enter,
    &-leave-active
      opacity 0
    &-enter
      bottom 5%
    &-leave-active
      bottom 15%
</style>
