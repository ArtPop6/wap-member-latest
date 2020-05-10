<template>
  <section class="layout-loading">
    <slot v-if="loadingDirection === 'up'"></slot>
    <div class="loading-tip" v-show="loading">
      <LoadingBounces></LoadingBounces>&nbsp;加载中...
    </div>
    <div class="loaded-tip">
        <template v-if="loaderror">
            加载出现错误，请重试
        </template>
        <template v-if="nomore">
            没有更多了
        </template>
    </div>
    <slot v-if="loadingDirection === 'down'"></slot>
  </section>
</template>

<script>
  import LoadingBounces from './loading-bounce';

  export default {
    components: {
      LoadingBounces,
    },
    props: {
      /**
      * nomore 没有数据了
      * loading 加载中
      * loaderror 加载出错
      * loadingDirection up上拉, down下拉
      **/
      nomore: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      loaderror: {
        type: Boolean,
        default: false
      },
      loadingDirection: {
        type: String,
        default: 'up'
      },
    },
    data() {
      return {
        loadingContainer: null,
        offset: 100,
        offScroll: false,
      };
    },
    watch: {
      nomore: function(val){
        if (val) {
          console.log('nomore');
          this.detach();
        } else if (this.offScroll) {
          this.attach();
        }
      }
    },
    methods: {
      attach() {
        this.loadingContainer.addEventListener('scroll', this.scrollListener);
      },
      detach() {
        this.loadingContainer.removeEventListener('scroll', this.scrollListener);
        this.offScroll = true;
      },
      scrollListener(){
        const { scrollTop, clientHeight, scrollHeight } = this.loadingContainer;
        // console.log(clientHeight , scrollTop , this.offset , scrollHeight);

        if(!this.loading && !this.nomore){
          if (scrollTop < this.offset) {
            console.log('Top', scrollTop);
            this.$emit('inScrollTop', scrollTop);
          } else if(clientHeight + scrollTop + this.offset >= scrollHeight) {
            console.log('Bottom', scrollTop);
            this.$emit('inScrollBottom', scrollTop);
          }
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.loadingContainer = this.$el;
        if (this.nomore) {
          this.detach();
        } else {
          this.attach();
        }
      });
    },
  };
</script>

<style scoped lang="stylus">
.layout-loading
  width 100%
  height 100%
  overflow-y auto
  -webkit-overflow-scrolling touch
.loading-tip,
.loaded-tip
  padding 20px
  font-size 24px
  line-height 44px
  color #999
  text-align center
  .fi-loading
    margin-right 10px
    color #cecece
</style>
